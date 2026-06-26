"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  CLIENT_IMAGE_EXTENSIONS,
  CLIENT_LOGO_PLACEHOLDER,
  type Client,
} from "@/data/clients";

function clientLogoSrc(imageFile: string, extensionIndex: number): string {
  const ext = CLIENT_IMAGE_EXTENSIONS[extensionIndex];
  if (!ext) return CLIENT_LOGO_PLACEHOLDER;
  return `/images/clients/${imageFile}${ext}`;
}

export default function ClientLogo({ client }: { client: Client }) {
  const [extensionIndex, setExtensionIndex] = useState(0);
  const [usePlaceholder, setUsePlaceholder] = useState(false);

  const src = useMemo(() => {
    if (usePlaceholder) return CLIENT_LOGO_PLACEHOLDER;
    return clientLogoSrc(client.imageFile, extensionIndex);
  }, [client.imageFile, extensionIndex, usePlaceholder]);

  return (
    <Image
      src={src}
      alt={`${client.name} logo`}
      width={160}
      height={80}
      unoptimized
      className="w-full h-full object-contain object-center"
      onError={() => {
        if (usePlaceholder) return;
        const nextIndex = extensionIndex + 1;
        if (nextIndex < CLIENT_IMAGE_EXTENSIONS.length) {
          setExtensionIndex(nextIndex);
        } else {
          setUsePlaceholder(true);
        }
      }}
    />
  );
}
