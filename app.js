const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
const port = 3000;

app.use(express.urlencoded());
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/wkiDB");

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get(async (req, res) => {
    try {
      const articles = await Article.find();
      res.send(articles);
    } catch (err) {
      res.send(err);
    }
  })
  .post(async (req, res) => {
    try {
      const article = new Article({
        title: req.body.title,
        content: req.body.content,
      });
      article
        .save()
        .then(() => {
          res.send("Article Add Successfuly");
        })
        .catch((err) => res.send(err));
    } catch (err) {
      res.send(err);
    }
  })
  .delete(async (req, res) => {
    try {
      await Article.deleteMany()
        .then(() => {
          res.send("All article deleted successfully");
        })
        .catch((err) => {
          res.send(err);
        });
    } catch (err) {
      res.send(err);
    }
  });

app
  .route("/articles/:articleTitle")
  .get(async (req, res) => {
    const articleTitle = req.params.articleTitle;
    try {
      const article = await Article.findOne({ title: articleTitle });
      res.send(article);
    } catch (err) {
      res.send(err);
    }
  })
  .put(async (req, res) => {
    const articleTitle = req.params.articleTitle;
    try {
      await Article.replaceOne(
        { title: articleTitle },
        { title: req.body.title, content: req.body.content }
      );
      res.send("updated");
    } catch (err) {
      res.send(err);
    }
  })
  .patch(async (req, res) => {
    const articleTitle = req.params.articleTitle;
    try {
      await Article.updateOne({ title: articleTitle }, { $set: req.body });
      res.send("Updated with success");
    } catch (err) {
      res.send(err);
    }
  })
  .delete(async (req, res) => {
    const articleTitle = req.params.articleTitle;
    try {
      await Article.deleteOne({ title: articleTitle });
      res.send("Deleted with succes");
    } catch (err) {
      res.send(err);
    }
  });

app.listen(port, () => {
  console.log("Server listen to the port " + port);
});
