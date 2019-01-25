const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const ContactRequestController = require("./../controllers/contact_request_controller");

router.get("/index", ContactRequestController.index);

router.post("/create", ContactRequestController.create);

router.delete("/:id", ContactRequestController.destroy);

module.exports = router;
