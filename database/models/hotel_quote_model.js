const QuoteModel = require("./quote_model");
const HotelQuoteSchema = require("./../schemas/hotel_quote_schema");

const HotelQuoteModel = QuoteModel.discriminator("Hotel", HotelQuoteSchema);

module.exports = HotelQuoteModel;
