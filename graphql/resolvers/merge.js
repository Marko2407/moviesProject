const Movie = require("../../models/movie");
const User = require("../../models/user");

const movies = async (moviesIds) => {
  try {
    const movies = await Movie.find({ _id: { $in: moviesIds } });
     return movies.map((movie) => {
       return transformMovies(movie);
     });   
  } catch (err) {
    throw err;
  }
};

const transformUser = (user) => {
    return {
      ...user._doc,
      favoriteMovies: movies.bind(this, user._doc.favoriteMovies),
    };
}

const transformMovies = (movie) => {
  return {
    ...movie._doc,
    };
};


 exports.transformUser = transformUser;
 exports.transformMovies = transformMovies;