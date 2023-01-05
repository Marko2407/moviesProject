const Movie = require("../../models/movie");
const User = require("../../models/user");
const { customError } = require("../../helpers/errorHandler");
const { user } = require("./auth");
const { errorName } = require("../../helpers/constants");
const { GraphQLError} = require("graphql")

module.exports = {
  RootQuery: {
    movies: async () => {
      try {
        const result = await Movie.find();
        return result;
      } catch (error) {
        throw error;
      }
    },
    movieById: async ({ movieId }) => {
      try {
        const result = await Movie.findById(movieId);
        return result;
      } catch (error) {
        throw error;
      }
    },
  },
  RootMutation: {
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
        category: args.movieInput.category,
      });

      try {
        const result = await movie.save();
        return result;
      } catch (error) {
        throw error;
      }
    },

    addToFavorite: async (_p,{ movieId, userId },_c,_i) => {
      try {
        console.log(movieId)
        const user = await User.findById(userId);
        const movie = await Movie.findById(movieId);
        if (!user || !movie) {
           throw new Error(errorName.USER_ALREADY_EXISTS); 
        }
        const checkDuplicate = await User.exists({ favoriteMovies: movieId });
        if (checkDuplicate) {
             throw new Error(errorName.USER_ALREADY_EXISTS);
      
        }
        user.favoriteMovies.push(movie);
        await user.save();
        return movie;
      } catch (error) {
        throw error;
      }
    },
  },
};