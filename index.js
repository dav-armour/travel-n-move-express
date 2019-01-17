require("dotenv").config();
require("./database/connect");
const HTTPError = require("./errors/HTTPerror");
const app = require("./app");
const morgan = require("morgan");
app.use(morgan("combined"));

global.HTTPError = HTTPError;

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`)
);
