"use client";

export default function UploadProgress({
  percent,
  label = "Uploading...",
}: {
  percent: number;
  label?: string;
}) {
  return (
    <div className="mt-2 space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  );
}
