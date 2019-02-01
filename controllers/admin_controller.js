const EnquiryModel = require("./../database/models/enquiry_model");
const QuoteModel = require("./../database/models/quote_model");
const TourModel = require("./../database/models/tour_model");

async function overview(req, res, next) {
  try {
    const enquiries = await EnquiryModel.overview();
    const quotes = await QuoteModel.overview();
    const tours = await TourModel.overview();
    return res.json({ enquiries, quotes, tours });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

module.exports = {
  overview
};
