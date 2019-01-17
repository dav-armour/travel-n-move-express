const QuoteModel = require("./quote_model");
const FlightQuoteSchema = require("./../schemas/flight_quote_schema");

const FlightQuoteModel = QuoteModel.discriminator("Flight", FlightQuoteSchema);

module.exports = FlightQuoteModel;
