const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const { customError } = require("../../helpers/errorHandler");
const { transformMovies, transformUser } = require("../resolvers/merge");
const { errorName } = require("../../helpers/constants");
const { GraphQLError } = require("graphql");


function generateAccessToken(userId) {
  return jwt.sign({ userId: userId }, process.env.SECURE_ACCESS_TOKEN_KEY, {
    expiresIn: "30s",
  });
}

const authResolver = {
  RootQuery: {
    user: async () => {
      const users = await User.find();

      users.map((user) => {
        transformUser(user);
      });
      return users;
    },
    login: async (_p, { email, password }, _c, _i) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          throw new Error(errorName.USER_ALREADY_EXISTS);
         }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error(errorName.USER_ALREADY_EXISTS);
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

    userInfo: async (_p, args, _c, _i) => {
      try {
        const user = await User.findById(args.userId.toString());
        if (!user) {
          throw customError("Unable to find user", 404);
        }
        return transformUser(user);
      } catch (err) {
         throw err;
      }
    },
  },
  RootMutation: {
    createUser: async (_ep, args, _ec, _ei) => {
      try {
        const existingUser = await User.findOne({
          email: args.userInput.email,
        });
        if (existingUser) {
          throw new GraphQLError(errorName.USER_ALREADY_EXISTS);
        }
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
        const user = new User({
          fullName: args.userInput.fullName,
          email: args.userInput.email,
          password: hashedPassword,
          refreshToken: null,
        });
        const result = await user.save();
        return { ...result._doc, password: null };
      } catch (err) {
        throw err
      }
    },
    newAccessToken: async (_p, args, _c, _i) => {
      try {
        const user = await User.findById(args.userId);
        if (!user) {
              throw new Error(errorName.USER_ALREADY_EXISTS);
        }
        if (user.refreshToken === args.refreshToken) {
          return jwt.verify(
            user.refreshToken,
            process.env.SECURE_REFRESH_TOKEN_KEY,
            (err, user) => {
              if (err) throw new Error(errorName.USER_ALREADY_EXISTS);
              token = generateAccessToken(user);
              return {
                token: token,
                expired: 1,
              };
            }
          );
        }
      } catch (error) {
          throw error;
      }
    },
  },
};

module.exports = authResolver