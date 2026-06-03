/** Desktop-only premium motion (no mobile / reduced-motion). */

export const PREMIUM_MQ =
  "(max-width: 768px), (prefers-reduced-motion: reduce)";

export function isPremiumMotionEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return !window.matchMedia(PREMIUM_MQ).matches;
}

export function parseStatValue(value: string): {
  isNumeric: boolean;
  target: number;
  suffix: string;
  useCommas: boolean;
} {
  const useCommas = value.includes(",");
  const normalized = value.replace(/,/g, "");
  const match = normalized.match(/^(\d+)(.*)$/);
  if (!match) {
    return { isNumeric: false, target: 0, suffix: "", useCommas: false };
  }
  return {
    isNumeric: true,
    target: parseInt(match[1], 10),
    suffix: match[2] ?? "",
    useCommas,
  };
}

export function formatStatCount(n: number, useCommas: boolean): string {
  if (useCommas) return n.toLocaleString("en-US");
  return String(n);
}
