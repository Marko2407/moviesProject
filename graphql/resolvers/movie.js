const Movie = require("../../models/movie");
const User = require("../../models/user");
const { customError } = require("../../helpers/errorHandler");
const { user } = require("./auth");
const { errorName } = require("../../helpers/constants");
const { GraphQLError} = require("graphql")

const movies = {
  RootQuery: {
    movies: async () => {
      try {
        const result = await Movie.find();
        return result;
      } catch (error) {
        throw error;
      }
    },
    movieById: async (_p, { movieId }, _c, _i) => {
      try {
        const result = await Movie.findById(movieId);
        return result;
      } catch (error) {
        throw error;
      }
    },
    moviesBySearchInput: async (_p, { searchInput }, _c, _i) => {
      try {
        const searchResult = await Movie.find({
          $or:[{title: { $regex: searchInput, $options: "i" }},
          {description: { $regex: searchInput, $options: "i" }},]
        });

        return searchResult;
      } catch (error) {
        throw error;
      }
    },
  },
  RootMutation: {
    createMovie: async (_p, args, _c, _i) => {
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
    addToFavorite: async (_p, { movieId, userId }, _c, _i) => {
      try {
        const user = await User.findById(userId);
        const movie = await Movie.findById(movieId);
        if (!user) {
          throw new GraphQLError(errorName.USER_NOT_FOUND);
        }
        if (!movie) {
          throw new GraphQLError(errorName.MOVIE_NOT_FOUND);
        }
        const checkDuplicate = user.favoriteMovies.includes(movieId);
        if (checkDuplicate) {
          throw new GraphQLError(errorName.UNKNOWN);
        }
        user.favoriteMovies.push(movie);
        await user.save();
        return movie;
      } catch (error) {
        throw error;
      }
    },

    removeFromFavorite: async (_p, { movieId, userId }, _c, _i) => {
      try {
        const user = await User.findById(userId);
        const movie = await Movie.findById(movieId);
        if (!user) {
          throw new GraphQLError(errorName.USER_NOT_FOUND);
        }
        if (!movie) {
          throw new GraphQLError(errorName.MOVIE_NOT_FOUND);
        }
        user.favoriteMovies.pull(movie);
        await user.save();
        return movie;
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = movies
