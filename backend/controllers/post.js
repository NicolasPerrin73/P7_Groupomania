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
  if (postObject.imageUrl == undefined) {
    const query = "INSERT INTO post (user_id, content, created_date) VALUES (?,?,?)";
    groupomaniaDB.query(query, [req.auth.userId, postObject.content, postObject.created_date], function (err, results, fields) {
      if (err != null) {
        res.status(500).json("createPost error: " + err.message + " at file ../controllers/post.js:line17");
      } else {
        res.status(200).json("Post added without image");
      }
    });
  } else if (postObject.imageUrl != undefined) {
    const query = "INSERT INTO post (user_id, content, created_date,img_url) VALUES (?,?,?,?)";
    groupomaniaDB.query(query, [req.auth.userId, postObject.content, postObject.created_date, postObject.imageUrl], function (err, results, fields) {
      if (err != null) {
        res.status(500).json("createPost error: " + err.message + " at file ../controllers/post.js:line26");
      } else {
        res.status(200).json("Post added with image");
      }
    });
  }
};

//Display all posts
exports.getPosts = (req, res, next) => {
  const query = "SELECT post_id,content,img_url,liked,created_date,user_id,prenom,nom,picture_url FROM post JOIN user ON post.user_id = user.id";
  groupomaniaDB.query(query, function (err, posts, fields) {
    if (err != null) {
      res.status(500).json("line 39: " + err);
    } else {
      res.status(200).json(posts);
    }
  });
};

exports.deletePost = (req, res, next) => {
  const selectQuery = "SELECT id,is_admin FROM user where id = ?; SELECT user_id,image_url FROM post WHERE post_id = ?";
  groupomaniaDB.query(selectQuery, [req.auth.userId, req.params.postId], function (err, results, fields) {
    const userData = results[0][0];
    const postData = results[1][0];

    if (postData == undefined) {
      res.status(500).json("deletePost error: post not found at file ../controllers/post.js:line53");
    } else if ((userData.is_admin == 1 && postData.user_id != req.auth.userId) || postData.user_id == req.auth.userId) {
      if (postData.imageUrl == null) {
        const deleteQuery = "DELETE FROM post WHERE post_id = ?";
        groupomaniaDB.query(deleteQuery, [req.params.postId], function (err, results, fields) {
          if (err != null) {
            res.status(500).json("deletepost error: " + err.message + " at file ../controllers/post.js:line59");
          } else {
            res.status(200).json("post without deleted");
          }
        });
      } else if (postData.imageUrl != null) {
        const filename = postData.imageUrl.split("/assets/")[1];
        fs.unlink(`assets/${filename}`, () => {
          const deleteQuery = "DELETE FROM post WHERE post_id = ?";
          groupomaniaDB.query(deleteQuery, [req.params.postId], function (err, results, fields) {
            if (err != null) {
              res.status(500).json("deletepost error: " + err.message + " at file ../controllers/post.js:line70");
            } else {
              res.status(200).json("post with image deleted");
            }
          });
        });
      }
    } else {
      res.status(401).json("deletepost error: Unauthorized request at file ../controllers/post.js:line78");
    }
  });
};

exports.modifyPost = (req, res, next) => {
  const postObject = req.file
    ? {
        ...JSON.parse(req.body),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };

  const selectQuery = "SELECT id,is_admin FROM user where id = ?; SELECT user_id,image_url FROM post WHERE post_id = ?";
  groupomaniaDB.query(selectQuery, [req.auth.userId, req.params.postId], function (err, results, fields) {
    const userData = results[0][0];
    const postData = results[1][0];

    let query;

    if (postData == undefined) {
      res.status(500).json("modifyPost error: post not found at file ../controllers/post.js:line99");
    } else if (req.body.content == "") {
      res.status(400).json("modifyPost error : can't send empty values to database at file ../controllers/comment.js:line101");
    } else if ((userData.is_admin == 1 && postData.user_id != req.auth.userId) || postData.user_id == req.auth.userId) {
      if (postObject.imageUrl == undefined) {
        query = "UPDATE post SET content = ? WHERE post_id = ?";
        groupomaniaDB.query(query, [postObject.content, req.params.postId], function (err, results, fields) {
          if (err != null) {
            res.status(500).json("modifyPost error: " + err.message + " at file ../controllers/post.js:line107");
          } else {
            res.status(200).json("post modified without image");
          }
        });
      } else if (postObject.imageUrl != undefined) {
        query = "UPDATE post SET content = ?, image_url = ? WHERE post_id = ?";
        const filename = postData.imageUrl.split("/assets/")[1];
        fs.unlink(`images/${filename}`, () => {
          groupomaniaDB.query(query, [postObject.content, postObject.imageUrl, req.params.postId], function (err, results, fields) {
            if (err != null) {
              res.status(500).json("modifyPost error: " + err.message + " at file ../controllers/post.js:line118");
            } else {
              res.status(200).json("post modified with image");
            }
          });
        });
      }
    } else {
      res.status(401).json("modifyPost error: Unauthorized request at file ../controllers/post.js:line126");
    }
  });
};
