const { Schema } = require("mongoose");

const TourSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    duration: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {}
  }
);

module.exports = TourSchema;
