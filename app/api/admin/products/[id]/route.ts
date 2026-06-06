import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { requireAdminSession } from "@/lib/admin-api";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { CATEGORIES, getSubCategoryBySlug } from "@/data/categories";
import { normalizeStockFields } from "@/lib/product-stock";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const { error } = await requireAdminSession();
  if (error) return error;

  await connectDB();
  const product = await Product.findById(params.id).lean();
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    await connectDB();

    const existing = await Product.findById(params.id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const stock = normalizeStockFields(
      { quantity: body.quantity, inStock: body.inStock },
      { quantity: existing.quantity, inStock: existing.inStock }
    );

    const category = CATEGORIES.find((c) => c.slug === body.category);
    const sub = getSubCategoryBySlug(body.category, body.subCategory);
    if (!sub) {
      return NextResponse.json({ error: "Invalid sub-category" }, { status: 400 });
    }

    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
        category: body.category,
        categoryName: category?.name || body.category,
        subCategory: sub.slug,
        subCategoryName: sub.name,
        description: body.description,
        image: body.image,
        imagePublicId: body.imagePublicId,
        price: body.price,
        inStock: stock.inStock,
        quantity: stock.quantity,
        featured: body.featured,
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    await connectDB();
    const existing = await Product.findById(params.id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const update = { ...body } as Record<string, unknown>;
    if ("quantity" in body || "inStock" in body) {
      const stock = normalizeStockFields(
        {
          quantity: body.quantity as number | undefined,
          inStock: body.inStock as boolean | undefined,
        },
        { quantity: existing.quantity, inStock: existing.inStock }
      );
      update.quantity = stock.quantity;
      update.inStock = stock.inStock;
    }

    const product = await Product.findByIdAndUpdate(params.id, update, {
      new: true,
    });
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (product.imagePublicId) {
      await deleteFromCloudinary(product.imagePublicId);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
