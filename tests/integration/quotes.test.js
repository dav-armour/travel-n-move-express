const supertest = require("supertest");
const app = require("./../../app");
const mongoose = require("./../../database/connect");
const QuoteModel = require("./../../database/models/quote_model");
const FlightQuoteModel = require("./../../database/models/flight_quote_model");
const HotelQuoteModel = require("./../../database/models/hotel_quote_model");
const HolidayQuoteModel = require("./../../database/models/holiday_quote_model");
// const QuoteUserModel = require("./../../database/models/quote_user_model");
const UserModel = require("./../../database/models/user_model");
const HTTPError = require("./../../errors/HTTPError");
const JWTService = require("./../../services/jwt_service");

let token, quoteDetails;

beforeAll(async () => {
  global.HTTPError = HTTPError;
  await UserModel.deleteOne({ email: "quote_admin@test.com" });
  await QuoteModel.deleteMany({});
  const admin = new UserModel({
    email: "quote_admin@test.com",
    telephone: "1234",
    first_name: "admin",
    last_name: "admin"
  });
  await admin.setPassword("testing123");
  await admin.save();
  token = JWTService.createToken(admin);
  const user = {
    first_name: "user",
    last_name: "user",
    telephone: "98765432",
    email: "test@email.com"
  };
  quoteDetails = {
    start_date: new Date("2019-01-01"),
    end_date: new Date("2019-02-01"),
    destination: "India",
    adults: 1,
    children: 2,
    flexible_dates: false,
    user
  };
});

afterAll(async () => {
  QuoteModel.deleteMany({});
  mongoose.disconnect();
});

// INDEX
describe("INDEX: The admin gets all quotes", () => {
  test("GET /quotes responds with array of quotes", async () => {
    const response = await supertest(app)
      .get("/quotes")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(response.body).toEqual({ quotes: [] });
  });
  test("GET /quotes with invalid or missing token responds with unauthorized", async () => {
    // bad token
    let response = await supertest(app)
      .get("/quotes")
      .set("Authorization", "bad token")
      .expect(401);
    expect(response.body).toEqual({});
    // missing token
    response = await supertest(app)
      .get("/quotes")
      .expect(401);
    expect(response.body).toEqual({});
  });
});

// CREATE
describe("CREATE: The user creates a new flight quote", () => {
  let quote;
  beforeEach(() => {
    quote = {
      ...quoteDetails,
      type: "Flight",
      origin: "Sydney",
      seat_type: "economy"
    };
  });

  test("POST /quotes with a valid req body creates a new quote and responds with created quote", async () => {
    const quoteCount = await FlightQuoteModel.count();
    const response = await supertest(app)
      .post("/quotes")
      .send(quote)
      .expect(201);
    expect(response.body.quote.user.email).toEqual(quote.user.email);
    const newQuoteCount = await FlightQuoteModel.count();
    expect(newQuoteCount).toBe(quoteCount + 1);
    const foundQuote = await FlightQuoteModel.findOne({
      "user.email": quote.user.email
    }).lean();
    expect(foundQuote).toMatchObject(quote);
    flightQuote = foundQuote;
  });

  test("POST /quotes with invalid req body does not create quote and responds with error message", async () => {
    delete quote.origin;
    const quoteCount = await FlightQuoteModel.count();
    const response = await supertest(app)
      .post("/quotes")
      .send(quote)
      .expect(400);
    expect(response.body.message).toBe("Validation Error");
    expect(response.body.errors.origin).toBe('"origin" is required');
    const newQuoteCount = await FlightQuoteModel.count();
    expect(newQuoteCount).toBe(quoteCount);
  });
});

describe("CREATE: The user creates a new hotel quote", () => {
  let quote;
  beforeEach(() => {
    quote = {
      ...quoteDetails,
      type: "Hotel",
      num_rooms: 2,
      num_stars: 4
    };
  });

  test("POST /quotes with a valid req body creates a new quote and responds with created quote", async () => {
    const quoteCount = await HotelQuoteModel.count();
    const response = await supertest(app)
      .post("/quotes")
      .send(quote)
      .expect(201);
    expect(response.body.quote.user.email).toEqual(quote.user.email);
    const newQuoteCount = await HotelQuoteModel.count();
    expect(newQuoteCount).toBe(quoteCount + 1);
    const foundQuote = await HotelQuoteModel.findOne({
      "user.email": quote.user.email
    }).lean();
    expect(foundQuote).toMatchObject(quote);
    hotelQuote = foundQuote;
  });

  test("POST /quotes with invalid req body does not create quote and responds with error message", async () => {
    delete quote.num_rooms;
    const quoteCount = await HotelQuoteModel.count();
    const response = await supertest(app)
      .post("/quotes")
      .send(quote)
      .expect(400);
    expect(response.body.message).toBe("Validation Error");
    expect(response.body.errors.num_rooms).toBe('"num_rooms" is required');
    const newQuoteCount = await HotelQuoteModel.count();
    expect(newQuoteCount).toBe(quoteCount);
  });
});

