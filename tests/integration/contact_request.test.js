const app = require("../../app");
const ContactRequestModel = require("../../database/models/contact_request_model");
const mongoose = require("../../database/connect");
const supertest = require("supertest");

beforeAll(async () => {
  await ContactRequestModel.deleteMany({});
});

afterAll(async () => {
  await ContactRequestModel.deleteMany({});
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
  test("GET / enquiries responds with array of enquiries", async () => {
    const response = await supertest(app)
      .get("/enquiries/index")
      .expect(200);
    expect(response.body).toEqual({ contactRequest: [] });
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
    const foundEnquiry = await ContactRequestModel.findOne({
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
  let contactRequest;
  beforeEach(async () => {
    contactRequest = await ContactRequestModel.create({
      ...enquiryDetails,
      first_name: "Santosh from beforeEach Update"
    });
    editedContactRequest = {
      ...enquiryDetails,
      first_name: "edited Name"
    };
  });

  test("PUT /enquiries/:id updates the corresponding contactRequest and responds with new contact Request details", async () => {
    const contactRequestCount = await ContactRequestModel.count();
    const response = await supertest(app)
      .put(`/enquiries/${contactRequest._id}`)
      .send(editedContactRequest)
      .expect(200);
    const newcontactRequestCount = await ContactRequestModel.count();
    expect(newcontactRequestCount).toBe(contactRequestCount);
    const foundContactRequest = await ContactRequestModel.findById(
      contactRequest._id
    ).lean();
    expect(foundContactRequest).toMatchObject(editedContactRequest);
    expect(response.body.contactRequest._id).toEqual(
      contactRequest._id.toString()
    );
    expect(response.body.contactRequest.first_name).toEqual("edited Name");
  });
});

//DELETE : testing if delete URL works

describe("DELETE: The admin deletes an enquiry", () => {
  let enquiryRequest = {};
  beforeEach(async () => {
    enquiryRequest = await ContactRequestModel.create(enquiryDetails);
  });

  test("DELETE /enquiries/:id deletes the corresponding enquiry and responds with success", async () => {
    const enquiryCount = await ContactRequestModel.count();
    const response = await supertest(app)
      .delete(`/enquiries/${enquiryRequest._id}`)
      .expect(204);

    const newEnquiryCount = await ContactRequestModel.count();
    expect(newEnquiryCount).toBe(enquiryCount - 1);
    expect(response.body).toEqual({});
  });

  test("DELETE /equiries/:id with invalid id returns error", async () => {
    let response = await supertest(app)
      .delete("/enquiries/testID")
      .expect(500);

    response = await supertest(app)
      .delete("/enquiries/ffffffffffffffffffffffff")
      .expect(400);
    expect(response.text).toEqual("Contact Request ID not found");
  });
});
