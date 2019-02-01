const supertest = require("supertest");
const app = require("./../../app");
const mongoose = require("./../../database/connect");
const UserModel = require("./../../database/models/user_model");
const JWTService = require("./../../services/jwt_service");

beforeAll(async () => {
  await UserModel.deleteOne({ email: "admin@test.com" });
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
  await UserModel.deleteOne({ email: "admin@test.com" });
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
