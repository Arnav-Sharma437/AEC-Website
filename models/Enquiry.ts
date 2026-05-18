import mongoose, { Schema, models, model } from "mongoose";

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    productInterest: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
    },
    source: { type: String, default: "contact-form" },
  },
  { timestamps: true }
);

export const Enquiry =
  models.Enquiry || model("Enquiry", EnquirySchema);
