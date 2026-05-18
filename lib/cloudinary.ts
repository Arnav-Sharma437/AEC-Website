import { v2 as cloudinary } from "cloudinary";

function ensureConfig() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export { cloudinary };

export async function uploadToCloudinary(
  buffer: Buffer,
  mimeType: string,
  folder = "aec"
): Promise<{ url: string; publicId: string }> {
  ensureConfig();

  const isVideo = mimeType.startsWith("video/");
  const resourceType = isVideo ? "video" : "image";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `aec/${folder}`,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "auto" = "auto"
) {
  if (!publicId) return;
  ensureConfig();

  const types: ("image" | "video")[] =
    resourceType === "auto" ? ["video", "image"] : [resourceType];

  for (const type of types) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: type,
      });
      if (result.result === "ok" || result.result === "not found") return;
    } catch {
      /* try next resource type */
    }
  }
}
