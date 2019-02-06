const { Schema } = require("mongoose");

const Enquiry = new Schema(
  {
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["new", "pending", "researching", "closed"],
      required: true,
      default: "new"
    },
    agent_comments: {
      type: String
    }
  },
  {
    timestamps: {}
  }
);

module.exports = Enquiry;
