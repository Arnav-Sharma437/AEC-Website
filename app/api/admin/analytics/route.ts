import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Enquiry } from "@/models/Enquiry";
import { requireAdminSession } from "@/lib/admin-api";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    await connectDB();

    const [total, inStock, outOfStock, totalEnquiries, recentEnquiries] =
      await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ inStock: true }),
        Product.countDocuments({ inStock: false }),
        Enquiry.countDocuments(),
        Enquiry.find().sort({ createdAt: -1 }).limit(10).lean(),
      ]);

    return NextResponse.json({
      total,
      inStock,
      outOfStock,
      totalEnquiries,
      recentEnquiries,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
