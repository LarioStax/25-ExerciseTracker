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

const dotenv = require("dotenv");
dotenv.config();

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

//get a list of all users
app.get("/api/exercise/users", function(req, res) {
	User.find({}, function(err, foundUsers) {
		if (err) {
			console.log(err);
		} else {
			//only show username and id properties (destructuring!)
			let tempArr = foundUsers.map(({username, _id}) => ({username, _id}))
			res.json(tempArr);
		}
	});
});

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

// http://localhost:3000/api/exercise/log?userId=5e7a3a3d1abe9a210c057570&from=2020-03-24&to=2020-03-25&limit=7
app.get("/api/exercise/log", function(req, res) {
	let userId = req.query.userId;
	let from = req.query.from || "";
	let to = req.query.to || "";
	let limit = req.query.limit || "";
	User.findById(req.body.userId, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			Exercise.find({}, function(err, foundExercises) {
				if (err) {
					console.log(err);
				} else {
					let tempArr = foundExercises.map(({description, duration, date}) => ({description, duration, date}))
					if (from) {
						let temp = new Date(Date.parse(from));
						tempArr = tempArr.filter( (exercise) => exercise.date > temp);
					} if (to) {
						let temp = new Date(Date.parse(to));
						tempArr = tempArr.filter( (exercise) => exercise.date < temp);
					} if (limit) {
						tempArr.splice(limit)
					} if (tempArr.length === 0) {
						res.json({"Info": "No exercises found with these limitations."})
					}
					res.json(tempArr);
				}
			})
		}
	})
})


// // Not found middleware
// app.use((req, res, next) => {
//   return next({status: 404, message: 'not found'})
// })

// // Error Handling middleware
// app.use((err, req, res, next) => {
//   let errCode, errMessage

//   if (err.errors) {
//     // mongoose validation error
//     errCode = 400 // bad request
//     const keys = Object.keys(err.errors)
//     // report the first validation error
//     errMessage = err.errors[keys[0]].message
//   } else {
//     // generic or custom error
//     errCode = err.status || 500
//     errMessage = err.message || 'Internal Server Error'
//   }
//   res.status(errCode).type('txt')
//     .send(errMessage)
// })


let port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log("Listening on port " + port + "!");
});