const supertest = require("supertest");
const app = require("./../../app");
const mongoose = require("./../../database/connect");
const UserModel = require("./../../database/models/user_model");
const JWTService = require("./../../services/jwt_service");

beforeAll(async () => {
  await UserModel.deleteOne({ email: "dashboard_admin@test.com" });
  await UserModel.deleteOne({ email: "test_admin@test.com" });
  const admin = new UserModel({
    email: "dashboard_admin@test.com",
    telephone: "1234",
    first_name: "admin",
    last_name: "admin"
  });
  await admin.setPassword("testing123");
  await admin.save();
  token = JWTService.createToken(admin);
});

afterAll(async () => {
  await UserModel.deleteOne({ email: "dashboard_admin@test.com" });
  await UserModel.deleteOne({ email: "test_admin@test.com" });
  mongoose.disconnect();
});

//OVERVIEW: this test checks if all the data is retrieved from the database
describe("OVERVIEW: The admin retrieves overview stats", () => {
  test("GET /admin/overview responds with array of enquiries", async () => {
    const response = await supertest(app)
      .get("/admin/overview")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(response.body).toBeTruthy();
    expect(response.body.tours).toBeTruthy();
    let keys = ["total", "last_updated", "featured"];
    keys.map(key => expect(response.body.tours).toHaveProperty(key));
    keys.pop();
    expect(response.body.enquiries).toBeTruthy();
    keys.push("new", "researching", "pending", "closed");
    keys.map(key => expect(response.body.enquiries).toHaveProperty(key));
    keys.pop();
    expect(response.body.quotes).toBeTruthy();
    keys.push("finalized", "declined");
    keys.map(key => expect(response.body.quotes).toHaveProperty(key));
  });

  test("GET /enquiries with an invalid or missing auth token responds with unauthorized", async () => {
    // bad token
    let response = await supertest(app)
      .get("/admin/overview")
      .set("Authorization", "bad token")
      .expect(401);
    expect(response.body).toEqual({});
    // missing token
    response = await supertest(app)
      .get("/admin/overview")
      .expect(401);
    expect(response.body).toEqual({});
  });
});

describe("CREATE ADMIN: The admin creates an admin", () => {
  const testAdminDetails = {
    email: "test_admin@test.com",
    telephone: "1234",
    first_name: "admin",
    last_name: "admin",
    password: "testing123"
  };

  test("POST /admin/create-admin with valid body creates a new enquiry", async () => {
    const response = await supertest(app)
      .post("/admin/create-admin")
      .set("Authorization", `Bearer ${token}`)
      .send(testAdminDetails)
      .expect(201);
    expect(response.body).toBeTruthy();
    const user = await UserModel.findOne({
      email: testAdminDetails.email
    }).lean();
    expect(user.first_name).toEqual(testAdminDetails.first_name);
  });

  test("POST /admin/create-admin with an invalid or missing auth token responds with unauthorized", async () => {
    // bad token
    let response = await supertest(app)
      .post("/admin/create-admin")
      .set("Authorization", "bad token")
      .send(testAdminDetails)
      .expect(401);
    expect(response.body).toEqual({});
    // missing token
    response = await supertest(app)
      .post("/admin/create-admin")
      .send(testAdminDetails)
      .expect(401);
    expect(response.body).toEqual({});
  });
});
