const express = require("express");
const router = express.Router();
const passport = require("./../config/passport");
const validateQuote = require("./../middleware/validation/quote_validation_middleware");
const QuoteController = require("../controllers/quote_controller");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  QuoteController.index
);

router.post("/", validateQuote(), QuoteController.create);

router.get("/:id", QuoteController.show);

router.put(
  "/:id",
  validateQuote(),
  passport.authenticate("jwt", { session: false }),
  QuoteController.update
);

router.patch(
  "/:id",
  validateQuote(),
  passport.authenticate("jwt", { session: false }),
  QuoteController.update
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  QuoteController.destroy
);

module.exports = router;
