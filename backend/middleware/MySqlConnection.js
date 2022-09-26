const mysql = require("mysql2");

//MySql connection

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MySqlPassword,
  database: "groupomania",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("MySQl connected as id " + connection.threadId);
});

module.exports = connection;
