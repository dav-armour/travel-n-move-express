const QuoteModel = require("./quote_model");
const HolidayQuoteSchema = require("./../schemas/holiday_quote_schema");

const HolidayQuoteModel = QuoteModel.discriminator(
  "Holiday",
  HolidayQuoteSchema
);

module.exports = HolidayQuoteModel;
