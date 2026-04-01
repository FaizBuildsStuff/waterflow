import Comparator from "@/components/comparator-1";
import Content from "@/components/content-3";
import FAQs from "@/components/faqs-5";
import FeaturesBento from "@/components/features";
import Features from "@/components/features-2";
import HeroSection from "@/components/hero-section-3";
import Integrations from "@/components/integrations-1";
import LogoCloud from "@/components/logo-cloud-1";
import Pricing from "@/components/pricing-3";
import Stats from "@/components/stats-2";
import Testimonials from "@/components/testimonials-1";

export default function Home() {
  return (
    <>
      <HeroSection />
      <LogoCloud />
      <Features />
      <Integrations />
      <Content />
      <Stats />
      <Testimonials />
      <Pricing />
      <Comparator />
      <FAQs />
    </>
  );
}

