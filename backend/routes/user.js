//Module
const express = require("express");

//Router function
const router = express.Router();

//Controllers
const userCtrl = require("../controllers/user");

//Middleware
const auth = require("../middleware/authorize");

//Endpoints
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/:id", auth, userCtrl.getUserData);

module.exports = router;
