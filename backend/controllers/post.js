//Module
const groupomaniaDB = require("../middleware/MySqlConnection");
const fs = require("fs");
const sharp = require("sharp");

//Create post
exports.createPost = (req, res, next) => {
  const { content, created_date } = req.body;
  const postObject = req.file
    ? {
        imageUrl: `${req.protocol}://${req.get("host")}/assets/${req.file.filename}resized.webp`,
      }
    : { ...req.body };

  // Post have no image sent
  if (postObject.imageUrl == undefined) {
    const query = "INSERT INTO post (user_id, content, created_date) VALUES (?,?,?)";
    groupomaniaDB.query(query, [req.auth.userId, content, created_date], function (err, results, fields) {
      if (err != null) {
        res.status(500).json("createPost error: " + err.message + " at file ../controllers/post.js:line20");
      } else {
        res.status(201).json("Post added without image");
      }
    });

    //Post have image sent
  } else if (postObject.imageUrl != undefined) {
    // Resize image
    sharp(`D:/Documents/Openclassrooms/P7/P7_Groupomania/backend/assets/${req.file.filename}`)
      .resize(500)
      .toFile(`D:/Documents/Openclassrooms/P7/P7_Groupomania/backend/assets/${req.file.filename}resized.webp`)
      .then((file) => {
        // Remove original image stored by multer
        fs.unlink(`./assets/${req.file.filename}`, (err) => {
          if (err) throw err;
          const query = "INSERT INTO post (user_id, content, created_date,img_url) VALUES (?,?,?,?)";
          groupomaniaDB.query(query, [req.auth.userId, content, created_date, postObject.imageUrl], function (err, results, fields) {
            if (err != null) {
              res.status(500).json("createPost error: " + err.message + " at file ../controllers/post.js:line39");
            } else {
              res.status(201).json("Post added with image");
            }
          });
        });
      });
  }
};

//Display all posts
exports.getPosts = (req, res, next) => {
  const query = "SELECT post_id,content,img_url,liked,created_date,user_id,prenom,nom,picture_url FROM post JOIN user ON post.user_id = user.id ORDER BY created_date DESC;";
  groupomaniaDB.query(query, function (err, posts, fields) {
    if (err != null) {
      res.status(500).json("getPosts error: " + err.message + " at file ../controllers/post.js:line54");
    } else {
      res.status(200).json(posts);
    }
  });
};

// Display one post with user data for this post
exports.getPost = (req, res, next) => {
  const selectQuery = "SELECT post_id,content,img_url,created_date,user_id,prenom,nom,picture_url FROM post JOIN user ON post.user_id = user.id WHERE post_id = ?";
  groupomaniaDB.query(selectQuery, [req.params.postId], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("getPost error: " + err.message + " at file ../controllers/post.js:line66");
    } else {
      res.status(200).json(results);
    }
  });
};

// Delete post
exports.deletePost = (req, res, next) => {
  const selectQuery = "SELECT id,is_admin FROM user where id = ?; SELECT user_id,img_url FROM post WHERE post_id = ?";
  groupomaniaDB.query(selectQuery, [req.auth.userId, req.params.postId], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("deletePost error: post not found at file ../controllers/post.js:line78");
    } else {
      const userData = results[0][0];
      const postData = results[1][0];

      // Database return no post
      if (postData == undefined) {
        res.status(500).json("deletePost error: post not found at file ../controllers/post.js:line85");
        // User is the post creator or is admin
      } else if ((userData.is_admin == 1 && postData.user_id != req.auth.userId) || postData.user_id == req.auth.userId) {
        // Post have no image
        if (postData.img_url == null) {
          const deleteQuery = "DELETE FROM post WHERE post_id = ?";
          groupomaniaDB.query(deleteQuery, [req.params.postId], function (err, results, fields) {
            if (err != null) {
              res.status(500).json("deletepost error: " + err.message + " at file ../controllers/post.js:line93");
            } else {
              res.status(200).json("post without image deleted");
            }
          });
          // Post have image
        } else if (postData.img_url != null) {
          const filename = postData.img_url.split("/assets/")[1];
          fs.unlink(`assets/${filename}`, () => {
            const deleteQuery = "DELETE FROM post WHERE post_id = ?";
            groupomaniaDB.query(deleteQuery, [req.params.postId], function (err, results, fields) {
              if (err != null) {
                res.status(500).json("deletepost error: " + err.message + " at file ../controllers/post.js:line105");
              } else {
                res.status(200).json("post with image deleted");
              }
            });
          });
        }
        //User is not authorize
      } else {
        res.status(401).json("deletepost error: Unauthorized request at file ../controllers/post.js:line114");
      }
    }
  });
};