describe("CREATE: The user creates a new holiday quote", () => {
  let quote;
  beforeEach(() => {
    quote = {
      ...quoteDetails,
      type: "Holiday",
      budget_tier: "mid-range"
    };
  });

  test("POST /quotes with a valid req body creates a new quote and responds with created quote", async () => {
    const quoteCount = await HolidayQuoteModel.count();
    const response = await supertest(app)
      .post("/quotes")
      .send(quote)
      .expect(201);
    expect(response.body.quote.user.email).toEqual(quote.user.email);
    const newQuoteCount = await HolidayQuoteModel.count();
    expect(newQuoteCount).toBe(quoteCount + 1);
    const foundQuote = await HolidayQuoteModel.findOne({
      "user.email": quote.user.email
    }).lean();
    expect(foundQuote).toMatchObject(quote);
  });

  test("POST /quotes with invalid req body does not create quote and responds with error message", async () => {
    delete quote.budget_tier;
    const quoteCount = await HolidayQuoteModel.count();
    const response = await supertest(app)
      .post("/quotes")
      .send(quote)
      .expect(400);
    expect(response.body.message).toBe("Validation Error");
    expect(response.body.errors.budget_tier).toBe('"budget_tier" is required');
    const newQuoteCount = await HolidayQuoteModel.count();
    expect(newQuoteCount).toBe(quoteCount);
  });
});

