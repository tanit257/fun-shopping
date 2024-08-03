const { min } = require("lodash");
const { Schema, model } = require("mongoose");
const slugify = require("slugify");
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
    product_slug: {
      // quan-dui-cao-cap
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
    product_rating: {
      type: Schema.Types.Number,
      default: 4.5,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      set: (value) => Math.round(value * 10) / 10,
    },
    product_variants: {
      type: Schema.Types.Array,
      default: [],
    },
    product_shop: {
      type: { type: Schema.Types.ObjectId, ref: "Shop" },
    },
    isDraft: {
      type: Schema.Types.Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Schema.Types.Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

// Document Middleware
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

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
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
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
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
});

module.exports = {
  product: model(DOCUMENTNAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronic", electronicSchema),
};
