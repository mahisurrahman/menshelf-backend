const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  salesId: {
    type: Array,
    required: true,
  },
  CustomerName: {
    type: String,
    required: true,
  },
  customerAddress: [
    {
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
    },
  ],
  sellerInfo: {
    sellerName: {
      type: String,
      required: true,
    },
    sellerNumber:{
      type: String,
      required: true,
    },
  },
  totalCost: {
    type: Number,
    required: true,
  },
  totalItemType: { // Total Koyta Item Ache, like: (apple, pen, keyboard, eikhae 3 type product ache);
    type: Number,
    required: true,
  },
  totalQuantity: { //Total quantity bolte: apple - 2 qty, pen - 1 qty, keyboard - 1, total quantity tahole:
    type: Number,
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
});

module.exports = mongoose.model("Receipts", receiptSchema);
