const { Schema } = require("mongoose");

const FlightQuoteSchema = new Schema({
  seat_type: {
    type: String,
    enum: ["economy", "premium economy", "business", "first class"],
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  ticket_type: {
    type: String,
    enum: ["return", "one-way"],
    required: true
  }
});

module.exports = FlightQuoteSchema;
