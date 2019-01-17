const { Schema } = require("mongoose");
const UserSchema = require("./user_schema");

const QuoteSchema = new Schema(
  {
    start_date: {
      type: String,
      required: true
    },
    end_date: {
      type: String,
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
    user: UserSchema
  },
  {
    timestamps: {},
    discriminatorKey: "type"
  }
);

module.exports = QuoteSchema;
