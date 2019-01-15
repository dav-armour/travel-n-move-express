const passport = require ("passport");
const LocalStrategy = require ("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");


module.exports = passport;