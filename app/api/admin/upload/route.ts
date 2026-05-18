import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max ${isVideo ? "100MB" : "10MB"}.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || (isVideo ? "video/mp4" : "image/jpeg");

    const result = await uploadToCloudinary(buffer, mimeType, folder);
    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Upload failed";
    console.error("[Upload]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
