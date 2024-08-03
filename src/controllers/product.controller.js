const { OK } = require("../core/success.response");

const productService = require("../services/product.service");
class ProductController {
  async create(req, res) {
    new OK(
      "Create product success!",
      await productService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.userId
      })
    ).send(res);
  }
}

module.exports = new ProductController();