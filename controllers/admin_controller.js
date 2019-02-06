const EnquiryModel = require("./../database/models/enquiry_model");
const QuoteModel = require("./../database/models/quote_model");
const TourModel = require("./../database/models/tour_model");
const UserModel = require("./../database/models/user_model");
const JWTService = require("./../services/jwt_service");

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

function createAdmin(req, res, next) {
  const { email, password, first_name, last_name, telephone } = req.body;
  const user = new UserModel({
    email,
    first_name,
    last_name,
    telephone
  });

  //saves and encrypts password
  UserModel.register(user, password, (err, user) => {
    if (err) {
      return next(new HTTPError(500, err.message));
    }
    const token = JWTService.createToken(user);
    return res.status(201).json(token);
  });
}

module.exports = {
  overview,
  createAdmin
};
