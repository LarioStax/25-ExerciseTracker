const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const shortid = require("shortid");

const User = require("./models/user.js");
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
		shortId: shortid.generate()
	}
	//save user to the DB
	User.create(newUser, function(err, createdUser) {
		if (err) {
			console.log(err);
		} else {
			//return json with username, id and shortid
			res.json({"username": createdUser.username, "_id": createdUser._id, "shortId": createdUser.shortId});
		}
	});
});



let port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log("Listening on port " + port + "!");
});