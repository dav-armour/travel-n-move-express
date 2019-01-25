const ContactRequestModel = require("./../database/models/contact_request_model");

async function index(req, res, next) {
  try {
    const contactRequest = await ContactRequestModel.find();
    return res.json({ contactRequest });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

async function create(req, res, next) {}

module.exports = { index };
