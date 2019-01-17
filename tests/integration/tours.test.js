const supertest = require("supertest");
const app = require("./../../app");
const mongoose = require("./../../database/connect");
const TourModel = require("./../../database/models/tour_model");
const HTTPError = require("./../../errors/HTTPError");

beforeAll(async () => {
  global.HTTPError = HTTPError;
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  mongoose.disconnect();
});

// INDEX
describe("INDEX: The user gets all tours", () => {
  test("GET /tours responds with array of tours", async () => {
    const response = await supertest(app)
      .get("/tours")
      .expect(200);
    expect(response.body).toEqual({ tours: [] });
  });
});

// CREATE
describe("CREATE: The user creates a new tour", () => {
  let tour = {};

  beforeEach(() => {
    tour = {
      title: "title",
      image: "image.png",
      price: 10000,
      description: "description",
      duration: "7 days"
    };
  });

  test("POST /tours with a valid req body creates a new tour and responds with created tour", async () => {
    const tourCount = await TourModel.count();
    const response = await supertest(app)
      .post("/tours")
      .send(tour)
      .expect(201);
    expect(response.body.tour.title).toEqual(tour.title);
    const newTourCount = await TourModel.count();
    expect(newTourCount).toBe(tourCount + 1);
    const foundTour = await TourModel.findOne({ title: tour.title }).lean();
    expect(foundTour).toMatchObject(tour);
  });

  test("POST /tours with invalid req body does not create tour and responds with error message", async () => {
    delete tour.title;
    const tourCount = await TourModel.count();
    const response = await supertest(app)
      .post("/tours")
      .send(tour)
      .expect(400);
    expect(response.body.message).toBe("Validation Error");
    expect(response.body.errors.title).toBe('"title" is required');
    const newTourCount = await TourModel.count();
    expect(newTourCount).toBe(tourCount);
  });
});

// DELETE
describe("DELETE: The user deletes an tour", () => {
  test("DELETE /tours/:id deletes the corresponding tour and responds with success", async () => {
    const tour = await TourModel.create({
      title: "delete",
      image: "delete.png",
      price: 1,
      description: "delete",
      duration: "delete"
    });
    const tourCount = await TourModel.count();
    const response = await supertest(app)
      .delete(`/tours/${tour._id}`)
      .expect(204);
    const newTourCount = await TourModel.count();
    expect(newTourCount).toBe(tourCount - 1);
    expect(response.body).toEqual({});
  });

  test("DELETE /tours/:id with invalid id returns error", async () => {
    let response = await supertest(app)
      .delete("/tours/test")
      .expect(500);

    response = await supertest(app)
      .delete("/tours/ffffffffffffffffffffffff")
      .expect(400);
    expect(response.text).toEqual("Tour ID not found");
  });

  // TODO: test for invalid id
});

// UPDATE
describe("UPDATE: A user edits an existing tour", () => {
  let tour, editedTour;

  beforeEach(async () => {
    tour = await TourModel.create({
      title: "edit me",
      image: "edit.png",
      price: 1,
      description: "edit description",
      duration: "edit duration"
    });

    editedTour = {
      title: "new title",
      image: "new.png",
      price: 100,
      description: "new description",
      duration: "new duration"
    };
  });

  test("PUT /tours/:id updates the corresponding tour and responds with new tour details", async () => {
    const tourCount = await TourModel.count();
    const response = await supertest(app)
      .put(`/tours/${tour._id}`)
      .send(editedTour)
      .expect(200);
    const newTourCount = await TourModel.count();
    expect(newTourCount).toBe(tourCount);
    const foundTour = await TourModel.findById(tour._id).lean();
    expect(foundTour).toMatchObject(editedTour);
    expect(response.body.tour._id).toEqual(tour._id.toString());
    expect(response.body.tour.title).toEqual("new title");
  });

  test("PUT /tours/:id with invalid id returns error", async () => {
    let response = await supertest(app)
      .put(`/tours/test`)
      .send(editedTour)
      .expect(500);

    response = await supertest(app)
      .put("/tours/ffffffffffffffffffffffff")
      .send(editedTour)
      .expect(400);
    expect(response.text).toEqual("Tour ID not found");
  });

  test("PUT /tours with invalid req body does not update tour and responds with error message", async () => {
    delete editedTour.title;
    const response = await supertest(app)
      .put(`/tours/${tour._id}`)
      .send(editedTour)
      .expect(400);
    expect(response.body.message).toBe("Validation Error");
    expect(response.body.errors.title).toBe('"title" is required');
  });
});

// SHOW
describe("SHOW: The user gets a single tour", () => {
  beforeEach(async () => {
    tour = await TourModel.create({
      title: "edit me",
      image: "edit.png",
      price: 1,
      description: "edit description",
      duration: "edit duration"
    });
    tourJSON = tour.toObject();
    tourJSON._id = tour._id.toString();
    tourJSON.createdAt = tour.createdAt.toISOString();
    tourJSON.updatedAt = tour.updatedAt.toISOString();
  });

  test("GET /tours/:id responds with corresponding tour object", async () => {
    const response = await supertest(app)
      .get(`/tours/${tour._id}`)
      .expect(200);
    expect(response.body).toEqual({ tour: tourJSON });
  });

  test("GET /tours/:id with invalid id returns error", async () => {
    let response = await supertest(app)
      .get(`/tours/test`)
      .expect(500);

    response = await supertest(app)
      .get(`/tours/ffffffffffffffffffffffff`)
      .expect(400);
    expect(response.text).toEqual("Tour ID not found");
  });
});
