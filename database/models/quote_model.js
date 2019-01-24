const mongoose = require("mongoose");
const QuoteSchema = require("./../schemas/quote_schema");

const QuoteModel = mongoose.model("Quote", QuoteSchema);

module.exports = QuoteModel;
