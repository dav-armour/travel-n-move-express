const { celebrate, Joi } = require("celebrate");

module.exports = function validateTour(req, res, next) {
  return celebrate({
    body: {
      title: Joi.string().required(),
      image: Joi.string().required(),
      price: Joi.number().required(),
      description: Joi.string().required(),
      duration: Joi.string().required()
    }
  });
};
