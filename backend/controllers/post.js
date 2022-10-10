//Module
const groupomaniaDB = require("../middleware/MySqlConnection");
const fs = require("fs");

//Create post
exports.createPost = (req, res, next) => {
  const { content, created_date } = req.body;
  const postObject = req.file
    ? {
        imageUrl: `${req.protocol}://${req.get("host")}/assets/${req.file.filename}`,
      }
    : { ...req.body };
  if (postObject.imageUrl == undefined) {
    const query = "INSERT INTO post (user_id, content, created_date) VALUES (?,?,?)";
    groupomaniaDB.query(query, [req.auth.userId, content, created_date], function (err, results, fields) {
      if (err != null) {
        res.status(500).json("createPost error: " + err.message + " at file ../controllers/post.js:line17");
      } else {
        res.status(201).json("Post added without image");
      }
    });
  } else if (postObject.imageUrl != undefined) {
    const query = "INSERT INTO post (user_id, content, created_date,img_url) VALUES (?,?,?,?)";
    groupomaniaDB.query(query, [req.auth.userId, content, created_date, postObject.imageUrl], function (err, results, fields) {
      if (err != null) {
        res.status(500).json("createPost error: " + err.message + " at file ../controllers/post.js:line26");
      } else {
        res.status(201).json("Post added with image");
      }
    });
  }
};

//Display all posts
exports.getPosts = (req, res, next) => {
  const query = "SELECT post_id,content,img_url,liked,created_date,user_id,prenom,nom,picture_url FROM post JOIN user ON post.user_id = user.id ORDER BY created_date DESC;";
  groupomaniaDB.query(query, function (err, posts, fields) {
    if (err != null) {
      res.status(500).json("getPosts error: " + err.message + " at file ../controllers/post.js:line39");
    } else {
      res.status(200).json(posts);
    }
  });
};

exports.getPost = (req, res, next) => {
  const selectQuery = "SELECT post_id,content,img_url,created_date,user_id,prenom,nom,picture_url FROM post JOIN user ON post.user_id = user.id WHERE post_id = ?";
  groupomaniaDB.query(selectQuery, [req.params.postId], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("getPost error: " + err.message + " at file ../controllers/post.js:line50");
    } else {
      res.status(200).json(results);
    }
  });
};

exports.deletePost = (req, res, next) => {
  const selectQuery = "SELECT id,is_admin FROM user where id = ?; SELECT user_id,img_url FROM post WHERE post_id = ?";
  groupomaniaDB.query(selectQuery, [req.auth.userId, req.params.postId], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("deletePost error: post not found at file ../controllers/post.js:line61");
    } else {
      const userData = results[0][0];
      const postData = results[1][0];

      if (postData == undefined) {
        res.status(500).json("deletePost error: post not found at file ../controllers/post.js:line67");
      } else if ((userData.is_admin == 1 && postData.user_id != req.auth.userId) || postData.user_id == req.auth.userId) {
        if (postData.img_url == null) {
          const deleteQuery = "DELETE FROM post WHERE post_id = ?";
          groupomaniaDB.query(deleteQuery, [req.params.postId], function (err, results, fields) {
            if (err != null) {
              res.status(500).json("deletepost error: " + err.message + " at file ../controllers/post.js:line73");
            } else {
              res.status(200).json("post without image deleted");
            }
          });
        } else if (postData.img_url != null) {
          const filename = postData.img_url.split("/assets/")[1];
          fs.unlink(`assets/${filename}`, () => {
            const deleteQuery = "DELETE FROM post WHERE post_id = ?";
            groupomaniaDB.query(deleteQuery, [req.params.postId], function (err, results, fields) {
              if (err != null) {
                res.status(500).json("deletepost error: " + err.message + " at file ../controllers/post.js:line84");
              } else {
                res.status(200).json("post with image deleted");
              }
            });
          });
        }
      } else {
        res.status(401).json("deletepost error: Unauthorized request at file ../controllers/post.js:line92");
      }
    }
  });
};

