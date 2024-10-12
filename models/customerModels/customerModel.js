const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  userType: {
    type: String,
    default: 2,
  },
  shippingCountry: {
    type: String,
    required: true,
  },
  shippingState: {
    type: String,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  shippingPostalCode: {
    type: Number,
    requird: true,
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
});

module.exports = mongoose.model("Customers", customerSchema);
