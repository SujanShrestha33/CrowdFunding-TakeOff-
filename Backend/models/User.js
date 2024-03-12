const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  username: {
    required: true,
    type: String,
    unique: true,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: Number,
  refreshToken: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
