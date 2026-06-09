import mongoose, { Schema, models, model } from "mongoose";

const AssetSchema = new Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
    heading: { type: String, default: "" },
    subheading: { type: String, default: "" },
    buttonText: { type: String, default: "" },
    buttonLink: { type: String, default: "" },
  },
  { _id: false }
);

const HeroSettingsSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    video: { type: AssetSchema, default: () => ({}) },
    images: { type: [AssetSchema], default: () => [] },
    // Legacy slots — migrated to `images` on read; kept for existing DB documents
    image1: { type: AssetSchema, default: () => ({}) },
    image2: { type: AssetSchema, default: () => ({}) },
    image3: { type: AssetSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const HeroSettings =
  models.HeroSettings || model("HeroSettings", HeroSettingsSchema);
