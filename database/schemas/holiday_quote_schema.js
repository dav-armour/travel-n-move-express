const { Schema } = require("mongoose");

const HolidayQuoteSchema = new Schema({
  budget: {
    type: String,
    enum: ["affordable", "premium", "luxury"],
    required: true
  }
});

module.exports = HolidayQuoteSchema;
