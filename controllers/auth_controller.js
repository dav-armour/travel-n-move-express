const UserModel = require("./../database/models/user_model");
const JWTService = require("./../services/jwt_service");

function register(req, res, next) {
  const { email, password, first_name, last_name, telephone } = req.body;
  const user = new UserModel({
    email,
    first_name,
    last_name,
    telephone
  });

  //saves and encrypts password
  UserModel.register(user, password, (err, user) => {
    if (err) {
      return next(new HTTPError(500, err.message));
    }
    console.log(user);
    const token = JWTService.createToken(user);
    return res.json(token);
  });
}

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const { user, error } = await UserModel.authenticate()(email, password);
    if (error) {
      return next(new HTTPError(401, error.message));
    }
    const token = JWTService.createToken(user._id);
    res.json(token);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login
};
