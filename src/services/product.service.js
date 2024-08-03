const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");

class ProductFactory {
  static productRegistries = {};

  static registerProduct(productType, productClass) {
    this.productRegistries[productType] = productClass;
    console.log(this.productRegistries);
  }

  createProduct(type, productData) {
    console.log({ productData, type });
    console.log("==================");
    if (!ProductFactory.productRegistries[type])
      throw new BadRequestError("Invalid product type");

    return new ProductFactory.productRegistries[type](
      productData
    ).createProduct();
  }

  findDraftProductForShop = (productShop, limit = 50, skip = 0) => {
    return product.find
  };
}

class Product {
  constructor({
    product_name,
    product_price,
    product_description,
    product_thumbnail,
    product_quantity,
    product_type,
    product_attribute,
    product_shop,
  }) {
    this.product_name = product_name;
    this.product_price = product_price;
    this.product_description = product_description;
    this.product_thumbnail = product_thumbnail;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_attribute = product_attribute;
    this.product_shop = product_shop;
  }

  async createProduct(productId) {
    return await product.create({ ...this, _id: productId });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = clothing.create({
      ...this.product_attribute,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestError("Cannot create new clothing");
    }
    const newProduct = super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Cannot create new product");
    }
    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = clothing.create(this.product_attribute);
    if (!newElectronic) {
      throw new BadRequestError("Cannot create new clothing");
    }
    const newProduct = super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Cannot create new product");
    }
    return newProduct;
  }
}

ProductFactory.registerProduct("clothing", Clothing);
ProductFactory.registerProduct("electronic", Electronic);