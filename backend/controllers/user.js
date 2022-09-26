//Module
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const connection = require("../middleware/MySqlConnection");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const hashPassword = hash;
      connection.query("INSERT INTO `user`(`email`, `password`,`nom`,`prenom`) VALUES (?,?,?,?)", [req.body.email, hashPassword, req.body.nom, req.body.prenom], function (err, results, fields) {
        if (results != undefined) {
          console.log(results);
          return res.status(200).json({ message: "User added" });
        } else {
          console.log(err);
          return res.status(500).json(err);
        }
      });
    })
    .catch((error) => res.status(500).json(error));
};

exports.login = (req, res, next) => {
  connection.query("SELECT * FROM user WHERE email = ?", [req.body.email], function (err, results, fields) {
    if (results[0] == undefined) {
      res.status(401).json("Invalid user");
    } else {
      bcrypt
        .compare(req.body.password, results[0].password)
        .then((valid) => {
          if (!valid) {
            res.status(401).json("Invalid password");
          } else {
            res.status(200).json({ userId: results[0].id, token: jwt.sign({ userId: results[0].id }, process.env.tokenKey, { expiresIn: "24h" }) });
          }
        })
        .catch((error) => res.status(500).json(error));
    }
    if (err != null) {
      res.status(500).json(err);
    }
  });
};
