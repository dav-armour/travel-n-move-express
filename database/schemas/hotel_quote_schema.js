const { Schema } = require("mongoose");

const HotelQuoteSchema = new Schema({
  num_rooms: {
    type: Number,
    required: true
  },
  num_stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
});

module.exports = HotelQuoteSchema;
