const TourModel = require("../database/models/tour_model");

async function create(req, res) {
  //logic for creating a resource
  const { title, image, price, description, duration } = req.body;
  try {
    const tour = await TourModel.create({
      title,
      image,
      price,
      description,
      duration
    });
    return res.json({ tour });
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function index(req, res) {
  //showed a list of all the resources
  const tours = await TourModel.find();
  return res.json({ tours });
}

async function destroy(req, res) {
  //deletes the resource
  const { id } = req.params;
  await TourModel.findByIdAndRemove(id);
  return res.json({ message: "Succesfully deleted" });
}

async function show(req, res) {
  //show a single resource
  const { id } = req.params;

  const tour = await TourModel.findById(id);

  return res.json({ tour });
}

async function update(req, res) {
  //updates the resource
  const { title, image, price, description, duration } = req.body;
  const { id } = req.params;

  await TourModel.findByIdAndUpdate(id, {
    title,
    image,
    price,
    description,
    duration
  });
  const tour = await TourModel.findById(id);
  return res.json({ tour });
}

module.exports = {
  create,
  index,
  destroy,
  show,
  update
};
