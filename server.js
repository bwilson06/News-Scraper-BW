// Require Dependencies
var express = require("express");
var mongoose = require("mongoose")
var expressLayouts = require("express-ejs-layouts");
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

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Connect to our database
mongoose.connect("mongodb://localhost/NewsScraperBW", { useNewUrlParser: true });

// Routes
app.use("/", require("./routes/scrape"));

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Initialize server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });