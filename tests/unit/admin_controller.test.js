const AdminController = require("./../../controllers/admin_controller");
const EnquiryModel = require("./../../database/models/enquiry_model");
const HTTPError = require("./../../errors/HTTPError");

describe("AdminController", () => {
  describe("overview()", () => {
    test("catches any errors and calls next with new HTTPError", async () => {
      error = new HTTPError(500, "test");

      EnquiryModel.overview = jest.fn().mockImplementation(() => {
        throw new Error("test");
      });

      next = jest.fn();

      await AdminController.overview(null, null, next);
      expect(EnquiryModel.overview).toBeCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(error);
    });
  });
});
