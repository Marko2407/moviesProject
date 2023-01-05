const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

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
    customFormatErrorFn: (err) => {
      return err.message;
    },
  })
);
mongoose.set("strictQuery", false);
mongoose
  .connect(
   process.env.MONGO_DB_URL, {
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
