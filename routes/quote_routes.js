const express = require("express");
const router = express.Router();
const passport = require("./../config/passport");
const {
  validateQuote,
  validateQuoteIndex
} = require("./../middleware/validation/quote_validation_middleware");
const QuoteController = require("../controllers/quote_controller");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  validateQuoteIndex(),
  QuoteController.index
);

router.post("/", validateQuote(), QuoteController.create);

router.get("/:id", QuoteController.show);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateQuote(),
  QuoteController.update
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateQuote(),
  QuoteController.update
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  QuoteController.destroy
);

module.exports = router;
