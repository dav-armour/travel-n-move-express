const { celebrate, Joi } = require("celebrate");

function validateEnquiryIndex(req, res, next) {
  return (req, res, next) => {
    const JoiSchema = {
      page: Joi.number()
        .min(0)
        .default(0),
      rowsPerPage: Joi.number()
        .min(5)
        .max(25)
        .default(5)
    };
    celebrate({
      query: JoiSchema
    })(req, res, next);
  };
}

function validateEnquiry(req, res, next) {
  return (req, res, next) => {
    const JoiSchema = {
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
        "closed"
      ),
      agent_comments: Joi.string()
    };
    celebrate({
      body: JoiSchema
    })(req, res, next);
  };
}

module.exports = {
  validateEnquiry,
  validateEnquiryIndex
};
