const app = require("../../app");
const ContactRequestModel = require("../../database/models/contact_request_model");
const mongoose = require("../../database/connect");
const supertest = require("supertest");


describe("Contact Request tests", () => {
  const userDetails = {
    email: "santosh@test.com",
    first_name: "santosh_test",
    last_name: "poudyal_test",
    subject: "subject_test",
    message: "testmessage testmessage testmessage testmessage testmessage testmessage",
    status: "pending",
    agent_comments: "test_agent_comment"
  };

  beforeAll(async () => {
    await TourModel.deleteMany({});
    const user = new UserModel(userDetails);
    await user.save();
  });

  // beforeAll(async () => {
  //   await TourModel.deleteMany({});
  //   const admin = new UserModel({
  //     email: "tour_admin@test.com",
  //     telephone: "1234",
  //     first_name: "admin",
  //     last_name: "admin"
  //   });
  //   await admin.setPassword("testing123");
  //   await admin.save();
  //   token = JWTService.createToken(admin);
  // });

  // INDEX
describe("INDEX: The user gets all enquiries", () => {
  test("GET /enquiries responds with array of enquiries", async () => {
    const response = await supertest(app)
      .get("/enquiries/index")
      .expect(200);
    expect(response.body).toEqual({ tours: [] });
  });
});

  // test("POST /contact/submit with no first and last name, and password should return error", async () => {
  //   const response = await supertest(app)
  //     .post("/contacts/create")
  //     .send({
  //       email: "santosh@test.com",
  //       first_name: "",
  //       last_name: "poudyal_test",
  //       subject: "subject_test",
  //       message: "testmessage testmessage testmessage testmessage testmessage testmessage",
  //       status: "pending",
  //       agent_comments: "test_agent_comment"
        
        
  //     })
  //     .expect(400);
  //   expect(response.body.message).toBe("Validation Error");
  // });

  