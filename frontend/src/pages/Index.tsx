import Benefits from "@/components/landing/Benefits";
import Contact from "@/components/landing/Contact";
import FAQ from "@/components/landing/faq";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToHashElement from "@cascadia-code/scroll-to-hash-element";

export function Index() {
  return (
    <>
      <ScrollToHashElement behavior="smooth" />
      <Hero />
      <Benefits />
      <Features />
      <Testimonials />
      <Pricing />
      <Contact />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </>
  );
}
