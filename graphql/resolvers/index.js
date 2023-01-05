const authResolver = require("./auth");
const movieResolver = require("./movie");

const rootResolver = [authResolver, movieResolver];

module.exports = rootResolver;
