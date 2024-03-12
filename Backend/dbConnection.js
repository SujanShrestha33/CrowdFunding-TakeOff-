const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;

function connectDb() {
  return mongoose.connect(URI);
}

module.exports = connectDb;
