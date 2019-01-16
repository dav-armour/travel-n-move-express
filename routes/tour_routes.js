const express = require("express");
const router = express.Router();
const validateTour = require("./../middleware/validation/tour_validation_middleware");
const TourController = require("../controllers/tour_controller");

router.get("/", TourController.index);

router.post("/", validateTour(), TourController.create);

router.get("/:id", TourController.show);

router.put("/:id", validateTour(), TourController.update);
router.patch("/:id", validateTour(), TourController.update);

router.delete("/:id", TourController.destroy);

module.exports = router;
