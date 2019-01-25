const { Schema } = require("mongoose");

const UserSchema = new Schema(
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
    status: {
      type: String,
      enum: ["New", "Pending", "Researching", "Closed"],
      required: true
    },
    agent_comments: {
      type: String
    }
  },
  {
    timestamps: {}
  }
);
