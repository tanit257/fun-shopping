"use strict";

const { product, electronic, clothing } = require("../models/product.model");

const findAllDraftForShop = (query, limit = 50, skip = 0) => {
  return product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .limit(limit)
    .skip(skip);
};
