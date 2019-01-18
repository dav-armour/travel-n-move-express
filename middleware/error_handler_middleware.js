const { isCelebrate } = require("celebrate");

module.exports = function(err, req, res, next) {
  // if (err) console.log(err);
  if (err && err.name === "HTTPError") {
    return res.status(err.statusCode).send(err.message);
  }

  if (isCelebrate(err)) {
    const errors = {};
    err.details.forEach(detail => {
      const field = detail.message.match(/\"(\w*)\"/)[1];
      errors[field] = detail.message;
    });
    const response = {
      message: "Validation Error",
      errors
    };
    return res.status(400).send(response);
  }

  return next(err);
};
