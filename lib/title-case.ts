const LOWERCASE_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "via",
  "with",
]);

/** Title Case for descriptions (e.g. "eye bolts" → "Eye Bolts"). */
export function toTitleCase(text: string): string {
  return text
    .split(/(\s+|,\s*)/)
    .map((part) => {
      if (!part.trim() || /^\s*,\s*$/.test(part)) return part;
      const words = part.split(/\s+/);
      return words
        .map((word, i) => {
          const cleaned = word.replace(/[,;]/g, "");
          const suffix = word.match(/[,;]$/)?.[0] ?? "";
          if (!cleaned) return word;
          const lower = cleaned.toLowerCase();
          if (i > 0 && LOWERCASE_WORDS.has(lower)) {
            return lower + suffix;
          }
          return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase() + suffix;
        })
        .join(" ");
    })
    .join("");
}
