import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function registerGsapPlugins() {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
