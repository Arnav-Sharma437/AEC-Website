import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { requireAdminSession } from "@/lib/admin-api";
import { slugify } from "@/lib/slug";
import { CATEGORIES } from "@/data/categories";

export async function GET(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    await connectDB();
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { categoryName: { $regex: search, $options: "i" } },
      ];
    }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
    );
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    await connectDB();

    const category = CATEGORIES.find((c) => c.slug === body.category);
    let slug = slugify(body.name);
    const existing = await Product.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const product = await Product.create({
      name: body.name,
      slug,
      category: body.category,
      categoryName: category?.name || body.category,
      description: body.description || "",
      image: body.image || "",
      imagePublicId: body.imagePublicId || "",
      price: body.price || "XXX",
      inStock: body.inStock ?? true,
      quantity: body.quantity ?? 0,
      featured: body.featured ?? false,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
