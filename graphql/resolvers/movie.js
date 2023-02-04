const Movie = require("../../models/movie");
const User = require("../../models/user");
const { customError } = require("../../helpers/errorHandler");
const { Transformmovies } = require("../resolvers/merge");
const { user } = require("./auth");
const { errorName } = require("../../helpers/constants");
const { GraphQLError } = require("graphql");
const movie = require("../../models/movie");

function scaleMovieCounter(categoriesWithCounter, totalNumber) {
	categoriesWithCounter.forEach((element) => {
		element.counter = Math.round((element.counter / totalNumber) * 10);
	});
	return categoriesWithCounter;
}
const shuffled = (movies) =>
	movies
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);

function generateUserCategory(userFavoriteMovies) {
	let categoriesWithCounter = [];
	userFavoriteMovies.forEach((movie) => {
		if (!categoriesWithCounter.find((el) => el.category == movie.category[0])) {
			categoriesWithCounter.push({ category: movie.category[0], counter: 0 });
		}
		const movieCounter = categoriesWithCounter.find(
			(el) => el.category == movie.category[0]
		);
		movieCounter.counter += 1;
	});
	return scaleMovieCounter(categoriesWithCounter, userFavoriteMovies.length);
}

function sliceMovies(movies, number) {
	if (movies.length > 10) {
		return movies.slice(0, number);
	} else return movies;
}

function findMostRatedMovies(movies) {
	const ratedMovies = movies.sort((a, b) => (a.rating < b.rating ? 1 : -1));
	return sliceMovies(ratedMovies, 10);
}

function findMostPopularMovies(movies) {
	const popularMovies = movies.sort((a, b) =>
		a.favoriteCounter < b.favoriteCounter ? 1 : -1
	);
	return sliceMovies(popularMovies, 10);
}

function findMoviesByMostFavCategory(movies, userFavoriteMovies) {
	const generatorCategories = generateUserCategory(userFavoriteMovies);
	let personalRecommendation = [];
	generatorCategories.forEach((category) => {
		const filteredMovies = movies.filter(
			(movie) => movie.category[0] == category.category
		);
		const slicedMovies = filteredMovies.slice(0, category.counter);
		for (let index = 0; index < slicedMovies.length; index++) {
			personalRecommendation.push(slicedMovies[index]);
		}
	});
	return personalRecommendation;
}

function getMoviesByCategories(movies) {
	let categories = [];
	movies.forEach((movies) => {
		if (!categories.find((el) => el.category == movies.category[0])) {
			categories.push({
				category: movies.category[0],
				movies: [],
			});
		}
		categories
			.find((el) => el.category == movies.category[0])
			.movies.push(movies);
	});
	return categories;
}

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
					$or: [
						{ title: { $regex: searchInput, $options: "i" } },
						{ description: { $regex: searchInput, $options: "i" } },
					],
				});

				return searchResult;
			} catch (error) {
				throw error;
			}
		},
		moviesRecommendation: async (_p, { userId }, _c, _i) => {
			try {
				const movies = await Movie.find();
				const user = await User.findById(userId);
				if (user == undefined) {
					throw new Error(errorName.USER_NOT_FOUND);
				}
				if (!movies) {
					throw new Error(errorName.UNKNOWN);
				}

				const userMovies = await Transformmovies(user.favoriteMovies);
				const mostRatedMovies = findMostRatedMovies(movies);
				const mostPopularMovies = findMostPopularMovies(shuffled(movies));
				const personalMovieGenerator = findMoviesByMostFavCategory(
					shuffled(movies),
					userMovies
				);

				return {
					mostRatedMovies: mostRatedMovies,
					mostPopularMovies: mostPopularMovies,
					personalMovies: personalMovieGenerator,
				};
			} catch (error) {
				throw error;
			}
		},
		moviesByCategories: async (_p, _args, _c, _i) => {
			try {
				const movies = await Movie.find();
				return getMoviesByCategories(movies);
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
				favoriteCounter: 0,
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
				movie.favoriteCounter += 1;
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
				movie.favoriteCounter -= 1;
				user.favoriteMovies.pull(movie);
				await user.save();
				return movie;
			} catch (error) {
				throw error;
			}
		},
	},
};

module.exports = movies;
