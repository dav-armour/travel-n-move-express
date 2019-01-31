const EnquiryController = require("./../../controllers/enquiry_controller");
const EnquiryModel = require("./../../database/models/enquiry_model");
const HTTPError = require("./../../errors/HTTPError");

describe("EnquiryController", () => {
  describe("create()", () => {
    beforeEach(() => {
      next = jest.fn();
    });

    test("calls next() with HTTPError if Enquiry fails to create", async () => {
      const req = {
        body: "test"
      };
      error = new HTTPError(422, "Could not create enquiry");
      EnquiryModel.create = jest.fn().mockResolvedValue(null);

      await EnquiryController.create(req, null, next);

      expect(EnquiryModel.create).toBeCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(error);
    });

    test("catches any errors and calls next with new HTTPError", async () => {
      const req = {
        body: "test"
      };

      error = new HTTPError(500, "test");

      EnquiryModel.create = jest.fn().mockImplementation(() => {
        throw new Error("test");
      });

      await EnquiryController.create(req, null, next);
      expect(EnquiryModel.create).toBeCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(error);
    });
  });

  describe("index()", () => {
    test("catches any errors and calls next with new HTTPError", async () => {
      const req = {
        query: {}
      };
      error = new HTTPError(500, "test");

      EnquiryModel.find = jest.fn().mockImplementation(() => {
        throw new Error("test");
      });

      await EnquiryController.index(req, null, next);
      expect(EnquiryModel.find).toBeCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(error);
    });
  });
});
