const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userType: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userFullName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPass: {
    type: String,
    required: true,
  },
  userImg: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  deletedDate: {
    type: Date,
    default: null,
  },
  refreshToken: {
    type: String,
  },
});

module.exports = mongoose.model("Users", userSchema);
