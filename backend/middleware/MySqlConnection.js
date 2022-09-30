const mysql = require("mysql");

//MySql connection

const groupomaniaDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MY_SQL_PASSWORD,
  database: "groupomania",
  multipleStatements: true,
});

groupomaniaDB.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("MySQl connected as id " + groupomaniaDB.threadId);
});

module.exports = groupomaniaDB;
