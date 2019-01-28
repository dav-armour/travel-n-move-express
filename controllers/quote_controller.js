const QuoteModel = require("./../database/models/quote_model");
const FlightModel = require("./../database/models/flight_quote_model");
const HotelModel = require("./../database/models/hotel_quote_model");
const HolidayModel = require("./../database/models/holiday_quote_model");

async function create(req, res, next) {
  //logic for creating a resource
  const { type } = req.body;
  try {
    switch (type) {
      case "Flight":
        quote = await FlightModel.create(req.body);
        break;
      case "Hotel":
        quote = await HotelModel.create(req.body);
        break;
      case "Holiday":
        quote = await HolidayModel.create(req.body);
        break;
      default:
        break;
    }
    if (!quote) {
      return next(new HTTPError(422, "Could not create quote"));
    }
    return res.status(201).json({ quote });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

async function index(req, res, next) {
  //show a list of all the resources
  try {
    const quotes = await QuoteModel.find();
    return res.json({ quotes });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

async function destroy(req, res, next) {
  //deletes the resource
  const { id } = req.params;
  try {
    const quote = await QuoteModel.findByIdAndRemove(id);
    if (!quote) {
      return next(new HTTPError(400, "Quote ID not found"));
    }
    return res.status(204).send();
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

async function show(req, res, next) {
  //show a single resource
  const { id } = req.params;
  try {
    const quote = await QuoteModel.findById(id);
    if (!quote) {
      return next(new HTTPError(400, "Quote ID not found"));
    }
    return res.json({ quote });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

async function update(req, res, next) {
  //logic for updating a resource
  const { id } = req.params;
  const { type } = req.body;
  let quote;
  try {
    switch (type) {
      case "Flight":
        quote = await FlightModel.findByIdAndUpdate(id, req.body);
        break;
      case "Hotel":
        quote = await HotelModel.findByIdAndUpdate(id, req.body);
        break;
      case "Holiday":
        quote = await HolidayModel.findByIdAndUpdate(id, req.body);
        break;
      default:
        break;
    }
    if (!quote) {
      return next(new HTTPError(400, "Quote ID not found"));
    }
    quote = await QuoteModel.findById(id);
    return res.json({ quote });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

module.exports = {
  create,
  index,
  destroy,
  show,
  update
};