// Modify post
exports.modifyPost = (req, res, next) => {
  const { content, created_date, postImage } = req.body;
  const postObject = req.file
    ? {
        imageUrl: `${req.protocol}://${req.get("host")}/assets/${req.file.filename}resized.webp`,
      }
    : { ...req.body };

  const selectQuery = "SELECT id,is_admin FROM user where id = ?; SELECT user_id,img_url FROM post WHERE post_id = ?";
  groupomaniaDB.query(selectQuery, [req.auth.userId, req.params.postId], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("modifyPost error: post not found at file ../controllers/post.js:line132");
    } else {
      const userData = results[0][0];
      const postData = results[1][0];

      let query;

      // Post not found in database
      if (postData == undefined) {
        res.status(500).json("modifyPost error: post not found at file ../controllers/post.js:line141");
        //Post content is empty
      } else if (req.body.content == "") {
        res.status(400).json("modifyPost error : can't send empty values to database at file ../controllers/comment.js:line144");
        // User is the post creator or is admin
      } else if ((userData.is_admin == 1 && postData.user_id != req.auth.userId) || postData.user_id == req.auth.userId) {
        // No image sent, delete current image of post
        if (postImage == "false" && postData.img_url !== null) {
          const filename = postData.img_url.split("/assets/")[1];
          fs.unlink(`assets/${filename}`, () => {
            query = "UPDATE post SET content = ?, img_url = ?, created_date = ? WHERE post_id = ?";
            groupomaniaDB.query(query, [content, null, created_date, req.params.postId], function (err, results, fields) {
              if (err != null) {
                res.status(500).json("modifyPost error: " + err.message + " at file ../controllers/post.js:line154");
              } else {
                res.status(200).json("post modified with image deleted");
              }
            });
          });
          // No image sent
        } else if (postObject.imageUrl == undefined) {
          query = "UPDATE post SET content = ?, created_date = ? WHERE post_id = ?";
          groupomaniaDB.query(query, [content, created_date, req.params.postId], function (err, results, fields) {
            if (err != null) {
              res.status(500).json("modifyPost error: " + err.message + " at file ../controllers/post.js:line165");
            } else {
              res.status(200).json("post content modified");
            }
          });
          // Image sent
        } else if (postObject.imageUrl != undefined) {
          //Resize image
          sharp(`D:/Documents/Openclassrooms/P7/P7_Groupomania/backend/assets/${req.file.filename}`)
            .resize(500)
            .toFile(`D:/Documents/Openclassrooms/P7/P7_Groupomania/backend/assets/${req.file.filename}resized.webp`)
            .then((file) => {
              fs.unlink(`./assets/${req.file.filename}`, (err) => {
                if (err) throw err;
              });
            });
          // Delete stored image if present
          if (postData.img_url !== null) {
            const filename = postData.img_url.split("/assets/")[1];
            fs.unlink(`assets/${filename}`, (err) => {
              if (err) throw err;
            });
          }
          query = "UPDATE post SET content = ?, img_url = ?, created_date = ? WHERE post_id = ?";
          groupomaniaDB.query(query, [content, postObject.imageUrl, created_date, req.params.postId], function (err, results, fields) {
            if (err != null) {
              res.status(500).json("modifyPost error: " + err.message + " at file ../controllers/post.js:line191");
            } else {
              res.status(200).json("post content and image modified");
            }
          });
        }
        // User is not authorize
      } else {
        res.status(401).json("modifyPost error: Unauthorized request at file ../controllers/post.js:line199");
      }
    }
  });
};

// Like Post
exports.likePost = (req, res, next) => {
  const likeValue = req.body.like;
  const likedQuery = "UPDATE post SET liked = liked + 1 WHERE post_id = ?;INSERT INTO post_user_like VALUES (?,?)";
  const postUserLikeQuery = "SELECT user_id FROM post_user_like WHERE post_id = ?";
  const unlikedQuery = "UPDATE post SET liked = liked - 1 WHERE post_id = ?;DELETE FROM post_user_like where post_id = ? AND user_id = ?";

  //Add user who liked post in array
  groupomaniaDB.query(postUserLikeQuery, [req.params.postId], function (err, postUserLike, fields) {
    const userAlreadyLikeArray = postUserLike.map((obj) => obj.user_id);
    const alreadyLike = userAlreadyLikeArray.find((test) => test == req.auth.userId);
    //User set like and not finded in user like array
    if (likeValue == 1 && alreadyLike == undefined) {
      groupomaniaDB.query(likedQuery, [req.params.postId, req.params.postId, req.auth.userId], function (err, results, fields) {
        if (err != null) {
          res.status(500).json("likePost error: " + err.message + " at file ../controllers/post.js:line220");
        } else {
          res.status(200).json("post liked");
        }
      });
      // User set like and finded in user like array
    } else if (likeValue == 1 && alreadyLike != undefined) {
      res.status(200).json("already liked by user");
      // User set unlike and finded in user like arry
    } else if (likeValue == 0 && alreadyLike != undefined) {
      groupomaniaDB.query(unlikedQuery, [req.params.postId, req.params.postId, req.auth.userId], function (err, results, fields) {
        if (err != null) {
          res.status(500).json("likePost error: " + err.message + " at file ../controllers/post.js:line232");
        } else {
          res.status(200).json("post unliked");
        }
      });
    } else {
      res.status(500).json("likePost error at file ../controllers/post.js:line238");
    }
  });
};

// Display number of like
exports.getLikeCount = (req, res, next) => {
  const selectQuery = "SELECT liked FROM post WHERE post_id = ?";
  groupomaniaDB.query(selectQuery, [req.params.postId], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("getLike error: " + err.message + " at file ../controllers/post.js:line248");
    } else {
      res.status(200).json(results[0]);
    }
  });
};

// Get user if already post liked
exports.getUserLike = (req, res, next) => {
  const selectQuery = "SELECT user_id FROM post_user_like WHERE post_id = ? AND user_id = ?";
  groupomaniaDB.query(selectQuery, [req.params.postId, req.auth.userId], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("getLike error: " + err.message + " at file ../controllers/post.js:line260");
    } else {
      res.status(200).json(results);
    }
  });
};
