const { Schema } = require("mongoose");

const QuoteUserSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

module.exports = QuoteUserSchema;
