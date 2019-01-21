const { celebrate, Joi } = require("celebrate");
const HTTPError = require("./../../errors/HTTPError");

module.exports = function validateQuote(req, res, next) {
  return (req, res, next) => {
    // console.log(req.body);
    const JoiSchema = {
      type: Joi.string()
        .valid("Flight", "Holiday", "Hotel")
        .required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      destination: Joi.string().required(),
      adults: Joi.number()
        .integer()
        .min(0)
        .required(),
      children: Joi.number()
        .integer()
        .min(0)
        .required(),
      flexible_dates: Joi.boolean().required(),
      user: {
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        telephone: Joi.string().required(),
        email: Joi.string()
          .email()
          .required()
      },
      clientComments: Joi.string(),
      agentComments: Joi.string(),
      status: Joi.string().valid(
        "new",
        "researching",
        "pending",
        "finalized",
        "declined"
      )
    };
    if (!req.body) {
      return next(new HTTPError(400, "Missing request body"));
    }
    switch (req.body.type) {
      case "Flight":
        JoiSchema.seat_type = Joi.string()
          .valid("economy", "premium economy", "business", "first class")
          .required();
        JoiSchema.origin = Joi.string().required();
        JoiSchema.ticket_type = Joi.string().valid("return", "one-way");
        break;
      case "Holiday":
        JoiSchema.budget_tier = Joi.string()
          .valid("budget", "mid-range", "luxury")
          .required();
        break;
      case "Hotel":
        JoiSchema.num_rooms = Joi.number()
          .integer()
          .min(1)
          .required();
        JoiSchema.num_stars = Joi.number()
          .integer()
          .min(1)
          .max(5)
          .required();
        break;
      default:
        break;
    }
    celebrate({
      body: JoiSchema
    })(req, res, next);
  };
};
