module.exports = async function() {
  console.log("Teardown");
  delete global.HTTPError;
};
