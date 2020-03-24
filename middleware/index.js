const User = require("../models/user.js");

let middlewareObject = {};

middlewareObject.checkUsername = function(req, res, next) {
	User.find({username: req.body.username}, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else if (foundUser.length !== 0) {
			res.json({"Error": "Username already taken!"})
		} else {
			next();
		}
	})
}

module.exports = middlewareObject;