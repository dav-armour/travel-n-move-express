module.exports = function(req, res, next) {
  console.log("REQUEST: ", req);
  return next();
};
