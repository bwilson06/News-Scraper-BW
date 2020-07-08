// Require Dependencies
var express = require("express");
var mongoose = require("mongoose")

// Set Server Port
var PORT = process.env.PORT || 3300;
// Initialize Express
var app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
// Parse request body as JSON
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to our database
mongoose.connect("mongodb://localhost/NewsScraperBW", { useNewUrlParser: true });

// Routes
app.use("/", require("./routes/index"));

// Initialize server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });