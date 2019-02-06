const { celebrate, Joi } = require("celebrate");

function validateTourIndex(req, res, next) {
  return (req, res, next) => {
    const JoiSchema = {
      page: Joi.number()
        .min(0)
        .default(0),
      rowsPerPage: Joi.number()
        .min(0)
        .max(25)
        .default(0),
      featured: Joi.boolean().default(false)
    };
    celebrate({
      query: JoiSchema
    })(req, res, next);
  };
}

function validateTour(req, res, next) {
  return (req, res, next) => {
    const JoiSchema = {
      title: Joi.string().required(),
      image: Joi.string(),
      price: Joi.number()
        .integer()
        .positive()
        .required(),
      summary: Joi.string()
        .required()
        .max(100),
      description: Joi.string().required(),
      duration: Joi.string().required(),
      featured: Joi.boolean()
    };
    celebrate({
      body: JoiSchema
    })(req, res, next);
  };
}

module.exports = {
  validateTour,
  validateTourIndex
};
