var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

router.get("/", function(req, res){
    db.Article.find({})
    .then(function(dbArticle) {
        console.log(dbArticle)
      // If we were able to successfully find Articles, send them back to the client
      res.render("index", { dbArticle })
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
