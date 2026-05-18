import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import {
  ARNAVADMIN_PASSWORD_HASH,
  ARNAVADMIN_PASSWORD_PLAIN,
  ARNAVADMIN_USERNAME,
} from "@/lib/admin-credentials";

export const DEFAULT_ADMINS = [
  {
    username: ARNAVADMIN_USERNAME,
    password: ARNAVADMIN_PASSWORD_PLAIN,
    passwordHash: ARNAVADMIN_PASSWORD_HASH,
    name: "Arnav Admin",
    role: "superadmin",
  },
];

export async function upsertAdmin({
  username,
  password,
  passwordHash,
  name,
  role,
}: {
  username: string;
  password: string;
  passwordHash?: string;
  name: string;
  role: string;
}) {
  await connectDB();
  const hash =
    passwordHash || (await bcrypt.hash(password, 12));
  const normalized = username.trim().toLowerCase();

  const doc = await Admin.findOneAndUpdate(
    { username: normalized },
    {
      username: normalized,
      email: "",
      password: hash,
      name,
      role,
    },
    { upsert: true, new: true, runValidators: true }
  );

  const verify = await bcrypt.compare(password, doc!.password);
  return { doc, verify };
}

export async function seedDefaultAdmins() {
  const results = [];
  for (const admin of DEFAULT_ADMINS) {
    const { doc, verify } = await upsertAdmin(admin);
    results.push({
      username: doc?.username,
      passwordVerify: verify,
      id: doc?._id?.toString(),
    });
  }
  return results;
}
