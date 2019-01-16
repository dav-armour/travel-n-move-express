const JWT = require("jsonwebtoken");
const expiry = "1d";

function createToken(user) {
  const token = JWT.sign(
    {
      email: user.email
    },
    process.env.JWT_SECRET,

    {
      expiresIn: expiry,
      subject: user._id.toString()
    }
  );
  return token;
}

module.exports = {
  createToken
};
