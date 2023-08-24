const mongoose = require("mongoose");

const URL = "mongodb://localhost:27017/crowdfunding-takeoff";

function connectDb() {
  return mongoose.connect(URL);
}

module.exports = connectDb;
