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

let port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log("Listening on port " + port + "!");
});