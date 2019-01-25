const express = require("express");
const router = express.Router();
const AuthRoutes = require("./auth_routes");
const TourRoutes = require("./tour_routes");
const QuoteRoutes = require("./quote_routes");

router.use("/auth", AuthRoutes);

router.use("/tours", TourRoutes);

router.use("/quotes", QuoteRoutes);

router.get("/", (req, res) => res.send("Welcome from AWS Beanstalk Staging"));

module.exports = router;
