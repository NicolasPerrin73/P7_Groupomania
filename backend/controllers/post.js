//Module
const groupomaniaDB = require("../middleware/MySqlConnection");
const fs = require("fs");

//Create post
exports.createPost = (req, res, next) => {
  const postObject = req.file
    ? {
        ...JSON.parse(req.body),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };
  const query = "INSERT INTO post (user_id, content, created_date) VALUES (?,?,?)";
  groupomaniaDB.query(query, [req.auth.userId, postObject.content, postObject.created_date], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("line 14: " + err);
    } else {
      res.status(200).json("Post added");
    }
  });
};

//Display all posts
exports.getPosts = (req, res, next) => {
  const query = "SELECT post_id,content,img_url,liked,created_date,user_id,prenom,nom,picture_url FROM post JOIN user ON post.user_id = user.id";
  groupomaniaDB.query(query, function (err, posts, fields) {
    if (err != null) {
      res.status(500).json("line 25: " + err);
    } else {
      res.status(200).json(posts);
    }
  });
};
