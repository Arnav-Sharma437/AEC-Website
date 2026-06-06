"use client";

import { useMemo, useState } from "react";
import {
  CATEGORY_IMAGE_EXTENSIONS,
  CATEGORY_IMAGE_PLACEHOLDER,
} from "@/data/categories";

function categoryImageSrc(imageFile: string, extensionIndex: number): string {
  const ext = CATEGORY_IMAGE_EXTENSIONS[extensionIndex];
  if (!ext) return CATEGORY_IMAGE_PLACEHOLDER;
  return `/images/categories/${imageFile}${ext}`;
}

export default function CategoryImage({
  imageFile,
  alt,
  className = "",
}: {
  imageFile: string;
  alt: string;
  className?: string;
}) {
  const [extensionIndex, setExtensionIndex] = useState(0);
  const [usePlaceholder, setUsePlaceholder] = useState(false);

  const src = useMemo(() => {
    if (usePlaceholder) return CATEGORY_IMAGE_PLACEHOLDER;
    return categoryImageSrc(imageFile, extensionIndex);
  }, [imageFile, extensionIndex, usePlaceholder]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (usePlaceholder) return;
        const nextIndex = extensionIndex + 1;
        if (nextIndex < CATEGORY_IMAGE_EXTENSIONS.length) {
          setExtensionIndex(nextIndex);
        } else {
          setUsePlaceholder(true);
        }
      }}
    />
  );
}
