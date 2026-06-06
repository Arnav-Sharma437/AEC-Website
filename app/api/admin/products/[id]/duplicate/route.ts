import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { requireAdminSession } from "@/lib/admin-api";
import { slugify } from "@/lib/slug";

type Params = { params: { id: string } };

export async function POST(_req: Request, { params }: Params) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    await connectDB();
    const original = await Product.findById(params.id).lean();
    if (!original) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const copyName = `${original.name} (Copy)`;
    const slug = `${slugify(copyName)}-${Date.now()}`;

    const duplicate = await Product.create({
      name: copyName,
      slug,
      category: original.category,
      categoryName: original.categoryName,
      subCategory: original.subCategory,
      subCategoryName: original.subCategoryName,
      description: original.description,
      image: original.image,
      imagePublicId: "",
      price: original.price,
      inStock: original.inStock,
      quantity: original.quantity,
      featured: false,
    });

    return NextResponse.json(duplicate, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Duplicate failed" }, { status: 500 });
  }
}
