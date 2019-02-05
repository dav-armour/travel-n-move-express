const { celebrate, Joi } = require("celebrate");

function validateAdminDetails(req, res, next) {
  return (req, res, next) => {
    const JoiSchema = {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required(),
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      telephone: Joi.number().required()
    };
    celebrate({
      body: JoiSchema
    })(req, res, next);
  };
}

module.exports = {
  validateAdminDetails
};
