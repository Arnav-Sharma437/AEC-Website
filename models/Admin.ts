import mongoose, { Schema, models, model } from "mongoose";

const AdminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, default: "" },
    password: { type: String, required: true },
    name: { type: String, default: "Admin" },
    role: { type: String, default: "superadmin" },
  },
  { timestamps: true }
);

export const Admin = models.Admin || model("Admin", AdminSchema);
