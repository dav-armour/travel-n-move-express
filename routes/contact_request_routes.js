const express = require("express");
const router = express.Router();
const ContactRequestController = require("./../controllers/contact_request_controller");
const validateContactRequest = require("./../middleware/validation/contact_request_validation_middleware");

router.get("/index", ContactRequestController.index);

router.post("/", validateContactRequest(), ContactRequestController.create);

router.delete("/:id", ContactRequestController.destroy);

router.put("/:id", validateContactRequest(), ContactRequestController.update);

router.patch("/:id", validateContactRequest(), ContactRequestController.update);

router.get("/:id", ContactRequestController.show);

module.exports = router;
