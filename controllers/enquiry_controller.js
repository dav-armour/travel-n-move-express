const EnquiryModel = require("./../database/models/enquiry_model");

async function index(req, res, next) {
  const { page, rowsPerPage } = req.query;
  try {
    const enquiries = await EnquiryModel.find()
      .sort({ updatedAt: -1 })
      .skip(page * rowsPerPage)
      .limit(rowsPerPage);
    return res.json({ enquiries });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

async function create(req, res, next) {
  try {
    enquiry = await EnquiryModel.create(req.body);

    if (!enquiry) {
      return next(new HTTPError(422, "Could not create the enquiry"));
    }
    return res.status(201).json({ enquiry });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

async function destroy(req, res, next) {
  //deletes the resource
  const { id } = req.params;
  try {
    const enquiry = await EnquiryModel.findByIdAndRemove(id);
    if (!enquiry) {
      return next(new HTTPError(400, "Enquiry ID not found"));
    }
    return res.status(204).send();
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

//updating the record
async function update(req, res, next) {
  const { id } = req.params;

  let enquiry;
  try {
    enquiry = await EnquiryModel.findByIdAndUpdate(id, req.body);

    if (!enquiry) {
      return next(new HTTPError(400, "Enquiry not found"));
    }
    enquiry = await EnquiryModel.findById(id);

    return res.json({ enquiry });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

async function show(req, res, next) {
  //show a single resource
  const { id } = req.params;
  try {
    const enquiry = await EnquiryModel.findById(id);
    if (!enquiry) {
      return next(new HTTPError(400, "Enquiry not found"));
    }
    return res.json({ enquiry });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

module.exports = { index, create, destroy, update, show };
