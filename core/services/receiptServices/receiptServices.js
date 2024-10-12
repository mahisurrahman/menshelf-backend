const productModel = require("../../../models/productModels/productModels");
const salesModel = require("../../../models/salesModels/salesModels");
const stockModel = require("../../../models/stockModels/stockModel");
const receiptModel = require("../../../models/receiptModels/receiptModel");

const options = {
  httpOnly: true,
  secure: true,
};

module.exports = {
  async showAllReceiptsServices() {
    try {
      const receiptDetails = await receiptModel.find({ isDeleted: false });
      if (receiptDetails) {
        return {
          status: 200,
          error: false,
          message: "Here are all the Receipts",
          data: receiptDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "No Receipts Found",
          data: null,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Show All Receipts Failed",
        data: null,
      };
    }
  },

  async showAllReceiptsIdealServices() {
    try {
      const receiptDetails = await receiptModel.find();
      if (receiptDetails.length > 0) {
        return {
          status: 200,
          error: false,
          message: "Here are All the Receipts",
          data: receiptDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Failed- no receipts found",
          data: null,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Show All Receipts Failed",
        data: null,
      };
    }
  },

  async createReceiptsServices(data) {
    try {
      const { salesId } = data;
      console.log(salesId, "All Sales Id");

      let productQtySoldMap = {};
      let productSoldName = {};
      for (sale of salesId) {
        const salesDetails = await salesModel.findOne({ _id: sale });
        // console.log(salesDetails);
        if (productQtySoldMap[salesDetails.productId]) {
          productQtySoldMap[salesDetails.productId] += salesDetails.qtySold;
        }
        else{
          productQtySoldMap[salesDetails.productId] = salesDetails.qtySold;
        }
      }

      let receiptInfo = []
      for(let [key,value] of Object.entries(productQtySoldMap))
        {
          let productDetails = await productModel.findOne({_id:key}).select("-productThumb -productImg").lean();
          receiptInfo.push({...productDetails,sold:value})
        }
      
      // console.log(receiptInfo,"info");
      // console.log( Object.entries(productQtySoldMap));


    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Create Receipts Services Failed",
        data: null,
      };
    }
  },
};
