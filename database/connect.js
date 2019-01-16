const mongoose = require("mongoose");

mongoose.connect(
  `${process.env.DB_HOST}_${process.env.NODE_ENV}`,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
mongoose.connection.on("error", console.log);
