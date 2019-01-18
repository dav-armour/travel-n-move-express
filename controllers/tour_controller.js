const TourModel = require("../database/models/tour_model");

async function create(req, res, next) {
  //logic for creating a resource
  try {
    const tour = await TourModel.create(req.body);
    if (!tour) {
      return next(new HTTPError(422, "Could not create tour"));
    }
    return res.status(201).json({ tour });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

async function index(req, res, next) {
  //show a list of all the resources
  try {
    const tours = await TourModel.find();
    return res.json({ tours });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

async function destroy(req, res, next) {
  //deletes the resource
  const { id } = req.params;
  try {
    const tour = await TourModel.findByIdAndRemove(id);
    if (!tour) {
      return next(new HTTPError(400, "Tour ID not found"));
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
    const tour = await TourModel.findById(id);
    if (!tour) {
      return next(new HTTPError(400, "Tour ID not found"));
    }
    return res.json({ tour });
  } catch (err) {
    return next(new HTTPError(500, err.message));
  }
}

async function update(req, res, next) {
  //updates the resource
  const { id } = req.params;

  try {
    let tour = await TourModel.findByIdAndUpdate(id, req.body);
    if (!tour) {
      return next(new HTTPError(400, "Tour ID not found"));
    }
    tour = await TourModel.findById(id);
    if (!tour) {
      return next(new HTTPError(500, "Failed to find updated tour"));
    }
    return res.json({ tour });
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
