const UserModel = require("./../database/models/user_model");
const JWTService = require("./../services/jwt_service");

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const { user, error } = await UserModel.authenticate()(email, password);
    if (error) {
      return next(new HTTPError(401, error.message));
    }
    const token = JWTService.createToken(user._id);
    res.json({ token });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login
};
