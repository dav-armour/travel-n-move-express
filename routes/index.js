const express = require("express");
const router = express.Router();
const TourRoutes = require("./tour_routes");

router.get("/", (req, res) => res.send("Welcome"));

router.use("/tours", TourRoutes);

module.exports = router;
