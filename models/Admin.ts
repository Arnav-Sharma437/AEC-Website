import mongoose, { Schema, models, model } from "mongoose";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: "Admin" },
    role: { type: String, default: "superadmin" },
  },
  { timestamps: true }
);

export const Admin = models.Admin || model("Admin", AdminSchema);
