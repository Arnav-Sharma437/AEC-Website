import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { isImageFile, isVideoFile, resolveMimeType } from "@/lib/file-mime";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
/** Small videos only via server — larger videos use direct Cloudinary upload. */
const MAX_VIDEO_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";
    const mimeOverride = (formData.get("mimeType") as string) || "";

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isVideo = isVideoFile(file);
    const isImage = isImageFile(file);

    if (!isVideo && !isImage) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Use MP4, MOV, WebM, MKV for video or JPG/PNG/WebP for images.",
        },
        { status: 400 }
      );
    }

    const maxSize = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: isVideo
            ? "Video is too large for server upload. It should upload directly to Cloudinary — refresh and try again."
            : `Image too large. Max ${MAX_IMAGE_BYTES / (1024 * 1024)}MB.`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = mimeOverride || resolveMimeType(file);

    const result = await uploadToCloudinary(buffer, mimeType, folder);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[Upload]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
