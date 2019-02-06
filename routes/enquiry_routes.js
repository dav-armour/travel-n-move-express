const express = require("express");
const router = express.Router();
const passport = require("./../config/passport");
const EnquiryController = require("./../controllers/enquiry_controller");
const {
  validateEnquiry,
  validateEnquiryIndex
} = require("./../middleware/validation/enquiry_validation_middleware");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  validateEnquiryIndex(),
  EnquiryController.index
);

router.post("/", validateEnquiry(), EnquiryController.create);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  EnquiryController.destroy
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateEnquiry(),
  EnquiryController.update
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateEnquiry(),
  EnquiryController.update
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  EnquiryController.show
);

module.exports = router;
