//Module
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const groupomaniaDB = require("../middleware/MySqlConnection");
const fs = require("fs");
const sharp = require("sharp");

// Sign up
exports.signup = (req, res, next) => {
  //Check empty input sent
  if (req.body.email == "" || req.body.password == "" || req.body.lastName == "" || req.body.firstName == "") {
    res.status(400).json("Error : can't send empty values to database at file ../controllers/user.js:line12");
    // Hash password and add all input to database
  } else {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const hashPassword = hash;
        const insertQuery = "INSERT INTO `user`(`email`, `password`,`nom`,`prenom`) VALUES (?,?,?,?)";
        groupomaniaDB.query(insertQuery, [req.body.email, hashPassword, req.body.firstName, req.body.lastName], function (err, results, fields) {
          //Find user id created to login
          if (results != undefined) {
            const selectQuery = "SELECT id FROM user WHERE email = ?";
            groupomaniaDB.query(selectQuery, [req.body.email], function (err, results, fields) {
              if (err != null) {
                res.status(500).json("signup error : " + err.message + " at file ../controllers/user.js:line26");
                //Add signed token to database, send userId and token
              } else {
                const token = jwt.sign({ userId: results[0].id }, process.env.TOKEN_KEY, { expiresIn: "7d" });
                const updateQuery = "UPDATE user SET token = ? WHERE email = ?";
                groupomaniaDB.query(updateQuery, [token, req.body.email], function (err, results, fields) {
                  if (err != null) {
                    res.status(500).json("signup error : " + err.message + " at file ../controllers/user.js:line33");
                  }
                });
                res.status(200).json({
                  userId: results[0].id,
                  token: token,
                });
              }
            });
          } else {
            console.log(err);
            return res.status(400).json("signup error: " + err.message + " at file ../controllers/user.js:line44");
          }
        });
      })
      .catch((error) => res.status(500).json("bcrypt error: " + error + " at file ../controllers/user.js:line48"));
  }
};

//Login
exports.login = (req, res, next) => {
  //Find user in database by email
  const query = "SELECT id,password FROM user WHERE email = ?";
  groupomaniaDB.query(query, [req.body.email], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("login error : " + err.message + " at file ../controllers/user.js:line58");
      //User not find
    } else if (results[0] == undefined) {
      res.status(401).json("login error: Invalid user or password");
      //User finded
    } else {
      bcrypt
        .compare(req.body.password, results[0].password)
        .then((valid) => {
          //Password incorrect
          if (!valid) {
            res.status(401).json("login error: Invalid user or password");
            //Password correct
          } else {
            const token = jwt.sign({ userId: results[0].id }, process.env.TOKEN_KEY, { expiresIn: "7d" });
            const query = "UPDATE user SET token = ? WHERE email = ?";
            groupomaniaDB.query(query, [token, req.body.email], function (err, results, fields) {
              if (err != null) {
                res.status(500).json("login error : " + err.message + " at file ../controllers/user.js:line76");
              }
            });
            res.status(200).json({
              userId: results[0].id,
              token: token,
            });
          }
        })
        .catch((error) => res.status(500).json("bcrypt error: " + error + " at file ../controllers/user.js:line85"));
    }
  });
};

//Get user data from request
exports.getUserData = (req, res, next) => {
  const query = "SELECT `id`,`nom`,`prenom`,`picture_url`,`is_admin` FROM user WHERE id = ?";
  groupomaniaDB.query(query, [req.auth.userId], function (err, userData, fields) {
    if (err != null) {
      res.status(500).json("getUserData error: " + err.message + " at file ../controllers/user.js:line95");
    } else if (userData.length == 0) {
      res.status(404).json("getUserData error: User not found at file ../controllers/user.js:line97");
    } else {
      res.status(200).json(userData);
    }
  });
};

