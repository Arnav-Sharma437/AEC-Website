import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { requireAdminSession } from "@/lib/admin-api";
import { products as staticProducts } from "@/data/products";

export async function POST() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    await connectDB();
    let synced = 0;

    for (const p of staticProducts) {
      await Product.findOneAndUpdate(
        { slug: p.id },
        {
          name: p.name,
          slug: p.id,
          category: p.categorySlug,
          categoryName: p.category,
          description: p.description,
          image: p.image,
          price: p.price,
          featured: p.featured,
          inStock: true,
          quantity: 0,
        },
        { upsert: true, new: true }
      );
      synced++;
    }

    return NextResponse.json({ synced, total: staticProducts.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
