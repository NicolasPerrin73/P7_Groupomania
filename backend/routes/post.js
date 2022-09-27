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

//Endpoints
router.get("/", auth, postCtrl.getPosts);
router.post("/", auth, multer, postCtrl.createPost);
//router.get("/:id", auth, sauceCtrl.getOneSauce);
//router.put("/:id", auth, multer, sauceCtrl.modifySauce);
//router.delete("/:id", auth, sauceCtrl.deleteSauce);
//router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;
