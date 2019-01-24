const mongoose = require("mongoose");
const TourSchema = require("./../schemas/tour_schema");

const TourModel = mongoose.model("Tour", TourSchema);

module.exports = TourModel;
