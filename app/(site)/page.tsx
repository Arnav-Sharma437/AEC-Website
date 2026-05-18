import HeroSlider from "@/components/home/HeroSlider";
import StatsBar from "@/components/home/StatsBar";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <StatsBar />
      <CategoryGrid />
      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
      <CTABanner />
    </>
  );
}
