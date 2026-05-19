const VIDEO_EXT = new Set([
  "mp4",
  "webm",
  "mov",
  "avi",
  "mkv",
  "m4v",
  "ogv",
  "mpeg",
  "mpg",
]);

const IMAGE_EXT = new Set(["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"]);

export function extensionOf(filename: string): string {
  const parts = filename.toLowerCase().split(".");
  return parts.length > 1 ? parts.pop()! : "";
}

export function isVideoFile(file: File): boolean {
  if (file.type.startsWith("video/")) return true;
  return VIDEO_EXT.has(extensionOf(file.name));
}

export function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return IMAGE_EXT.has(extensionOf(file.name));
}

export function resolveMimeType(file: File): string {
  if (file.type) return file.type;
  const ext = extensionOf(file.name);
  if (VIDEO_EXT.has(ext)) {
    const map: Record<string, string> = {
      mov: "video/quicktime",
      webm: "video/webm",
      mkv: "video/x-matroska",
      avi: "video/x-msvideo",
      m4v: "video/x-m4v",
      ogv: "video/ogg",
    };
    return map[ext] ?? "video/mp4";
  }
  if (IMAGE_EXT.has(ext)) {
    const map: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    };
    return map[ext] ?? "image/jpeg";
  }
  return "application/octet-stream";
}
