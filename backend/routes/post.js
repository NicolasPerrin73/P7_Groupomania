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

//Endpoints
router.get("/", auth, postCtrl.getPosts);
router.post("/", auth, multer, postCtrl.createPost);
router.get("/:postId/comment", auth, commentCtrl.getComments);
router.post("/:postId/comment", auth, commentCtrl.addComment);
router.delete("/comment/:commentId", auth, commentCtrl.deleteComment);
router.put("/comment/:commentId", auth, commentCtrl.modifyComment);
//router.get("/:id", auth, sauceCtrl.getOneSauce);
//router.put("/:id", auth, multer, sauceCtrl.modifySauce);
//router.delete("/:id", auth, sauceCtrl.deleteSauce);
//router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;
