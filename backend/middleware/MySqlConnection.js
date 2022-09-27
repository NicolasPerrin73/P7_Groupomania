const mysql = require("mysql2");

//MySql connection

const groupomaniaDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MySqlPassword,
  database: "groupomania",
});

groupomaniaDB.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("MySQl connected as id " + groupomaniaDB.threadId);
});

module.exports = groupomaniaDB;
