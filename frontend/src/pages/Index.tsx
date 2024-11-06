import Benefits from '@/components/landing/benefits';
import Contact from '@/components/landing/contact';
import FAQ from '@/components/landing/faq';
import Features from '@/components/landing/features';
import Footer from '@/components/landing/footer';
import Hero from '@/components/landing/hero';
import Pricing from '@/components/landing/pricing';
import Testimonials from '@/components/landing/testimonials';
import ScrollToTop from '@/components/scroll-to-top';
import ScrollToHashElement from '@cascadia-code/scroll-to-hash-element';

export default function Index() {
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
