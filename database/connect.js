require("dotenv").config();
const mongoose = require("mongoose");

console.log("db address:", `${process.env.DB_HOST}_${process.env.NODE_ENV}`);

mongoose.connect(
  `${process.env.DB_HOST}_${process.env.NODE_ENV}`,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
mongoose.connection.on("error", console.log);

module.exports = mongoose;
