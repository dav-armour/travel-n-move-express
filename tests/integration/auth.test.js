const app = require("./../../app");
const UserModel = require("./../../database/models/user_model");
const mongoose = require("./../../database/connect");
const supertest = require("supertest");

//login tests
describe("login tests", () => {
  const user = {};
  const userDetails = {
    email: "nat6@test.com",
    telephone: "1234",
    first_name: "test",
    last_name: "test"
  };

  beforeAll(async () => {
    const user = new UserModel(userDetails);
    await user.setPassword("test");
    await user.save();
  });

  test("POST /auth/login with no email and password should return error", async () => {
    response = await supertest(app)
      .post("/auth/login")
      .send({
        email: user.email,
        password: user.password
      })
      .expect(400);
  });

  test("POST /auth/login with valid email and password", async () => {
    response = await supertest(app)
      .post("/auth/login")
      .send({
        email: userDetails.email,
        password: "test"
      })
      .expect(200);
  });
});