exports.modifyPost = (req, res, next) => {
  const { content, created_date, postImage } = req.body;
  const postObject = req.file
    ? {
        imageUrl: `${req.protocol}://${req.get("host")}/assets/${req.file.filename}`,
      }
    : { ...req.body };

  const selectQuery = "SELECT id,is_admin FROM user where id = ?; SELECT user_id,img_url FROM post WHERE post_id = ?";
  groupomaniaDB.query(selectQuery, [req.auth.userId, req.params.postId], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("modifyPost error: post not found at file ../controllers/post.js:line109");
    } else {
      const userData = results[0][0];
      const postData = results[1][0];

      let query;

      if (postData == undefined) {
        res.status(500).json("modifyPost error: post not found at file ../controllers/post.js:line117");
      } else if (req.body.content == "") {
        res.status(400).json("modifyPost error : can't send empty values to database at file ../controllers/comment.js:line119");
      } else if ((userData.is_admin == 1 && postData.user_id != req.auth.userId) || postData.user_id == req.auth.userId) {
        if (postImage == "false") {
          query = "UPDATE post SET content = ?, img_url = ? WHERE post_id = ?";
          const filename = postData.img_url.split("/assets/")[1];
          fs.unlink(`assets/${filename}`, () => {
            groupomaniaDB.query(query, [content, null, req.params.postId], function (err, results, fields) {
              if (err != null) {
                res.status(500).json("modifyPost error: " + err.message + " at file ../controllers/post.js:line127");
              } else {
                res.status(200).json("post modified with image deleted");
              }
            });
          });
        } else if (postObject.imageUrl == undefined) {
          query = "UPDATE post SET content = ? WHERE post_id = ?";
          groupomaniaDB.query(query, [content, req.params.postId], function (err, results, fields) {
            if (err != null) {
              res.status(500).json("modifyPost error: " + err.message + " at file ../controllers/post.js:line137");
            } else {
              res.status(200).json("post content modified");
            }
          });
        } else if (postObject.imageUrl != undefined) {
          query = "UPDATE post SET content = ?, img_url = ? WHERE post_id = ?";
          const filename = postData.img_url.split("/assets/")[1];
          fs.unlink(`assets/${filename}`, () => {
            groupomaniaDB.query(query, [content, postObject.imageUrl, req.params.postId], function (err, results, fields) {
              if (err != null) {
                res.status(500).json("modifyPost error: " + err.message + " at file ../controllers/post.js:line148");
              } else {
                res.status(200).json("post content and image modified");
              }
            });
          });
        }
      } else {
        res.status(401).json("modifyPost error: Unauthorized request at file ../controllers/post.js:line156");
      }
    }
  });
};

exports.likePost = (req, res, next) => {
  const likeValue = req.body.like;
  const likedQuery = "UPDATE post SET liked = liked + 1 WHERE post_id = ?;INSERT INTO post_user_like VALUES (?,?)";
  const postUserLikeQuery = "SELECT user_id FROM post_user_like WHERE post_id = ?";
  const unlikedQuery = "UPDATE post SET liked = liked - 1 WHERE post_id = ?;DELETE FROM post_user_like where post_id = ? AND user_id = ?";

  groupomaniaDB.query(postUserLikeQuery, [req.params.postId], function (err, postUserLike, fields) {
    const userAlreadyLikeArray = postUserLike.map((obj) => obj.user_id);
    const alreadyLike = userAlreadyLikeArray.find((test) => test == req.auth.userId);

    if (likeValue == 1 && alreadyLike == undefined) {
      groupomaniaDB.query(likedQuery, [req.params.postId, req.params.postId, req.auth.userId], function (err, results, fields) {
        if (err != null) {
          res.status(500).json("likePost error: " + err.message + " at file ../controllers/post.js:line175");
        } else {
          res.status(200).json("post liked");
        }
      });
    } else if (likeValue == 1 && alreadyLike != undefined) {
      res.status(200).json("already liked by user");
    } else if (likeValue == 0 && alreadyLike != undefined) {
      groupomaniaDB.query(unlikedQuery, [req.params.postId, req.params.postId, req.auth.userId], function (err, results, fields) {
        if (err != null) {
          res.status(500).json("likePost error: " + err.message + " at file ../controllers/post.js:line185");
        } else {
          res.status(200).json("post unliked");
        }
      });
    }
  });
};
