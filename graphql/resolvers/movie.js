const Movie = require("../../models/movie");
const User = require("../../models/user");
const { customError } = require("../../helpers/errorHandler");
const { user } = require("./auth");
const { errorName } = require("../../helpers/constants");
const { GraphQLError} = require("graphql")

module.exports = {
  movies: async () => {
    try {
      const result = await Movie.find();
      return result;
    } catch (error) {
      throw error;
    }
  },
  movieById: async ({movieId}) => {
    try {
      const result = await Movie.findById(movieId);
      return result;
    } catch (error) {
      throw error;
    }
  },
  createMovie: async (args) => {
    console.log(args.movieInput.category);
    const movie = new Movie({
      title: args.movieInput.title,
      description: args.movieInput.description,
      img: args.movieInput.img,
      url: args.movieInput.url,
      duration: args.movieInput.duration,
      releaseDate: new Date(args.movieInput.releaseDate),
      rating: args.movieInput.rating,
      category: args.movieInput.category
    });

    try {
      const result = await movie.save();
      return result;
    } catch (error) {
      throw error;
    }
  },
  addToFavorite: async({movieId, userId}) =>{
    try {
      const user = await User.findById(userId);
      const movie = await Movie.findById(movieId);
      if (!user || !movie) {
         throw customError("Unable to find movie", 404);
      }
      const checkDuplicate = await User.exists({ favoriteMovies: movieId });
      if (checkDuplicate) {
         throw new GraphQLError("deadline passed");
      }

      user.favoriteMovies.push(movie);
      await user.save();
      return movie;
    } catch (error) {
      console.log(error);
        throw error
    }
  }
};