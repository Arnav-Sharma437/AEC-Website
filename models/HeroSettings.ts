import mongoose, { Schema, models, model } from "mongoose";

const AssetSchema = new Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  { _id: false }
);

const HeroSettingsSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    video: { type: AssetSchema, default: () => ({}) },
    image1: { type: AssetSchema, default: () => ({}) },
    image2: { type: AssetSchema, default: () => ({}) },
    image3: { type: AssetSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const HeroSettings =
  models.HeroSettings || model("HeroSettings", HeroSettingsSchema);
