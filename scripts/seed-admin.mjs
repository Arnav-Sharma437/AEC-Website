import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {
  }
}

loadEnv();

const AdminSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

const email = process.argv[2] || process.env.ADMIN_EMAIL || "admin@aec.com";
const password = process.argv[3] || process.env.ADMIN_PASSWORD || "admin123";

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI not set in .env.local");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const hash = await bcrypt.hash(password, 12);
  await Admin.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), password: hash, name: "AEC Admin", role: "superadmin" },
    { upsert: true }
  );
  console.log("Admin ready:", email);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
