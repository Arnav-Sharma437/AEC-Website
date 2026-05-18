"use client";

import Image from "next/image";
import { useState } from "react";
import { PRODUCT_PLACEHOLDER, resolveProductImage } from "@/lib/products-api";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function ProductImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(() => resolveProductImage(src));

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
      onError={() => {
        if (imgSrc !== PRODUCT_PLACEHOLDER) setImgSrc(PRODUCT_PLACEHOLDER);
      }}
    />
  );
}
