const { Schema } = require("mongoose");

const FlightQuoteSchema = new Schema({
  seat_type: {
    type: String,
    enum: ["economy", "premium economy", "business", "first class"],
    required: true,
    default: "economy"
  },
  origin: {
    type: String,
    required: true
  }
});

module.exports = FlightQuoteSchema;
