const { buildSchema } = require("graphql");

module.exports = buildSchema(`
         type User{
            _id: ID!
            fullName: String!
            email: String!
            password : String
            refreshToken: String
            favoriteMovies: [Movie]
        }

        enum Category{
            ACTION
            NONE
            COMEDY
            MARVEL
            DC
            HOROR
            ANIMATION
            ROMANTIC
        }

    

        type ListRecommendedMovies{
            recommendationType: String,
            movies:[Movie!]
        }

        type RecommendedMovies{
            mostRatedMovies: [Movie!]
            mostPopularMovies: [Movie!]
            personalMovies:[Movie!]
        }

        type Movie{
            _id:ID!
            title: String!
            description: String!
            img: String
            url: String
            category: [Category]
            duration: Int!
            releaseDate: String!
            rating: Float
            favoriteCounter: Int
        }

        type AuthData{
            userId: ID!
            token: String!
            refreshToken: String!
            tokenExpired: Int!
        }

        type MoviesByCategories{
            category: String!,
            movies: [Movie!]
        }

        type Token{
            token: String!
            expired: Int!
        }

        input MovieInput{
            title: String!
            description: String!
            img: String
            url: String
            category: [Category]
            duration: Int!
            releaseDate: String!
            rating: Float
        }
        input UserInput{
            fullName: String!
            email: String!
            password: String!
        }

        type RootQuery{
            user: [User!]
            userInfo(userId: ID!): User
            login(email: String!, password: String!):AuthData!
            movies: [Movie!]
            movieById(movieId: ID!): Movie!
            moviesBySearchInput(searchInput: String!): [Movie!]
            moviesRecommendation(userId: ID!): [ListRecommendedMovies!]
            moviesByCategories:[MoviesByCategories!]
        }
        type RootMutation{
            createUser(userInput: UserInput!): User
            createMovie(movieInput: MovieInput!): Movie
            newAccessToken(userId: String!,refreshToken: String!): Token!
            addToFavorite(movieId: ID!, userId: ID!): Movie!
            removeFromFavorite(movieId: ID!, userId: ID!): Movie!
        }
    schema{
        query: RootQuery
        mutation:RootMutation
}
`);
