const mysql = require("mysql2");

//MySql connection

const groupomaniaDB = mysql.createConnection({
  host: "localhost",
  user: process.env.MY_SQL_USER,
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
