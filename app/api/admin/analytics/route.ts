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

    const [total, inStock, outOfStock, totalEnquiries, recentEnquiries, categoryAgg] =
      await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ inStock: true, quantity: { $gt: 0 } }),
        Product.countDocuments({
          $or: [{ inStock: false }, { quantity: { $lte: 0 } }],
        }),
        Enquiry.countDocuments(),
        Enquiry.find().sort({ createdAt: -1 }).limit(10).lean(),
        Product.aggregate([
          {
            $group: {
              _id: "$category",
              name: { $first: "$categoryName" },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ]),
      ]);

    const productsByCategory = categoryAgg.map(
      (c: { _id: string; name: string; count: number }) => ({
        slug: c._id,
        name: c.name || c._id,
        count: c.count,
      })
    );

    return NextResponse.json({
      total,
      inStock,
      outOfStock,
      totalEnquiries,
      recentEnquiries,
      productsByCategory,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
