// Module
const dotenv = require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");

// Routes file
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

// Express
const app = express();

//Express Json
app.use(express.json());

//Sessions
app.use(
  session({
    secret: process.env.sessionKey,
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Cors header
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

//Endpoint
//app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/api/auth", userRoutes);
app.use("/api/post", postRoutes);

module.exports = app;
