"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/premium/gsap";
import { PREMIUM_MQ } from "@/lib/premium/motion";
import CustomCursor from "@/components/premium/CustomCursor";

type PremiumContextValue = {
  enabled: boolean;
};

const PremiumContext = createContext<PremiumContextValue>({ enabled: false });

function bindLenisScrollTrigger(lenis: Lenis) {
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value?: number) {
      if (arguments.length && typeof value === "number") {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  ScrollTrigger.addEventListener("refresh", () => lenis.resize());
  ScrollTrigger.refresh();
}

export function usePremiumMotion() {
  return useContext(PremiumContext).enabled;
}

export default function PremiumExperienceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(PREMIUM_MQ);
    const update = () => setEnabled(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      document.body.classList.remove("premium-cursor");
      return;
    }

    registerGsapPlugins();
    document.body.classList.add("premium-cursor");

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    document.documentElement.classList.add("lenis", "lenis-smooth");

    lenis.on("scroll", ScrollTrigger.update);
    bindLenisScrollTrigger(lenis);

    let lastScroll = 0;
    const onLenisScroll = ({
      scroll,
      direction,
    }: {
      scroll: number;
      direction: number;
    }) => {
      window.dispatchEvent(
        new CustomEvent("lenis-scroll", {
          detail: { scroll, direction, lastScroll },
        })
      );
      lastScroll = scroll;
    };
    lenis.on("scroll", onLenisScroll);

    const tick = (time: number) => {
      lenis.raf(time);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      document.body.classList.remove("premium-cursor");
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [enabled]);

  const value = useMemo(() => ({ enabled }), [enabled]);

  return (
    <PremiumContext.Provider value={value}>
      {enabled && <CustomCursor />}
      {children}
    </PremiumContext.Provider>
  );
}
