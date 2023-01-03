const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  favoriteMovies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