// DELETE
describe("DELETE: The user deletes an quote", () => {
  let quote = {};
  beforeEach(async () => {
    quote = await QuoteModel.create(quoteDetails);
  });

  test("DELETE /quotes/:id deletes the corresponding quote and responds with success", async () => {
    const quoteCount = await QuoteModel.count();
    const response = await supertest(app)
      .delete(`/quotes/${quote._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
    const newQuoteCount = await QuoteModel.count();
    expect(newQuoteCount).toBe(quoteCount - 1);
    expect(response.body).toEqual({});
  });

  test("DELETE /quotes/:id with invalid id returns error", async () => {
    let response = await supertest(app)
      .delete("/quotes/test")
      .set("Authorization", `Bearer ${token}`)
      .expect(500);

    response = await supertest(app)
      .delete("/quotes/ffffffffffffffffffffffff")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
    expect(response.text).toEqual("Quote ID not found");
  });

  test("DELETE /quotes/:id with invalid or missing token responds with unauthorized", async () => {
    // bad token
    let response = await supertest(app)
      .delete(`/quotes/${quote._id}`)
      .set("Authorization", "bad token")
      .expect(401);
    expect(response.body).toEqual({});
    // missing token
    response = await supertest(app)
      .delete(`/quotes/${quote._id}`)
      .expect(401);
    expect(response.body).toEqual({});
  });
});

// UPDATE
describe("UPDATE: A user edits an existing flight quote", () => {
  let quote = {};

  beforeEach(async () => {
    quote = await FlightQuoteModel.create({
      ...quoteDetails,
      type: "Flight",
      seat_type: "economy",
      origin: "Origin"
    });

    editedQuote = {
      ...quoteDetails,
      type: "Flight",
      seat_type: "first class",
      origin: "new origin"
    };
  });

  test("PUT /quotes/:id updates the corresponding quote and responds with new quote details", async () => {
    const quoteCount = await QuoteModel.count();
    const response = await supertest(app)
      .put(`/quotes/${quote._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(editedQuote)
      .expect(200);
    const newQuoteCount = await QuoteModel.count();
    expect(newQuoteCount).toBe(quoteCount);
    const foundQuote = await QuoteModel.findById(quote._id).lean();
    expect(foundQuote).toMatchObject(editedQuote);
    expect(response.body.quote._id).toEqual(quote._id.toString());
    expect(response.body.quote.seat_type).toEqual("first class");
    expect(response.body.quote.origin).toEqual("new origin");
  });

  test("PUT /quotes/:id with invalid id returns error", async () => {
    let response = await supertest(app)
      .put(`/quotes/test`)
      .set("Authorization", `Bearer ${token}`)
      .send(editedQuote)
      .expect(500);

    response = await supertest(app)
      .put("/quotes/ffffffffffffffffffffffff")
      .set("Authorization", `Bearer ${token}`)
      .send(editedQuote)
      .expect(400);
    expect(response.text).toEqual("Quote ID not found");
  });

  test("PUT /quotes/:id with an invalid or missing auth token responds with unauthorized", async () => {
    // bad token
    let response = await supertest(app)
      .put("/quotes/${quote._id}")
      .set("Authorization", "bad token")
      .send(editedQuote)
      .expect(401);
    expect(response.body).toEqual({});
    // missing token
    response = await supertest(app)
      .put("/quotes/${quote._id}")
      .send(editedQuote)
      .expect(401);
    expect(response.body).toEqual({});
  });
});

describe("UPDATE: A user edits an existing hotel quote", () => {
  let quote = {};

  beforeEach(async () => {
    quote = await HotelQuoteModel.create({
      ...quoteDetails,
      type: "Hotel",
      num_rooms: 1,
      num_stars: 3
    });

    editedQuote = {
      ...quoteDetails,
      type: "Hotel",
      num_rooms: 2,
      num_stars: 4
    };
  });

  test("PUT /quotes/:id updates the corresponding quote and responds with new quote details", async () => {
    const quoteCount = await QuoteModel.count();
    const response = await supertest(app)
      .put(`/quotes/${quote._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(editedQuote)
      .expect(200);
    const newQuoteCount = await QuoteModel.count();
    expect(newQuoteCount).toBe(quoteCount);
    const foundQuote = await QuoteModel.findById(quote._id).lean();
    expect(foundQuote).toMatchObject(editedQuote);
    expect(response.body.quote._id).toEqual(quote._id.toString());
    expect(response.body.quote.num_rooms).toEqual(2);
    expect(response.body.quote.num_stars).toEqual(4);
  });
});

describe("UPDATE: A user edits an existing holiday quote", () => {
  let quote = {};

  beforeEach(async () => {
    quote = await HolidayQuoteModel.create({
      ...quoteDetails,
      type: "Holiday",
      budget_tier: "mid-range"
    });

    editedQuote = {
      ...quoteDetails,
      type: "Holiday",
      budget_tier: "luxury"
    };
  });

  test("PUT /quotes/:id updates the corresponding quote and responds with new quote details", async () => {
    const quoteCount = await QuoteModel.count();
    const response = await supertest(app)
      .put(`/quotes/${quote._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(editedQuote)
      .expect(200);
    const newQuoteCount = await QuoteModel.count();
    expect(newQuoteCount).toBe(quoteCount);
    const foundQuote = await QuoteModel.findById(quote._id).lean();
    expect(foundQuote).toMatchObject(editedQuote);
    expect(response.body.quote._id).toEqual(quote._id.toString());
    expect(response.body.quote.budget_tier).toEqual("luxury");
  });
});

// SHOW
describe("SHOW: The user gets a single quote", () => {
  beforeEach(async () => {
    quote = await FlightQuoteModel.create({
      ...quoteDetails,
      type: "Flight",
      seat_type: "economy",
      origin: "Origin"
    });
    quoteJSON = quote.toObject();
    quoteJSON._id = quote._id.toString();
    quoteJSON.user._id = quote.user._id.toString();
    quoteJSON.start_date = quote.start_date.toISOString();
    quoteJSON.end_date = quote.end_date.toISOString();
    quoteJSON.createdAt = quote.createdAt.toISOString();
    quoteJSON.updatedAt = quote.updatedAt.toISOString();
  });

  test("GET /quotes/:id responds with corresponding quote object", async () => {
    const response = await supertest(app)
      .get(`/quotes/${quote._id}`)
      .expect(200);
    expect(response.body).toEqual({ quote: quoteJSON });
  });

  test("GET /quotes/:id with invalid id returns error", async () => {
    let response = await supertest(app)
      .get(`/quotes/test`)
      .expect(500);

    response = await supertest(app)
      .get(`/quotes/ffffffffffffffffffffffff`)
      .expect(400);
    expect(response.text).toEqual("Quote ID not found");
  });
});
