const productModels = require("../../../models/productModels/productModels");
const statusCode = require("../../status/statusCode");
const stockModel = require("../../../models/stockModels/stockModel");
const path = require('path');

module.exports = {
  async createProductSrvc(data) {
    try {
      let thumbnail = null; 

      const {
        productName,
        productDescription,
        buyingPrice,
        sellingPrice,
        discount,
        categoryId,
        sellerId,
        stockQuantity,
      } = data.body;
  
      const { productThumb } = data.files; 
  
      if (!productName) {
        return {
          status: 404,
          error: true,
          message: "Product Name field missing",
          data: null,
        };
      }
  
      if (!productDescription) {
        return {
          status: 404,
          error: true,
          message: "Product Description field missing",
          data: null,
        };
      }
  
      if (!sellingPrice) {
        return {
          status: 404,
          error: true,
          message: "Selling Price field missing",
          data: null,
        };
      }
  
      if (!productThumb) {
        return {
          status: 404,
          error: true,
          message: "Product Thumbnail field missing",
          data: null,
        };
      }
  
      if (!buyingPrice) {
        return {
          status: 404,
          error: true,
          message: "Product Buying Price field missing",
          data: null,
        };
      }
  
      if (!categoryId) {
        return {
          status: 404,
          error: true,
          message: "Product Category Id field missing",
          data: null,
        };
      }
  
      if (!stockQuantity) {
        return {
          status: 404,
          error: true,
          message: "Product Stock Quantity field missing",
          data: null,
        };
      }
  
      if (buyingPrice < 0) {
        return {
          status: 409,
          error: true,
          message: "Buying price cannot be below 0",
          data: null,
        };
      }
  
      const existsProductName = await productModels.findOne({
        productName: productName,
        isDeleted: false,
      });
  
      if (existsProductName) {
        return {
          status: 409,
          error: true,
          message: "Product Name Exists",
          data: null,
        };
      }
  
      if (productThumb) {
        const prodThumb = Array.isArray(productThumb) ? productThumb : [productThumb]; // Ensure it's always an array
  
        const imageName = path.normalize(prodThumb[0].path).split(path.sep).pop(); 
        thumbnail = imageName; 
      }
  
      // Create the product in the database
      const createProduct = await productModels.create({
        productName,
        productDescription,
        buyingPrice,
        sellingPrice,
        categoryId,
        sellerId,
        productThumb: thumbnail, 
      });
  
      if (!createProduct) {
        return {
          status: 500,
          error: true,
          data: null,
          message: "Product failed to create",
        };
      }
  
      const prodId = createProduct._id.toString();
  
      const createStock = await stockModel.create({
        stockQTY: stockQuantity,
        productId: prodId,
      });
  
      if (!createStock) {
        return {
          status: 500,
          error: true,
          data: createProduct,
          message: "Stock failed to create",
        };
      }
  
      return {
        status: 201, 
        error: false,
        data: createProduct,
        message: "Product and Stock created successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        error: true,
        message: "Create Products Services Failed",
        data: null,
      };
    }
  },

  async getAllProductSrvc() {
    try {
      const result = await productModels.find({ isDeleted: false });
      if (result.length === 0) {
        return {
          status: 200,
          error: false,
          message: "No Products Listed",
          data: null,
        };
      }
      return {
        status: 200,
        error: false,
        message: "Shown All the Products",
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Get All Products Services Failed",
        data: error,
      };
    }
  },

  async getAllCategorisedProductSrvc(params) {
    try {
      const catId = params.id;
      const result = await productModels.find({
        categoryId: catId,
        isDeleted: false,
      });
      if (result.length === 0) {
        return {
          status: 200,
          error: false,
          message: "No Products Listed",
          data: null,
        };
      }
      return {
        status: 200,
        error: false,
        message: "Shown All the Categorised Products",
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Get All Category Wise Products Services Failed",
        data: error,
      };
    }
  },

  async getAllDeletedProductSrvc() {
    try {
      const result = await productModels.find({
        isDeleted: true,
        isActive: false,
      });
      if (result.length === 0) {
        return {
          status: 200,
          error: false,
          message: "No Deleted Products Listed",
          data: null,
        };
      }
      return {
        status: 200,
        error: false,
        message: "Shown All Deleted Products",
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Get All Deleted Products Services Failed",
        data: error,
      };
    }
  },

  async getAllProductsIdealService() {
    try {
      const result = await productModels.find();
      if (result) {
        return {
          status: 200,
          error: false,
          message: "Here is the List of All Products",
          data: result,
        };
      } else {
        return {
          status: 404,
          error: false,
          message: "Conflict on Loading Product Details",
          data: null,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Get All Products Ideal Services Failed",
        data: error,
      };
    }
  },

  async showSingleProductService(data) {
    try {
      const prodId = data?.id;
      const productDetails = await productModels.findOne({
        _id: prodId,
        isDeleted: false,
      });
      if (productDetails) {
        return {
          status: 200,
          error: false,
          message: "Here is the Product Details",
          data: productDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Product Not Found",
          data: null,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Get All Products Ideal Services Failed",
        data: error,
      };
    }
  },

  async deleteProductService(data) {
    try {
      const prodId = data.id;

      if (!prodId) {
        return {
          status: 409,
          error: true,
          message: "Input Feild Missing",
          data: null,
        };
      }

      let prodExists = await productModels.findOne({ _id: prodId });
      if (!prodExists) {
        return {
          status: 404,
          error: true,
          message: "Product Not Found",
          data: null,
        };
      }

      let prodDelete = await productModels.findOneAndUpdate(
        { _id: prodId },
        { isDeleted: true, isActive: false },
        { new: true }
      );

      if (prodDelete) {
        let stockDelete = await stockModel.findOneAndUpdate(
          { productId: prodId },
          { isDelete: true, isActive: false },
          { new: true }
        );

        if (stockDelete) {
          return {
            status: 200,
            error: false,
            message: "Successfully Deleted the Product and Its Stock",
            data: stockDelete,
            prodDelete,
          };
        } else {
          return {
            stats: 400,
            error: true,
            message: "Failed to Delete the Product's Stock",
            data: null,
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Delete Products Services Failed",
        data: error,
      };
    }
  },

  async activateProductService(data) {
    try {
      const prodId = data.id;

      if (!prodId) {
        return {
          status: 409,
          error: true,
          message: "Input Feild Missing",
          data: null,
        };
      }

      let prodExists = await productModels.findOne({ _id: prodId });
      if (!prodExists) {
        return {
          status: 404,
          error: true,
          message: "Product Not Found",
          data: null,
        };
      }

      let prodDelete = await productModels.findOneAndUpdate(
        { _id: prodId },
        { isDeleted: false, isActive: true },
        { new: true }
      );

      if (prodDelete) {
        let stockDelete = await stockModel.findOneAndUpdate(
          { productId: prodId },
          { isDelete: false, isActive: true },
          { new: true }
        );

        if (stockDelete) {
          return {
            status: 200,
            error: false,
            message: "Successfully Activated the Product and Its Stock",
            data: stockDelete,
            prodDelete,
          };
        } else {
          return {
            stats: 400,
            error: true,
            message: "Failed to Activate the Product's Stock",
            data: null,
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Delete Products Services Failed",
        data: error,
      };
    }
  },

  async updateProductInfoService(data, params) {
    try {
      const prodId = params.id;
      const prodExists = await productModels.findOne({
        _id: prodId,
        isDeleted: false,
      });
      if (!prodExists) {
        return {
          status: 404,
          error: true,
          message: "Product Dont Exists",
          data: null,
        };
      }

      if (data?.productName) {
        const result = await productModels.updateOne(
          { _id: prodId },
          { productName: data.productName },
          { new: true }
        );
        if (result) {
          return {
            status: 200,
            error: false,
            message: "Product Name Changed",
            data: result,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Change the Product Name",
            data: null,
          };
        }
      }

      if (data?.productDescription) {
        const result = await productModels.updateOne(
          { _id: prodId },
          { productDescription: data.productDescription },
          { new: true }
        );
        if (result) {
          return {
            status: 200,
            error: false,
            message: "Product Description Changed",
            data: result,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Change the Product Description",
            data: null,
          };
        }
      }

      if (data?.buyingPrice) {
        const result = await productModels.updateOne(
          { _id: prodId },
          { buyingPrice: data.buyingPrice },
          { new: true }
        );
        if (result) {
          return {
            status: 200,
            error: false,
            message: "Product Buying Price Changed",
            data: result,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Change the Product Buying Price",
            data: null,
          };
        }
      }

      if (data?.sellingPrice) {
        const result = await productModels.updateOne(
          { _id: prodId },
          { sellingPrice: data.sellingPrice },
          { new: true }
        );
        if (result) {
          return {
            status: 200,
            error: false,
            message: "Product Selling Price Changed",
            data: result,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Change the Product Selling Price",
            data: null,
          };
        }
      }

      if (data?.discount) {
        const result = await productModels.updateOne(
          { _id: prodId },
          { discount: data.discount },
          { new: true }
        );
        if (result) {
          return {
            status: 200,
            error: false,
            message: "Product Discount Changed",
            data: result,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Change the Product Discount",
            data: null,
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Update Products Info Services Failed",
        data: error,
      };
    }
  },

  async getPopularProducts() {
    try {
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Popular Products Services Failed",
        data: error,
      };
    }
  },
};
