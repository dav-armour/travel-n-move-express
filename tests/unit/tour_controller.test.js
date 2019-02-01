const TourController = require("./../../controllers/tour_controller");
const TourModel = require("./../../database/models/tour_model");
const HTTPError = require("./../../errors/HTTPError");

describe("TourController", () => {
  describe("create()", () => {
    beforeEach(() => {
      next = jest.fn();
    });

    test("calls next() with HTTPError if Tour fails to create", async () => {
      const req = {
        body: "test"
      };
      error = new HTTPError(422, "Could not create tour");
      TourModel.create = jest.fn().mockResolvedValue(null);

      await TourController.create(req, null, next);

      expect(TourModel.create).toBeCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(error);
    });

    test("catches any errors and calls next with new HTTPError", async () => {
      const req = {
        body: "test"
      };

      error = new HTTPError(500, "test");

      TourModel.create = jest.fn().mockImplementation(() => {
        throw new Error("test");
      });

      await TourController.create(req, null, next);
      expect(TourModel.create).toBeCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(error);
    });
  });

  describe("index()", () => {
    test("catches any errors and calls next with new HTTPError", async () => {
      const req = {
        query: {}
      };

      error = new HTTPError(500, "test");

      TourModel.find = jest.fn().mockImplementation(() => {
        throw new Error("test");
      });

      await TourController.index(req, null, next);
      expect(TourModel.find).toBeCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(error);
    });
  });
});
