"use client";

import { X, Download } from "lucide-react";
import type { Certification } from "@/data/certifications";

interface CertificateModalProps {
  cert: Certification | null;
  onClose: () => void;
}

export default function CertificateModal({
  cert,
  onClose,
}: CertificateModalProps) {
  if (!cert) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-primary/90 p-2 text-white hover:bg-primary"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="border-b border-border p-6">
          <h3 className="font-display text-2xl font-bold text-primary">
            {cert.name}
          </h3>
          <p className="text-muted">
            {cert.issuingBody} · {cert.year}
          </p>
        </div>
        <div className="flex min-h-[400px] items-center justify-center bg-surface p-8">
          {cert.fileType === "pdf" ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-primary/10">
                <span className="font-display text-4xl font-bold text-primary">
                  PDF
                </span>
              </div>
              <p className="mb-4 text-muted">
                Upload certificate to public{cert.fileUrl}
              </p>
              <a
                href={cert.fileUrl}
                download
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-primary hover:bg-accent-dark"
              >
                <Download className="h-4 w-4" />
                Download Certificate
              </a>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cert.fileUrl}
              alt={cert.name}
              className="max-h-[70vh] object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}

