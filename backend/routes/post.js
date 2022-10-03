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
const commentCtrl = require("../controllers/comment");

//Endpoints for post
router.get("/", auth, postCtrl.getPosts);
router.post("/", auth, multer, postCtrl.createPost);
router.delete("/:postId", auth, postCtrl.deletePost);
router.put("/:postId", auth, multer, postCtrl.modifyPost);
router.post("/:postId/like", auth, postCtrl.likePost);

//Endpoints for comment
router.get("/:postId/comment", auth, commentCtrl.getComments);
router.post("/:postId/comment", auth, commentCtrl.addComment);
router.delete("/comment/:commentId", auth, commentCtrl.deleteComment);
router.put("/comment/:commentId", auth, commentCtrl.modifyComment);

module.exports = router;
