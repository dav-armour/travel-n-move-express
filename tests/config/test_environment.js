const NodeEnvironment = require("jest-environment-node");
module.exports = class TestEnvironment extends NodeEnvironment {
  async setup() {
    if (!this.global.HTTPError) {
      this.global.HTTPError = require("./../../errors/HTTPError");
    }
    await super.setup();
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
};
