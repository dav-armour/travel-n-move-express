const express = require("express");
const router = express.Router();
const passport = require("./../config/passport");
const AdminController = require("./../controllers/admin_controller");
const {
  validateAdminDetails
} = require("./../middleware/validation/admin_validation_middleware");

// Get overview stats for dashboard
router.get(
  "/overview",
  passport.authenticate("jwt", { session: false }),
  AdminController.overview
);

// create admin using celebrate and passport
router.post(
  "/create-admin",
  validateAdminDetails(),
  passport.authenticate("jwt", { session: false }),
  AdminController.createAdmin
);

module.exports = router;
