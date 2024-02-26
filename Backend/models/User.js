const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  phoneNumber: {
    required: true,
    type: String,
  },
  address: {
    required: true,
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
});

module.exports = mongoose.model("User", userSchema);
