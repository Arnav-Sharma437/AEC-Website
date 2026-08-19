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
    username: "Aec@Lifting#2026",
    password: "AEC$Admin@Howrah1",
    name: "AEC Admin",
    role: "superadmin",
  },
];

/** Pre-computed bcrypt for AEC$Admin@Howrah1 */
const ARNAVADMIN_HASH =
  "$2b$12$dtZVeDBbRXpV/u6Qy/AbiON8N0AnmHuAYRdXjTNq.HpAAzsD0kkT2";

async function upsertAdmin({ username, password, name, role, useFixedHash }) {
  const hash = useFixedHash ? ARNAVADMIN_HASH : await bcrypt.hash(password, 12);
  const doc = await Admin.findOneAndUpdate(
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
  const verify = await bcrypt.compare(password, doc.password);
  console.log(`✓ Admin "${username}" saved, password verify: ${verify}`);
}

async function main() {
  if (!process.env.MONGODB_URI) {
    loadEnv();
  }

  const cliUser = process.argv[2];
  const cliPass = process.argv[3];
  const cliName = process.argv[4];

  const envUser = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;

  if (!process.env.MONGODB_URI?.trim()) {
    console.log("MONGODB_URI is not set. Skipping database seeding/updates.");
    process.exit(0);
  }

  if (!cliUser && !cliPass && (!envUser || !envPass)) {
    console.log("No credentials provided via CLI or environment variables. Skipping admin updates.");
    process.exit(0);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  if (cliUser && cliPass) {
    await upsertAdmin({
      username: cliUser,
      password: cliPass,
      name: cliName || cliUser,
      role: "superadmin",
    });
  } else if (envUser && envPass) {
    const hash = await bcrypt.hash(envPass, 12);
    const existing = await Admin.findOne();
    if (existing) {
      existing.username = envUser.toLowerCase();
      existing.password = hash;
      existing.name = "AEC Admin";
      await existing.save();
      console.log(`✓ Existing admin updated in-place via environment variables to: "${existing.username}"`);
    } else {
      await Admin.create({
        username: envUser.toLowerCase(),
        password: hash,
        name: "AEC Admin",
        role: "superadmin",
      });
      console.log(`✓ Default admin "${envUser}" created via environment variables.`);
    }
  }

  await mongoose.disconnect();
  console.log("\nLogin at /aec~!@/login with your username and password.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
