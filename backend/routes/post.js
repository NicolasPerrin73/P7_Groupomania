//Module
const express = require("express");

//Router
const router = express.Router();

//Middleware
const auth = require("../middleware/authorize");
const groupomaniaDB = require("../middleware/MySqlConnection");
const multer = require("../middleware/multerConfig");

//Controllers
const postCtrl = require("../controllers/post");
//const commentCtrl = require("../controllers/comment");

//Endpoints for post
router.get("/", auth, postCtrl.getPosts);
router.get("/:postId", auth, postCtrl.getPost);
router.post("/", auth, multer, postCtrl.createPost);
router.delete("/:postId", auth, postCtrl.deletePost);
router.put("/:postId", auth, multer, postCtrl.modifyPost);
router.post("/:postId/like", auth, postCtrl.likePost);
router.get("/:postId/like", auth, postCtrl.getLikeCount);
router.get("/:postId/like/user", auth, postCtrl.getUserLike);

//Optionnal Endpoints for comment
/*
router.get("/:postId/comment", auth, commentCtrl.getComments);
router.post("/:postId/comment", auth, commentCtrl.addComment);
router.delete("/comment/:commentId", auth, commentCtrl.deleteComment);
router.put("/comment/:commentId", auth, commentCtrl.modifyComment);
*/

module.exports = router;
