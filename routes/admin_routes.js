const express = require("express");
const router = express.Router();
const passport = require("./../config/passport");
const AdminController = require("./../controllers/admin_controller");

//register using celebrate and passport
router.get(
  "/overview",
  passport.authenticate("jwt", { session: false }),
  AdminController.overview
);

module.exports = router;
