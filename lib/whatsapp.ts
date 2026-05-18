export function buildWhatsAppUrl(
  productName: string,
  category: string,
  phone = "919831046296"
): string {
  const message = encodeURIComponent(
    `Hi AEC Team, I'm interested in *${productName}* (${category}). Please share pricing and availability.`
  );
  return `https://wa.me/${phone}?text=${message}`;
}

export function buildGeneralWhatsAppUrl(phone: string): string {
  const message = encodeURIComponent(
    "Hi, I'm interested in AEC products. Please assist."
  );
  return `https://wa.me/${phone}?text=${message}`;
}
