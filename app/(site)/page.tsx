import HeroSlider from "@/components/home/HeroSlider";
import StatsBar from "@/components/home/StatsBar";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FactoryProduction from "@/components/home/FactoryProduction";
import FounderPreview from "@/components/home/FounderPreview";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";
import { getHeroSlides } from "@/lib/hero-server";

export const revalidate = 60;

export default async function HomePage() {
  const heroSlides = await getHeroSlides();

  return (
    <>
      <HeroSlider initialSlides={heroSlides} />
      <StatsBar />
      <CategoryGrid />
      <FeaturedProducts />
      <WhyChooseUs />
      <FactoryProduction />
      <FounderPreview />
      <Testimonials />
      <CTABanner />
    </>
  );
}
