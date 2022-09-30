//Module
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const groupomaniaDB = require("../middleware/MySqlConnection");

exports.signup = (req, res, next) => {
  if (req.body.email == "" || req.body.password == "" || req.body.prenom == "" || req.body.nom == "") {
    res.status(400).json("Error : can't send empty values to database at file ../controllers/user.js:line8");
  } else {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const hashPassword = hash;
        const query = "INSERT INTO `user`(`email`, `password`,`nom`,`prenom`) VALUES (?,?,?,?)";
        groupomaniaDB.query(query, [req.body.email, hashPassword, req.body.nom, req.body.prenom], function (err, results, fields) {
          if (results != undefined) {
            return res.status(200).json({ message: "User added" });
          } else {
            console.log(err);
            return res.status(400).json("signup error: " + err.message + " at file ../controllers/user.js:line17");
          }
        });
      })
      .catch((error) => res.status(500).json("bcrypt error: " + error + " at file ../controllers/user.js:line24"));
  }
};

exports.login = (req, res, next) => {
  const query = "SELECT * FROM user WHERE email = ?";
  groupomaniaDB.query(query, [req.body.email], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("login error : " + err.message + " at file ../controllers/user.js:line32");
    } else if (results[0] == undefined) {
      res.status(401).json("login error: Invalid user or password");
    } else {
      bcrypt
        .compare(req.body.password, results[0].password)
        .then((valid) => {
          if (!valid) {
            res.status(401).json("login error: Invalid user or password");
          } else {
            const token = jwt.sign({ userId: results[0].id }, process.env.TOKEN_KEY, { expiresIn: "7d" });
            const query = "UPDATE user SET token = ? WHERE email = ?";
            groupomaniaDB.query(query, [token, req.body.email], function (err, results, fields) {
              if (err != null) {
                res.status(500).json("login error : " + err.message + " at file ../controllers/user.js:line46");
              }
            });
            res.status(200).json({
              userId: results[0].id,
              token: token,
            });
          }
        })
        .catch((error) => res.status(500).json("bcrypt error: " + error + " at file ../controllers/user.js:line55"));
    }
  });
};

exports.getUserData = (req, res, next) => {
  const query = "SELECT `nom`,`prenom`,`picture_url` FROM user WHERE id = ?";
  groupomaniaDB.query(query, [req.params.id], function (err, userData, fields) {
    if (err != null) {
      res.status(500).json("getUserData error: " + err.message + " at file ../controllers/user.js:line66");
    } else if (userData.length == 0) {
      res.status(404).json("getUserData error: User not found at file ../controllers/user.js:line68");
    } else {
      res.status(200).json(userData);
    }
  });
};
