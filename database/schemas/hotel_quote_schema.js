const { Schema } = require("mongoose");

const HotelQuoteSchema = new Schema({
  num_rooms: {
    type: Number,
    required: true,
    default: 1
  },
  num_stars: {
    type: Number,
    required: true,
    default: 3,
    min: 1,
    max: 5
  }
});

module.exports = HotelQuoteSchema;
