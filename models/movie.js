const mongoose = require("mongoose");
const { category } = require("../helpers/enums");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	img: {
		type: String,
	},
	url: {
		type: String,
	},
	category: [{ type: String, enum: category, default: category.NONE }],
	duration: {
		type: Number,
		required: true,
	},
	releaseDate: {
		type: Date,
		required: true,
	},
	rating: {
		type: Number,
	},
	favoriteCounter: {
		type: Number,
		default: 0,
	},
});

module.exports = mongoose.model("Movie", movieSchema);
