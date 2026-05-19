import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api";
import { getSignedUploadParams } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const folder = request.nextUrl.searchParams.get("folder") || "uploads";
    const type = request.nextUrl.searchParams.get("type");
    const resourceType = type === "video" ? "video" : "image";

    const params = getSignedUploadParams(folder, resourceType);
    return NextResponse.json(params);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to sign upload";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
