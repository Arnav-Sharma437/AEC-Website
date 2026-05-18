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
    // .env.local optional when vars are set in shell
  }
}

loadEnv();

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  email: String,
  password: String,
  name: String,
  role: String,
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

/** Default admins — add more here when ready */
const ADMINS = [
  {
    username: "arnavadmin",
    password: "admin@123",
    name: "Arnav Admin",
    role: "superadmin",
  },
];

async function upsertAdmin({ username, password, name, role }) {
  const hash = await bcrypt.hash(password, 12);
  await Admin.findOneAndUpdate(
    { username: username.toLowerCase() },
    {
      username: username.toLowerCase(),
      email: "",
      password: hash,
      name,
      role,
    },
    { upsert: true, new: true }
  );
  console.log(`✓ Admin created: username="${username}"`);
}

async function main() {
  if (!process.env.MONGODB_URI) {
    loadEnv();
  }
  if (!process.env.MONGODB_URI?.trim()) {
    console.error(
      "MONGODB_URI is missing or empty. Add your MongoDB Atlas connection string in Vercel → Settings → Environment Variables (Production)."
    );
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  // CLI: npm run seed:admin -- <username> <password> [display name]
  const cliUser = process.argv[2];
  const cliPass = process.argv[3];
  const cliName = process.argv[4];

  if (cliUser && cliPass) {
    await upsertAdmin({
      username: cliUser,
      password: cliPass,
      name: cliName || cliUser,
      role: "superadmin",
    });
  } else {
    for (const admin of ADMINS) {
      await upsertAdmin(admin);
    }
  }

  await mongoose.disconnect();
  console.log("\nLogin at /admin/login with your username and password.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
