const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const AuthController = require("./../controllers/auth_controller");

//register using celebrate and passport
router.post(
  "/register",
  celebrate({
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required(),
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      telephone: Joi.number().required()
    }
  }),
  AuthController.register
);

//login using celebrate and passport
router.post(
  "/login",
  celebrate({
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }),
  AuthController.login
);

// router.get("/dashboard", AuthController.dashboard);

module.exports = router;
