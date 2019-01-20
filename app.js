const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("./config/passport");

app.use(passport.initialize());

app.use(
  cors({
    origin: process.env.FRONT_END_DOMAIN
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(require("./routes"));

app.use(express.static("public"));

app.use(require("./middleware/error_handler_middleware"));

module.exports = app;
