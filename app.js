const express = require("express");
const app = express();
const bodyParser = require("body-parser");

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


app.post("/api/exercise/new-user", function(req, res) {
	//create new user and generate a new id for said user
	//save user to the DB
	//return json with username and shortid

	console.log(req.body.username);
	res.send("Post route reached. Send it to DB");
})


let port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log("Listening on port " + port + "!");
});