import { useRef } from 'react';
import LandingNav from '../components/landing/LandingNav';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import RoleShowcase from '../components/landing/RoleShowcase';
import MissionVision from '../components/landing/MissionVision';
import CallToAction from '../components/landing/CallToAction';
import Footer from '../components/landing/Footer';
import { useRevealOnScroll } from '../hooks/useLandingEffects';

export default function Landing() {
  const ref = useRef(null);
  useRevealOnScroll(ref, '.feature-card, .step, .showcase-item, .mv-card');

  return (
    <div ref={ref}>
      <LandingNav />
      <Hero />
      <Features />
      <HowItWorks />
      <RoleShowcase />
      <MissionVision />
      <CallToAction />
      <Footer />
    </div>
  );
}
