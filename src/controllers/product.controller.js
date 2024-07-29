const { OK } = require("../core/success.response");

const productService = require("../services/product.service");
class ProductController {
  async create(req, res) {
    new OK(
      "Create product success!",
      await productService.createProduct(req.body.product_type, req.body)
    ).send(res);
  }
}

module.exports = new ProductController();