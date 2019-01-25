const ContactRequestModel = require("./../database/models/contact_request_model");

async function index(req, res, next) {
  try {
    const contactRequest = await ContactRequestModel.find();
    return res.json({ contactRequest });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

async function create(req, res, next) {
  try {
    request = await ContactRequestModel.create(req.body);

    if (!request) {
      return next(new HTTPError(422, "Could not create the request"));
    }
    return res.status(201).json({ request });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

module.exports = { index, create };
