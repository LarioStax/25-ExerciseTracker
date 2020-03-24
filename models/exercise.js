const mongoose = require("mongoose");

//SCHEMA SETUP

let exerciseSchema = new mongoose.Schema({
	description: String,
	duration: Number,
	date: {
		type: Date,
		default: Date.now,
	},
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
	}
});

let Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;