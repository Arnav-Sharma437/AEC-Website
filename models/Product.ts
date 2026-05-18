import mongoose, { Schema, models, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    categoryName: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    price: { type: String, default: "XXX" },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Product =
  models.Product || model("Product", ProductSchema);
