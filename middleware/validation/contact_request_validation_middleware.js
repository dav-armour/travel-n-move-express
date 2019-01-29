const { celebrate, Joi } = require("celebrate");
const HTTPError = require("./../../errors/HTTPError");

module.exports = function validateContactRequest(req, res, next) {
  return celebrate({
    body: {
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      subject: Joi.string().required(),
      message: Joi.string().required(),
      status: Joi.string().valid(
        "new",
        "researching",
        "pending",
        "finalized",
        "declined"
      ),
      agent_comments: Joi.string()
    }
  });
};
