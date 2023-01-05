const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const getErrorCode = require("./helpers/getError.js")
const grapqhlSchema = require("./graphql/schema/index");
const graphqlResolvers = require("./graphql/resolvers/index");
const { GraphQLError } = require("graphql");
const { ApolloServer } = require("apollo-server-express");

  async function startServer() {
 
    const app = express();

    app.use(bodyParser.json());

    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, GET,OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      if (req.method === "OPTIONS") {
        return res.sendStatus(200);
      }
      next();
    });

    const apolloServer = new ApolloServer({
    typeDefs: grapqhlSchema,
    resolvers: graphqlResolvers,
    formatError: (err) => {
      const error = getErrorCode(err.message);
      return { message: error.message, statusCode: error.statusCode };
    }
  });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app: app });

    app.use((req, res) => {
    res.send('Hello from express appolo server');
  });
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => {
    app.listen(8000);
    console.log("mongoose connected");
  })
  .catch((err) => {
    console.log(err);
  });
}

startServer();
