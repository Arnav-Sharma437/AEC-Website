import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyCTA from "@/components/layout/StickyCTA";
import PremiumExperienceProvider from "@/components/providers/PremiumExperienceProvider";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PremiumExperienceProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <StickyCTA />
    </PremiumExperienceProvider>
  );
}
