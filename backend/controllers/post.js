//Module
const groupomaniaDB = require("../middleware/MySqlConnection");
const fs = require("fs");

exports.createPost = (req, res, next) => {
  const postObject = req.file
    ? {
        ...JSON.parse(req.body),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };
  groupomaniaDB.query("INSERT INTO post (user_id, content, created_date) VALUES (?,?,?)", [postObject.userId, postObject.content, postObject.created_date], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("line 14: " + err);
    } else {
      res.status(200).json("Post added");
    }
  });
};

//Display all posts
exports.getPosts = (req, res, next) => {
  groupomaniaDB.query("SELECT * FROM post JOIN `user` ON `post`.`user_id` = `user`.`id`", function (err, posts, fields) {
    if (err != null) {
      res.status(500).json("line 25: " + err);
    } else {
      console.log(posts);
      posts.forEach((post) => {
        delete post.password;
        delete post.email;
        delete post.is_admin;
      });
      res.status(200).json(posts);
    }
  });
};
