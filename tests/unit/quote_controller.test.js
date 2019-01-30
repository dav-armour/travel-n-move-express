const QuoteController = require("./../../controllers/quote_controller");
const QuoteModel = require("./../../database/models/quote_model");
const FlightModel = require("./../../database/models/flight_quote_model");
const HotelModel = require("./../../database/models/hotel_quote_model");
const HTTPError = require("./../../errors/HTTPError");

describe("QuoteController", () => {
  describe("create()", () => {
    beforeEach(() => {
      next = jest.fn();
      FlightModel.create = jest.fn().mockResolvedValue(null);
      error = new HTTPError(422, "Could not create quote");
    });

    test("calls next() with HTTPError if quote fails to create", async () => {
      const req = {
        body: {
          type: "Flight"
        }
      };

      await QuoteController.create(req, null, next);

      expect(FlightModel.create).toBeCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(error);
    });

    test("calls next() with HTTPError if quote type is not given", async () => {
      const req = {
        body: {
          type: null
        }
      };

      await QuoteController.create(req, null, next);

      expect(next).toHaveBeenLastCalledWith(error);
    });

    test("catches any errors and calls next with new HTTPError", async () => {
      const req = {
        body: {
          type: "Hotel"
        }
      };

      error = new HTTPError(500, "test");

      HotelModel.create = jest.fn().mockImplementation(() => {
        throw new Error("test");
      });

      await QuoteController.create(req, null, next);
      expect(HotelModel.create).toBeCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(error);
    });
  });

  describe("index()", () => {
    test("catches any errors and calls next with new HTTPError", async () => {
      const req = {
        query: {}
      };
      error = new HTTPError(500, "test");

      QuoteModel.find = jest.fn().mockImplementation(() => {
        throw new Error("test");
      });

      await QuoteController.index(req, null, next);
      expect(QuoteModel.find).toBeCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(error);
    });
  });

  describe("update()", () => {
    test("calls next() with HTTPError if quote type is not given", async () => {
      const req = {
        params: {
          id: "test"
        },
        body: {
          type: null
        }
      };

      const error = new HTTPError(400, "Quote ID not found");

      next = jest.fn();

      await QuoteController.update(req, null, next);
      expect(next).toHaveBeenLastCalledWith(error);
    });
  });
});
