import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import NewsletterSection from '@/components/NewsletterSection';
import AboutSection from '@/components/AboutSection';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FooterCTA from '@/components/FooterCTA';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      <NewsletterSection />
      <AboutSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FooterCTA />
    </div>
  );
}
