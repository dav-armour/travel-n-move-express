const mongoose = require("mongoose");
const ContactRequestSchema = require("../schemas/contact_request_schema");

const ContactRequestModel = mongoose.model(
  "ContactRequest",
  ContactRequestSchema
);

module.exports = ContactRequestModel;
