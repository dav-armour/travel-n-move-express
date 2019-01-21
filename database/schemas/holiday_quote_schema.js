const { Schema } = require("mongoose");

const HolidayQuoteSchema = new Schema({
  budget_tier: {
    type: String,
    enum: ["budget", "mid-range", "luxury"],
    required: true
  }
});

module.exports = HolidayQuoteSchema;
