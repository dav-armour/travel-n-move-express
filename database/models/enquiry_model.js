const mongoose = require("mongoose");
const EnquirySchema = require("../schemas/enquiry_schema");

const EnquiryModel = mongoose.model("Enquiry", EnquirySchema);

module.exports = EnquiryModel;
