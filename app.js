const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const shortid = require("shortid");

const User = require("./models/user.js");
const Exercise = require("./models/exercise.js");
const middleware = require("./middleware/index.js");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/exercise_tracker",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true 
	});

const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static("public"));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/views/index.html");
})

app.post("/api/exercise/new-user", middleware.checkUsername, function(req, res) {
	//create new user and generate a new id for said user
	let newUser = {
		username: req.body.username,
	}
	//save user to the DB
	User.create(newUser, function(err, createdUser) {
		if (err) {
			console.log(err);
		} else {
			//return json with username, id and shortid
			res.json({"username": createdUser.username, "_id": createdUser._id});
		}
	});
});

// let exerciseSchema = new mongoose.Schema({
// 	description: String,
// 	duration: Number,
// 	date: {
// 		type: Date,
// 		default: Date.now,
// 	},
// 	user: {
// 		id: {
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: "User"
// 		},
// 		username: String,
// 	}
// });

app.post("/api/exercise/add", function(req, res) {
	//find user by id
	User.findById(req.body.userId, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			//create the new exercise object
			let tempObject = {
				description: req.body.description,
				duration: req.body.duration,
				date: req.body.date || Date.now(),
				user: {
					id: foundUser._id,
					username: foundUser.username
				}
			}
			//create new exercise
			Exercise.create(tempObject, function(err, createdExercise) {
				if (err) {
					console.log(err);
				} else {
					//add exercise to user's exercise array
					foundUser.exercises.push(createdExercise);
					foundUser.save();
					console.log(foundUser);
					//return json with userid, user shortid, username, exercise duration, exercise description, exercise date
					res.json({
						"_id": foundUser._id, 
						"username": foundUser.username, 
						"duration": createdExercise.duration, 
						"description": createdExercise.description,
						"date": createdExercise.date,
						"total exercises": foundUser.exercises.length
					});
				}
			})
		}
	});
});

// //Comments Create
// router.post("/", middleware.isLoggedIn, function(req, res) {
// 	//find campground by id
// 	Campground.findById(req.params.id, function(err, campground) {
// 		if (err) {
// 			req.flash("error", "Campground not found.")
// 			console.log(err);
// 		} else {
// 			//create new comment
// 			Comment.create(req.body.comment, function(err, comment) {
// 				if (err) {
// 					req.flash("error", "Something went wrong.")
// 					console.log(err);
// 				} else {
// 					//add username and ID to comment
// 					comment.author.id = req.user._id;
// 					comment.author.username = req.user.username;
// 					comment.save();
// 					//connect new comment to campground
// 					campground.comments.push(comment);
// 					campground.save();
// 					console.log(comment);
// 					//redirect to showpage of said campground
// 					req.flash("success", "Successfully added a new comment.")
// 					res.redirect("/campgrounds/" + campground._id);
// 				}
// 			})

// 		}
// 	})
// });



let port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log("Listening on port " + port + "!");
});