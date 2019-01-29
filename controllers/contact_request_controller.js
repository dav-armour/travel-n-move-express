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
    console.log(req.body);
    contactRequest = await ContactRequestModel.create(req.body);

    if (!contactRequest) {
      return next(new HTTPError(422, "Could not create the contact request"));
    }
    return res.status(201).json({ contactRequest });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

async function destroy(req, res, next) {
  //deletes the resource
  const { id } = req.params;
  try {
    const contactRequest = await ContactRequestModel.findByIdAndRemove(id);
    if (!contactRequest) {
      return next(new HTTPError(400, "Contact Request ID not found"));
    }
    return res.status(204).send();
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

//updating the record
async function update(req, res, next) {
  const { id } = req.params;

  let contactRequest;
  try {
    contactRequest = await ContactRequestModel.findByIdAndUpdate(id, req.body);

    if (!contactRequest) {
      return next(new HTTPError(400, "Contact Request not found"));
    }

    return res.json({ contactRequest });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

async function show(req, res, next) {
  //show a single resource
  const { id } = req.params;
  try {
    const contactRequest = await ContactRequestModel.findById(id);
    if (!contactRequest) {
      return next(new HTTPError(400, "Contact Request not found"));
    }
    return res.json({ contactRequest });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

module.exports = { index, create, destroy, update, show };
