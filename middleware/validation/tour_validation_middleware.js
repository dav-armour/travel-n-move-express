const { celebrate, Joi } = require("celebrate");

module.exports = function validateTour(req, res, next) {
  return celebrate({
    body: {
      title: Joi.string().required(),
      image: Joi.string(),
      price: Joi.number()
        .integer()
        .positive()
        .required(),
      summary: Joi.string()
        .required()
        .max(80),
      description: Joi.string().required(),
      duration: Joi.string().required(),
      featured: Joi.boolean()
    }
  });
};
