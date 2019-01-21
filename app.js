const express = require("express");
const app = express();
const passport = require("./config/passport");

app.use(passport.initialize());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(require("./routes"));

app.use(express.static("public"));

app.use(require("./middleware/error_handler_middleware"));

module.exports = app;
