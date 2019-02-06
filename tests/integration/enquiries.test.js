const supertest = require("supertest");
const app = require("./../../app");
const mongoose = require("./../../database/connect");
const EnquiryModel = require("./../../database/models/enquiry_model");
const UserModel = require("./../../database/models/user_model");
const JWTService = require("./../../services/jwt_service");

beforeAll(async () => {
  await UserModel.deleteOne({ email: "enquiry_admin@test.com" });
  await EnquiryModel.deleteMany({});
  const admin = new UserModel({
    email: "enquiry_admin@test.com",
    telephone: "1234",
    first_name: "admin",
    last_name: "admin"
  });
  await admin.setPassword("testing123");
  await admin.save();
  token = JWTService.createToken(admin);
});

afterAll(async () => {
  await UserModel.deleteOne({ email: "enquiry_admin@test.com" });
  await EnquiryModel.deleteMany({});
  mongoose.disconnect();
});

// Creating a dummy data to use in the test
const enquiryDetails = {
  email: "santosh@test.com",
  first_name: "first_name",
  last_name: "poudyal_test",
  subject: "subject_test",
  message:
    "testmessage testmessage testmessage testmessage testmessage testmessage",
  status: "pending",
  agent_comments: "test_agent_comment"
};

//INDEX: this test checks if all the data are retrieve from the database
describe("INDEX: The user gets all enquiries", () => {
  test("GET /enquiries responds with array of enquiries", async () => {
    const response = await supertest(app)
      .get("/enquiries")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(response.body).toEqual({ enquiries: [], total: 0 });
  });

  test("GET /enquiries with an invalid or missing auth token responds with unauthorized", async () => {
    // bad token
    let response = await supertest(app)
      .get("/enquiries")
      .set("Authorization", "bad token")
      .expect(401);
    expect(response.body).toEqual({});
    // missing token
    response = await supertest(app)
      .get("/enquiries")
      .expect(401);
    expect(response.body).toEqual({});
  });
});

//Create: this test checks creating a new User in the database

describe("CREATE: The user create a enquiry", () => {
  let createDetails;
  beforeEach(() => {
    createDetails = { ...enquiryDetails };
  });

  test("POST /enquiries with valid body creates a new enquiry", async () => {
    const response = await supertest(app)
      .post("/enquiries")
      .send(enquiryDetails)
      .expect(201);
    expect(response.body).toBeTruthy();
    const foundEnquiry = await EnquiryModel.findOne({
      email: enquiryDetails.email
    }).lean();
    expect(foundEnquiry).toMatchObject(enquiryDetails);
  });

  test("POST /enquiries with no first name should return error", async () => {
    delete createDetails.first_name;
    const response = await supertest(app)
      .post("/enquiries")
      .send(createDetails)
      .expect(400);
    expect(response.body.message).toBe("Validation Error");
  });
});

