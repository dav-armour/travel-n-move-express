const express = require("express");
const router = express.Router();
const passport = require("passport");
const { celebrate, Joi, errors } = require('celebrate');


router.get("/", (req, res) => res.send("Welcome"));

module.exports = router;
