import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

export const DEFAULT_ADMINS = [
  {
    username: "arnavadmin",
    password: "admin@123",
    name: "Arnav Admin",
    role: "superadmin",
  },
];

export async function upsertAdmin({
  username,
  password,
  name,
  role,
}: {
  username: string;
  password: string;
  name: string;
  role: string;
}) {
  await connectDB();
  const hash = await bcrypt.hash(password, 12);
  return Admin.findOneAndUpdate(
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
}

export async function seedDefaultAdmins() {
  const results = [];
  for (const admin of DEFAULT_ADMINS) {
    const doc = await upsertAdmin(admin);
    results.push({ username: doc?.username, created: true });
  }
  return results;
}
