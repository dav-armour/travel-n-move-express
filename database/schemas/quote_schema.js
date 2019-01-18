const { Schema } = require("mongoose");
const QuoteUserSchema = require("./quote_user_schema");

const QuoteSchema = new Schema(
  {
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    adults: {
      type: Number,
      required: true
    },
    children: {
      type: Number,
      required: true
    },
    flexible_dates: {
      type: Boolean,
      required: true
    },
    user: QuoteUserSchema
  },
  {
    timestamps: {},
    discriminatorKey: "type"
  }
);

module.exports = QuoteSchema;
