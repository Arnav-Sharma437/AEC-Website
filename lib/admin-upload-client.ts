import { isVideoFile, resolveMimeType } from "@/lib/file-mime";

export interface UploadResult {
  url: string;
  publicId: string;
}

/** Vercel serverless body limit ~4.5MB — larger files go direct to Cloudinary. */
const SERVER_UPLOAD_MAX = 4 * 1024 * 1024;

function xhrUpload(
  url: string,
  formData: FormData,
  onProgress: (percent: number) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          if (data.secure_url && data.public_id) {
            resolve({ url: data.secure_url, publicId: data.public_id });
          } else if (data.url && data.publicId) {
            resolve({ url: data.url, publicId: data.publicId });
          } else {
            reject(new Error("Invalid upload response"));
          }
        } else {
          reject(new Error(data.error?.message || data.error || "Upload failed"));
        }
      } catch {
        reject(new Error("Upload failed"));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error during upload"))
    );
    xhr.open("POST", url);
    xhr.send(formData);
  });
}

async function uploadDirectToCloudinary(
  file: File,
  folder: string,
  onProgress: (percent: number) => void
): Promise<UploadResult> {
  const isVideo = isVideoFile(file);
  const resourceType = isVideo ? "video" : "image";

  const sigRes = await fetch(
    `/api/admin/upload/signature?folder=${encodeURIComponent(folder)}&type=${resourceType}`
  );
  const sig = await sigRes.json();
  if (!sigRes.ok) {
    throw new Error(sig.error || "Could not start upload");
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", String(sig.timestamp));
  fd.append("signature", sig.signature);
  fd.append("folder", sig.folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`;
  return xhrUpload(endpoint, fd, onProgress);
}

async function uploadViaServer(
  file: File,
  folder: string,
  onProgress: (percent: number) => void
): Promise<UploadResult> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  fd.append("mimeType", resolveMimeType(file));
  return xhrUpload("/api/admin/upload", fd, onProgress);
}

export function uploadWithProgress(
  file: File,
  folder: string,
  onProgress: (percent: number) => void
): Promise<UploadResult> {
  const useDirect =
    isVideoFile(file) || file.size > SERVER_UPLOAD_MAX;

  if (useDirect) {
    return uploadDirectToCloudinary(file, folder, onProgress);
  }
  return uploadViaServer(file, folder, onProgress);
}
