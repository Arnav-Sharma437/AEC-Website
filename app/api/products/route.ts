import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { PUBLIC_PRODUCT_FILTER } from "@/lib/product-stock";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subCategory = searchParams.get("sub");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    await connectDB();

    const filter: Record<string, unknown> = { ...PUBLIC_PRODUCT_FILTER };
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (featured === "true") filter.featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { categoryName: { $regex: search, $options: "i" } },
        { subCategoryName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
