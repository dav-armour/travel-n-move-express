const { Schema } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  }
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = UserSchema;
