const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	"username": "",
	"shortId": "",
	"exercises": [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Exercise"
	}]
})

let User = mongoose.model("User", userSchema);
module.exports = User;