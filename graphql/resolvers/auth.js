const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const { customError } = require("../../helpers/errorHandler");
const { transformMovies, transformUser } = require("../resolvers/merge");

function generateAccessToken(userId) {
  return jwt.sign({ userId: userId }, process.env.SECURE_ACCESS_TOKEN_KEY, {
    expiresIn: "30s",
  });
}

module.exports = {
  user: async () => {
    const users = await User.find();
    return users;
  },
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
        refreshToken: null,
      });
      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },

  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("User does not exist!");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Invalid credentials!");
      }
      const token = generateAccessToken(user.id);
      const refreshToken = jwt.sign(
        user.id,
        process.env.SECURE_REFRESH_TOKEN_KEY
      );
      await User.findByIdAndUpdate(user.id, { refreshToken: refreshToken });
      return {
        userId: user.id,
        token: token,
        refreshToken: refreshToken,
        tokenExpired: 1,
      };
    } catch (error) {
      throw error;
    }
  },
  newAccessToken: async (args) => {
    try {
      const user = await User.findById(args.userId);
      if (!user) {
        throw customError("Unable to find user", 404);
      }
      if (user.refreshToken === args.refreshToken) {
        return jwt.verify(
          user.refreshToken,
          process.env.SECURE_REFRESH_TOKEN_KEY,
          (err, user) => {
            if (err) throw new Error("unable to verify!");
            token = generateAccessToken(user);
            return {
              token: token,
              expired: 1,
            };
          }
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  userInfo: async ({userId}) => {
    try{
        const user = await User.findById(userId.toString())
        if (!user) {
          throw customError("Unable to find user", 404);
        }
        return transformUser(user);
    }catch(err){
        console.log(err)
        throw err
    }
  },
};
