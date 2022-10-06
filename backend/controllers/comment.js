const groupomaniaDB = require("../middleware/MySqlConnection");

exports.getComments = (req, res, next) => {
  const query = "SELECT comment_id, content,created_date,post_id,prenom,nom,picture_url FROM comment JOIN user ON comment.user_id = user.id WHERE post_id = ?";
  groupomaniaDB.query(query, [req.params.postId], function (err, comments, fields) {
    if (err != null) {
      res.status(500).json("getComments error: " + err.message + " at file ../controllers/comment.js:line7");
    } else if (comments.length == 0) {
      res.status(204).json();
    } else {
      res.status(200).json(comments);
    }
  });
};

exports.addComment = (req, res, next) => {
  const query = "INSERT INTO comment (content,created_date,post_id,user_id) VALUES (?,?,?,?)";
  groupomaniaDB.query(query, [req.body.content, req.body.created_date, req.params.postId, req.auth.userId], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("addComments error: " + err.message + " at file ../controllers/comment.js:line20");
    } else {
      res.status(201).json("Comment added");
    }
  });
};

exports.deleteComment = (req, res, next) => {
  const selectQuery = "SELECT id,is_admin FROM user where id = ?; SELECT user_id FROM comment WHERE comment_id = ?";
  groupomaniaDB.query(selectQuery, [req.auth.userId, req.params.commentId], function (err, results, fields) {
    const userData = results[0][0];
    const commentData = results[1][0];

    if (commentData == undefined) {
      res.status(500).json("deleteComments error: comment not found at file ../controllers/comment.js:line34");
    } else if ((userData.is_admin == 1 && commentData.user_id != req.auth.userId) || commentData.user_id == req.auth.userId) {
      const deleteQuery = "DELETE FROM comment WHERE comment_id = ?";
      groupomaniaDB.query(deleteQuery, [req.params.commentId], function (err, results, fields) {
        if (err != null) {
          res.status(500).json("deleteComments error: " + err.message + " at file ../controllers/comment.js:line39");
        } else {
          res.status(200).json("Comment deleted");
        }
      });
    } else {
      res.status(401).json("deleteComment error: Unauthorized request at file ../controllers/comment.js:line46");
    }
  });
};

exports.modifyComment = (req, res, next) => {
  const selectQuery = "SELECT id,is_admin FROM user where id = ?; SELECT user_id FROM comment WHERE comment_id = ?";
  groupomaniaDB.query(selectQuery, [req.auth.userId, req.params.commentId], function (err, results, fields) {
    const userData = results[0][0];
    const commentData = results[1][0];

    if (commentData == undefined) {
      res.status(500).json("modifyComments error: comment not found at file ../controllers/comment.js:line57");
    } else if (req.body.content == "") {
      res.status(400).json("modifyComment error : can't send empty values to database at file ../controllers/comment.js:line59");
    } else if ((userData.is_admin == 1 && commentData.user_id != req.auth.userId) || commentData.user_id == req.auth.userId) {
      const modifyQuery = "UPDATE comment SET content = ? WHERE comment_id = ?";
      groupomaniaDB.query(modifyQuery, [req.body.content, req.params.commentId], function (err, results, fields) {
        if (err != null) {
          res.status(500).json("modifyComments error: " + err.message + " at file ../controllers/comment.js:line64");
        } else {
          res.status(200).json("Comment modified");
        }
      });
    } else {
      res.status(401).json("deleteComment error: Unauthorized request at file ../controllers/comment.js:line70");
    }
  });
};
