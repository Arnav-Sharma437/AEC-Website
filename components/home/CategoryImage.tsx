"use client";

import { useState } from "react";
import { CATEGORY_IMAGE_PLACEHOLDER } from "@/data/categories";

export default function CategoryImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (imgSrc !== CATEGORY_IMAGE_PLACEHOLDER) {
          setImgSrc(CATEGORY_IMAGE_PLACEHOLDER);
        }
      }}
    />
  );
}