// User profile picture modification
exports.modifyUserPicture = (req, res, next) => {
  const { profilHaveImage } = req.body;
  const postObject = req.file
    ? {
        imageUrl: `${req.protocol}://${req.get("host")}/assets/${req.file.filename}resized.webp`,
      }
    : { ...req.body };

  const selectQuery = "SELECT picture_url FROM user WHERE id = ?";
  const updateQuery = "UPDATE user SET picture_url = ? WHERE id = ?";
  //Find user in database
  groupomaniaDB.query(selectQuery, [req.auth.userId], function (err, userData, fields) {
    if (err != null) {
      res.status(500).json("modifyPictureUser error: " + err.message + " at file ../controllers/user.js:line118");
    } else {
      //No file sent, already have picture
      if (req.file === undefined && profilHaveImage === "true") {
        res.status(200).json("User picture not modified");
        //No file sent, picture deleted
      } else if (req.file === undefined && profilHaveImage === "false") {
        const filename = userData[0].picture_url.split("/assets/")[1];
        fs.unlink(`assets/${filename}`, () => {
          groupomaniaDB.query(updateQuery, [null, req.auth.userId], function (err, results, fields) {
            if (err != null) {
              res.status(500).json("modifyPictureUser error: " + err.message + " at file ../controllers/user.js:line129");
            } else {
              res.status(200).json("User picture deleted");
            }
          });
        });
        //File sent, no picture stored
      } else if (userData[0].picture_url == null) {
        //Resize image
        sharp(`../backend/assets/${req.file.filename}`)
          .resize(200)
          .toFile(`../backend/assets/${req.file.filename}resized.webp`)
          .then((file) => {
            // Remove original image stored by multer
            fs.unlink(`./assets/${req.file.filename}`, (err) => {
              if (err) throw err;
              //Add picture to database
              groupomaniaDB.query(updateQuery, [postObject.imageUrl, req.auth.userId], function (err, results, fields) {
                if (err != null) {
                  res.status(500).json("modifyPictureUser error: " + err.message + " at file ../controllers/user.js:line148");
                } else {
                  res.status(200).json("User picture added");
                }
              });
            });
          });
        //File sent, already have picture
      } else if (userData[0].picture_url != null) {
        //Resize image
        sharp(`../backend/assets/${req.file.filename}`)
          .resize(200)
          .toFile(`../backend/assets/${req.file.filename}resized.webp`)
          .then((file) => {
            // Remove original image stored by multer
            fs.unlink(`./assets/${req.file.filename}`, (err) => {
              if (err) throw err;
              //Remove old user picture stored
              const filename = userData[0].picture_url.split("/assets/")[1];
              fs.unlink(`assets/${filename}`, () => {
                //Add picture to database
                groupomaniaDB.query(updateQuery, [postObject.imageUrl, req.auth.userId], function (err, results, fields) {
                  if (err != null) {
                    res.status(500).json("modifyPictureUser error: " + err.message + " at file ../controllers/user.js:line171");
                  } else {
                    res.status(200).json("User picture modified");
                  }
                });
              });
            });
          });
      }
    }
  });
};

//User name modification
exports.modifyUserName = (req, res, next) => {
  const updateQuery = "UPDATE user SET nom = ?, prenom = ? WHERE id = ?";
  console.log(req.body.firstName);
  groupomaniaDB.query(updateQuery, [req.body.firstName, req.body.lastName, req.auth.userId], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("modifyUserName error: " + err.message + " at file ../controllers/user.js:line190");
    } else {
      res.status(200).json("User name updated");
    }
  });
};

//User password modification
exports.modifyUserPassword = (req, res, next) => {
  //Fin user in database
  const selectQuery = "SELECT password FROM user WHERE id = ?";
  groupomaniaDB.query(selectQuery, [req.auth.userId], function (err, userPassword, fields) {
    if (err != null) {
      res.status(500).json("modifyUserPassword error: " + err.message + " at file ../controllers/user.js:line203");
      //Current Password check
    } else {
      bcrypt
        .compare(req.body.oldPassword, userPassword[0].password)
        .then((valid) => {
          //Current password incorrect
          if (!valid) {
            res.status(401).json("Invalid current password");
            //Current password correct
          } else {
            const updateQuery = "UPDATE user SET password = ? WHERE id = ?";
            bcrypt
              .hash(req.body.newPassword, 10)
              .then((hash) => {
                //Add new passord hashed to database
                groupomaniaDB.query(updateQuery, [hash, req.auth.userId], function (err, results, fields) {
                  if (err != null) {
                    res.status(500).json("modifyUserPassword error: " + err.message + " at file ../controllers/user.js:line221");
                  } else {
                    res.status(200).json("Password updated");
                  }
                });
              })
              .catch((error) => {
                res.status(500).json("bcrypt error: " + error + " at file ../controllers/user.js:line228");
              });
          }
        })
        .catch((error) => {
          res.status(500).json("bcrypt error: " + error + " at file ../controllers/user.js:line233");
        });
    }
  });
};

//Delete user account
exports.deleteUser = (req, res, next) => {
  const deleteQuery = "DELETE FROM user Where id = ?";
  groupomaniaDB.query(deleteQuery, [req.auth.userId], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("deleteUser error: " + err.message + " at file ../controllers/user.js:line244");
    } else {
      res.status(200).json("User deleted");
    }
  });
};
