const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

MONGO_DB_URL =
  "mongodb+srv://user:user@projects.6uu4x9e.mongodb.net/movies-dev?retryWrites=true&w=majority";
const grapqhlSchema = require("./graphql/schema/index");
const graphqlResolvers = require("./graphql/resolvers/index");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  "/graphql",
  graphqlHttp.graphqlHTTP({
    schema: grapqhlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);
mongoose.set("strictQuery", false);
mongoose
  .connect(
   MONGO_DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoIndex: true,
    }
  )
  .then(() => {
    app.listen(8000);
  })
  .catch((err) => {
    console.log(err);
  });
