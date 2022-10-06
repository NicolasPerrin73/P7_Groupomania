//Module
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const groupomaniaDB = require("../middleware/MySqlConnection");
const fs = require("fs");

exports.signup = (req, res, next) => {
  if (req.body.email == "" || req.body.password == "" || req.body.lastName == "" || req.body.firstName == "") {
    res.status(400).json("Error : can't send empty values to database at file ../controllers/user.js:line9");
  } else {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const hashPassword = hash;
        const query = "INSERT INTO `user`(`email`, `password`,`nom`,`prenom`) VALUES (?,?,?,?)";
        groupomaniaDB.query(query, [req.body.email, hashPassword, req.body.firstName, req.body.lastName], function (err, results, fields) {
          if (results != undefined) {
            return res.status(201).json({ message: "User added" });
          } else {
            console.log(err);
            return res.status(400).json("signup error: " + err.message + " at file ../controllers/user.js:line21");
          }
        });
      })
      .catch((error) => res.status(500).json("bcrypt error: " + error + " at file ../controllers/user.js:line25"));
  }
};

exports.login = (req, res, next) => {
  const query = "SELECT * FROM user WHERE email = ?";
  groupomaniaDB.query(query, [req.body.email], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("login error : " + err.message + " at file ../controllers/user.js:line33");
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
                res.status(500).json("login error : " + err.message + " at file ../controllers/user.js:line47");
              }
            });
            res.status(200).json({
              userId: results[0].id,
              token: token,
            });
          }
        })
        .catch((error) => res.status(500).json("bcrypt error: " + error + " at file ../controllers/user.js:line56"));
    }
  });
};

exports.getUserData = (req, res, next) => {
  const query = "SELECT `nom`,`prenom`,`picture_url` FROM user WHERE id = ?";
  groupomaniaDB.query(query, [req.auth.userId], function (err, userData, fields) {
    if (err != null) {
      res.status(500).json("getUserData error: " + err.message + " at file ../controllers/user.js:line65");
    } else if (userData.length == 0) {
      res.status(404).json("getUserData error: User not found at file ../controllers/user.js:line67");
    } else {
      res.status(200).json(userData);
    }
  });
};

exports.modifyUserPicture = (req, res, next) => {
  const postObject = req.file
    ? {
        ...JSON.parse(req.body),
        imageUrl: `${req.protocol}://${req.get("host")}/assets/${req.file.filename}`,
      }
    : { ...req.body };

  const selectQuery = "SELECT picture_url FROM user WHERE id = ?";
  groupomaniaDB.query(selectQuery, [req.auth.userId], function (err, userData, fields) {
    if (err != null) {
      res.status(500).json("modifyPictureUser error: " + err.message + " at file ../controllers/user.js:line85");
    } else {
      if (userData.picture_url == null) {
        const updateQuery = "UPDATE user SET picture_url = ? WHERE id = ?";
        groupomaniaDB.query(updateQuery, [postObject.imageUrl, req.auth.userId], function (err, results, fields) {
          if (err != null) {
            res.status(500).json("modifyPictureUser error: " + err.message + " at file ../controllers/user.js:line91");
          } else {
            res.status(200).json("User picture added");
          }
        });
      } else if (userData.picture_url != null) {
        const filename = userData.picture_url.split("/assets/")[1];
        fs.unlink(`assets/${filename}`, () => {
          groupomaniaDB.query(updateQuery, [postObject.imageUrl, req.auth.userId], function (err, results, fields) {
            if (err != null) {
              res.status(500).json("modifyPictureUser error: " + err.message + " at file ../controllers/user.js:line101");
            } else {
              res.status(200).json("User picture modified");
            }
          });
        });
      }
    }
  });
};

exports.modifyUserName = (req, res, next) => {
  const updateQuery = "UPDATE user SET nom = ?, prenom = ? WHERE id = ?";
  groupomaniaDB.query(updateQuery, [req.body.firstName, req.body.lastName, req.auth.userId], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("modifyUserName error: " + err.message + " at file ../controllers/user.js:line116");
    } else {
      res.status(200).json("User name updated");
    }
  });
};

exports.modifyUserPassword = (req, res, next) => {
  const selectQuery = "SELECT password FROM user WHERE id = ?";
  groupomaniaDB.query(selectQuery, [req.auth.userId], function (err, userPassword, fields) {
    if (err != null) {
      res.status(500).json("modifyUserPassword error: " + err.message + " at file ../controllers/user.js:line127");
    } else {
      bcrypt
        .compare(req.body.oldPassword, userPassword[0].password)
        .then((valid) => {
          if (!valid) {
            res.status(401).json("Invalid current password");
          } else {
            const updateQuery = "UPDATE user SET password = ? WHERE id = ?";
            bcrypt
              .hash(req.body.newPassword, 10)
              .then((hash) => {
                groupomaniaDB.query(updateQuery, [hash, req.auth.userId], function (err, results, fields) {
                  if (err != null) {
                    res.status(500).json("modifyUserPassword error: " + err.message + " at file ../controllers/user.js:line140");
                  } else {
                    res.status(200).json("Password updated");
                  }
                });
              })
              .catch((error) => {
                res.status(500).json("bcrypt error: " + error + " at file ../controllers/user.js:line146");
              });
          }
        })
        .catch((error) => {
          res.status(500).json("bcrypt error: " + error + " at file ../controllers/user.js:line150");
        });
    }
  });
};

exports.deleteUser = (req, res, next) => {
  const deleteQuery = "DELETE FROM user Where id = ?";
  groupomaniaDB.query(deleteQuery, [req.auth.userId], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("deleteUser error: " + err.message + " at file ../controllers/user.js:line163");
    } else {
      res.status(200).json("User deleted");
    }
  });
};
