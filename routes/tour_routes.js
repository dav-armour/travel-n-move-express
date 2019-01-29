const express = require("express");
const router = express.Router();
const passport = require("./../config/passport");
const validateTour = require("./../middleware/validation/tour_validation_middleware");
const TourController = require("../controllers/tour_controller");
const { imageUpload } = require("./../services/aws_service");

router.get("/", TourController.index);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  imageUpload,
  validateTour(),
  TourController.create
);

router.get("/:id", TourController.show);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  imageUpload,
  validateTour(),
  TourController.update
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  imageUpload,
  validateTour(),
  TourController.update
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  TourController.destroy
);

module.exports = router;