//UPDATE: Testing data update in the database
describe("UPDATE: The admin updates an enquiry", () => {
  let enquiry;
  beforeEach(async () => {
    enquiry = await EnquiryModel.create({
      ...enquiryDetails,
      first_name: "Santosh from beforeEach Update"
    });
    editedEnquiry = {
      ...enquiryDetails,
      first_name: "edited Name"
    };
  });

  test("PUT /enquiries/:id updates the corresponding enquiry and responds with new enquiry details", async () => {
    const enquiryCount = await EnquiryModel.count();
    const response = await supertest(app)
      .put(`/enquiries/${enquiry._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(editedEnquiry)
      .expect(200);
    const newEnquiryCount = await EnquiryModel.count();
    expect(newEnquiryCount).toBe(enquiryCount);
    const foundEnquiry = await EnquiryModel.findById(enquiry._id).lean();
    expect(foundEnquiry).toMatchObject(editedEnquiry);
    expect(response.body.enquiry._id).toEqual(enquiry._id.toString());
    expect(response.body.enquiry.first_name).toEqual("edited Name");
  });

  test("PUT /enquiries/:id with invalid id returns error", async () => {
    let response = await supertest(app)
      .put(`/enquiries/test`)
      .set("Authorization", `Bearer ${token}`)
      .send(editedEnquiry)
      .expect(500);

    response = await supertest(app)
      .put("/enquiries/ffffffffffffffffffffffff")
      .set("Authorization", `Bearer ${token}`)
      .send(editedEnquiry)
      .expect(400);
    expect(response.text).toEqual("Enquiry not found");
  });

  test("PUT /enquiries/:id with invalid req body does not update enquiry and responds with error message", async () => {
    delete editedEnquiry.email;
    const response = await supertest(app)
      .put(`/enquiries/${enquiry._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(editedEnquiry)
      .expect(400);
    expect(response.body.message).toBe("Validation Error");
    expect(response.body.errors.email).toBe('"email" is required');
  });

  test("PUT /enquiries/:id with an invalid or missing auth token responds with unauthorized", async () => {
    // bad token
    let response = await supertest(app)
      .put("/enquiries/${enquiry._id}")
      .set("Authorization", "bad token")
      .send(editedEnquiry)
      .expect(401);
    expect(response.body).toEqual({});
    // missing token
    response = await supertest(app)
      .put("/enquiries/${enquiry._id}")
      .send(editedEnquiry)
      .expect(401);
    expect(response.body).toEqual({});
  });
});

//DELETE : testing if delete URL works

describe("DELETE: The admin deletes an enquiry", () => {
  let enquiry = {};
  beforeEach(async () => {
    enquiry = await EnquiryModel.create(enquiryDetails);
  });

  test("DELETE /enquiries/:id deletes the corresponding enquiry and responds with success", async () => {
    const enquiryCount = await EnquiryModel.count();
    const response = await supertest(app)
      .delete(`/enquiries/${enquiry._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const newEnquiryCount = await EnquiryModel.count();
    expect(newEnquiryCount).toBe(enquiryCount - 1);
    expect(response.body).toEqual({});
  });

  test("DELETE /equiries/:id with invalid id returns error", async () => {
    let response = await supertest(app)
      .delete("/enquiries/testID")
      .set("Authorization", `Bearer ${token}`)
      .expect(500);

    response = await supertest(app)
      .delete("/enquiries/ffffffffffffffffffffffff")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
    expect(response.text).toEqual("Enquiry ID not found");
  });

  test("DELETE /enquiries/:id with invalid or missing token responds with unauthorized", async () => {
    // bad token
    let response = await supertest(app)
      .delete(`/enquiries/${enquiry._id}`)
      .set("Authorization", "bad token")
      .expect(401);
    expect(response.body).toEqual({});
    // missing token
    response = await supertest(app)
      .delete(`/enquiries/${enquiry._id}`)
      .expect(401);
    expect(response.body).toEqual({});
  });
});

// SHOW: showing individual record when admin clicks on the grid
describe("SHOW: The admin gets a single enquiry", () => {
  let enquiry = {};
  beforeEach(async () => {
    enquiry = await EnquiryModel.create(enquiryDetails);
    enquiryJSON = enquiry.toObject();
    enquiryJSON._id = enquiry._id.toString();
    enquiryJSON.createdAt = enquiry.createdAt.toISOString();
    enquiryJSON.updatedAt = enquiry.updatedAt.toISOString();
  });

  test("GET /enquiries/:id responds with corresponding enquiry object", async () => {
    const response = await supertest(app)
      .get(`/enquiries/${enquiry._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(response.body).toEqual({ enquiry: enquiryJSON });
  });

  test("GET /enquiries/:id with invalid id returns error", async () => {
    let response = await supertest(app)
      .get(`/enquiries/test`)
      .set("Authorization", `Bearer ${token}`)
      .expect(500);

    response = await supertest(app)
      .get(`/enquiries/ffffffffffffffffffffffff`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
    expect(response.text).toEqual("Enquiry not found");
  });

  test("GET /enquiries/:id with an invalid or missing auth token responds with unauthorized", async () => {
    // bad token
    let response = await supertest(app)
      .get(`/enquiries/${enquiry._id}`)
      .set("Authorization", "bad token")
      .expect(401);
    expect(response.body).toEqual({});
    // missing token
    response = await supertest(app)
      .get(`/enquiries/${enquiry._id}`)
      .expect(401);
    expect(response.body).toEqual({});
  });
});
