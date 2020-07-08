var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

router.get("/", function (req, res) {
  db.Article.find({ saved: false })
    .then(function (dbArticle) {
      console.log(dbArticle);
      // If we were able to successfully find Articles, send them back to the client
      res.render("index", { dbArticle });
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.get("/saved/:id", function (req, res) {
  var id = req.params.id;
  console.log(id);

  db.Article.updateOne({ _id: id }, { saved: true })
    .then(function (dbArticle) {
      console.log(dbArticle);
      // If we were able to successfully find Articles, send them back to the client
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    })
    .then(function () {
      db.Article.find({ saved: false })
        .then(function (dbArticle) {
          console.log(dbArticle);
          // If we were able to successfully find Articles, send them back to the client
          res.render("index", { dbArticle });
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });
});

router.get("/unsave/:id", function(req, res){
    var id = req.params.id;
    db.Article.updateOne({ _id: id }, { saved: false })
    .then(function (dbArticle) {
      console.log(dbArticle);
      // If we were able to successfully find Articles, send them back to the client
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    })
    .then(function () {
      db.Article.find({ saved: false })
        .then(function (dbArticle) {
          console.log(dbArticle);
          // If we were able to successfully find Articles, send them back to the client
          res.render("index", { dbArticle });
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });
})

router.get("/saved", function(req, res){
    db.Article.find({ saved: true })
        .then(function (dbArticle) {
          console.log(dbArticle);
          // If we were able to successfully find Articles, send them back to the client
          res.render("index", { dbArticle });
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
})

router.post("/comment", function(req, res) {
    console.log(req.body)

    db.Comment.create({ body: req.body.comment }).then(function(dbComment){
        return db.Article.findOneAndUpdate({ _id: req.body._id }, { note: dbComment._id}, {new: true});
        console.log(dbComment)
    }).catch(function(err){
        console.log(err)
    })
})

router.get("/comment/:id", function(req, res){
    console.log(req.params.id)
    db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      console.log('this is it', dbArticle.note.body);
      res.json(dbArticle.note.body)
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
})

router.get("/scrape", function (req, res) {
  axios.get("https://www.nytimes.com/section/world").then(function (response) {
    var $ = cheerio.load(response.data);

    $(".css-10wtrbd").each(function (i, element) {
      var result = {};
      result.title = $(element).children("h2").text();
      result_link = $(element).children("h2").children("a").attr("href");
      result.link = `https://www.nytimes.com/${result_link}`;

      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  });
});

module.exports = router;
