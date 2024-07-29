const { Schema, model } = require("mongoose");

const DOCUMENTNAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: {
      type: Schema.Types.String,
      required: true,
    },
    product_price: {
      type: Schema.Types.Number,
      required: true,
    },
    product_description: {
      type: Schema.Types.String,
    },
    product_thumbnail: {
      type: Schema.Types.String,
      required: true,
    },
    product_quantity: {
      type: Schema.Types.Number,
      required: true,
    },
    product_type: {
      type: Schema.Types.String,
      required: true,
      enum: ["clothing", "electronic"],
    },
    product_attribute: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

const clothingSchema = new Schema({
  brand: {
    type: Schema.Types.String,
    required: true,
  },
  size: {
    type: Schema.Types.String,
  },
  material: {
    type: Schema.Types.String,
  },
});

const electronicSchema = new Schema({
  manufacturer: {
    type: Schema.Types.String,
    required: true,
  },
  model: {
    type: Schema.Types.String,
  },
  color: {
    type: Schema.Types.String,
  },
});

module.exports = {
  product: model(DOCUMENTNAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronic", electronicSchema),
};
