//Module
const express = require("express");

//Router function
const router = express.Router();

//Controllers
const userCtrl = require("../controllers/user");

//Middleware
const auth = require("../middleware/authorize");
const multer = require("../middleware/multerConfig");

//Endpoints
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/user", auth, userCtrl.getUserData);
router.put("/:id/picture", auth, multer, userCtrl.modifyUserPicture);
router.put("/:id/name", auth, userCtrl.modifyUserName);
router.put("/:id/password", auth, userCtrl.modifyUserPassword);
router.delete("/:id", auth, userCtrl.deleteUser);

module.exports = router;
