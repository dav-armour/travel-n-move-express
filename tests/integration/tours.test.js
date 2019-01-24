const supertest = require("supertest");
const app = require("./../../app");
const mongoose = require("./../../database/connect");
const TourModel = require("./../../database/models/tour_model");
const UserModel = require("./../../database/models/user_model");
const HTTPError = require("./../../errors/HTTPError");
const JWTService = require("./../../services/jwt_service");

let token;

beforeAll(async () => {
  global.HTTPError = HTTPError;
  await UserModel.deleteOne({ email: "tour_admin@test.com" });
  await TourModel.deleteMany({});
  const admin = new UserModel({
    email: "tour_admin@test.com",
    telephone: "1234",
    first_name: "admin",
    last_name: "admin"
  });
  await admin.setPassword("testing123");
  await admin.save();
  token = JWTService.createToken(admin);
});

afterAll(async () => {
  await UserModel.deleteOne({ email: "tour_admin@test.com" });
  await TourModel.deleteMany({});
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
      summary: "summary",
      description: "description",
      duration: "7 days",
      featured: true
    };
  });

  test("POST /tours with a valid req body creates a new tour and responds with created tour", async () => {
    const tourCount = await TourModel.count();
    const response = await supertest(app)
      .post("/tours")
      .set("Authorization", `Bearer ${token}`)
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
      .set("Authorization", `Bearer ${token}`)
      .send(tour)
      .expect(400);
    expect(response.body.message).toBe("Validation Error");
    expect(response.body.errors.title).toBe('"title" is required');
    const newTourCount = await TourModel.count();
    expect(newTourCount).toBe(tourCount);
  });

  test("POST /tours with an invalid or missing auth token responds with unauthorized", async () => {
    // bad token
    let response = await supertest(app)
      .post("/tours")
      .set("Authorization", "bad token")
      .send(tour)
      .expect(401);
    expect(response.body).toEqual({});
    // missing token
    response = await supertest(app)
      .post("/tours")
      .send(tour)
      .expect(401);
    expect(response.body).toEqual({});
  });
});

// DELETE
describe("DELETE: The user deletes an tour", () => {
  let tour = {};
  beforeEach(async () => {
    tour = await TourModel.create({
      title: "delete",
      image: "delete.png",
      price: 1,
      summary: "delete",
      description: "delete",
      duration: "delete"
    });
  });

  test("DELETE /tours/:id deletes the corresponding tour and responds with success", async () => {
    const tourCount = await TourModel.count();
    const response = await supertest(app)
      .delete(`/tours/${tour._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
    const newTourCount = await TourModel.count();
    expect(newTourCount).toBe(tourCount - 1);
    expect(response.body).toEqual({});
  });

  test("DELETE /tours/:id with invalid id returns error", async () => {
    let response = await supertest(app)
      .delete("/tours/test")
      .set("Authorization", `Bearer ${token}`)
      .expect(500);

    response = await supertest(app)
      .delete("/tours/ffffffffffffffffffffffff")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
    expect(response.text).toEqual("Tour ID not found");
  });

  test("DELETE /tours/:id with invalid or missing token responds with unauthorized", async () => {
    // bad token
    let response = await supertest(app)
      .delete(`/tours/${tour._id}`)
      .set("Authorization", "bad token")
      .expect(401);
    expect(response.body).toEqual({});
    // missing token
    response = await supertest(app)
      .delete(`/tours/${tour._id}`)
      .expect(401);
    expect(response.body).toEqual({});
  });
});

// UPDATE
describe("UPDATE: A user edits an existing tour", () => {
  let tour, editedTour;

  beforeEach(async () => {
    tour = await TourModel.create({
      title: "edit me",
      image: "edit.png",
      price: 1,
      summary: "edit summary",
      description: "edit description",
      duration: "edit duration",
      featured: true
    });

    editedTour = {
      title: "new title",
      image: "new.png",
      price: 100,
      summary: "new summary",
      description: "new description",
      duration: "new duration",
      featured: false
    };
  });

  test("PUT /tours/:id updates the corresponding tour and responds with new tour details", async () => {
    const tourCount = await TourModel.count();
    const response = await supertest(app)
      .put(`/tours/${tour._id}`)
      .set("Authorization", `Bearer ${token}`)
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
      .set("Authorization", `Bearer ${token}`)
      .send(editedTour)
      .expect(500);

    response = await supertest(app)
      .put("/tours/ffffffffffffffffffffffff")
      .set("Authorization", `Bearer ${token}`)
      .send(editedTour)
      .expect(400);
    expect(response.text).toEqual("Tour ID not found");
  });

  test("PUT /tours/:id with invalid req body does not update tour and responds with error message", async () => {
    delete editedTour.title;
    const response = await supertest(app)
      .put(`/tours/${tour._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(editedTour)
      .expect(400);
    expect(response.body.message).toBe("Validation Error");
    expect(response.body.errors.title).toBe('"title" is required');
  });

  test("PUT /tours/:id with an invalid or missing auth token responds with unauthorized", async () => {
    // bad token
    let response = await supertest(app)
      .put("/tours/${tour._id}")
      .set("Authorization", "bad token")
      .send(editedTour)
      .expect(401);
    expect(response.body).toEqual({});
    // missing token
    response = await supertest(app)
      .put("/tours/${tour._id}")
      .send(editedTour)
      .expect(401);
    expect(response.body).toEqual({});
  });
});

// SHOW
describe("SHOW: The user gets a single tour", () => {
  beforeEach(async () => {
    tour = await TourModel.create({
      title: "title",
      image: "image.png",
      price: 1,
      summary: "summary",
      description: "description",
      duration: "duration",
      featured: true
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
