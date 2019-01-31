const express = require("express");
const router = express.Router();
const passport = require("./../config/passport");
const EnquiryController = require("./../controllers/enquiry_controller");
const validateContactRequest = require("./../middleware/validation/contact_request_validation_middleware");

router.get("/index", EnquiryController.index);

router.post("/", validateContactRequest(), EnquiryController.create);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  EnquiryController.destroy
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateContactRequest(),
  EnquiryController.update
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateContactRequest(),
  EnquiryController.update
);

router.get("/:id", EnquiryController.show);

module.exports = router;
