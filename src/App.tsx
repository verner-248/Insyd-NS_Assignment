import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { BackgroundSection } from './components/BackgroundSection';
import { SystemDesignSection } from './components/SystemDesignSection';
import { PocAppSection } from './components/PocAppSection';
import { TipsSection } from './components/TipsSection';
import { ContactSection } from './components/ContactSection';
import { AnimatedBackground } from './components/AnimatedBackground';

function App() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'background', 'system-design', 'poc-app', 'tips', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-x-hidden">
      <AnimatedBackground />
      <Navigation activeSection={activeSection} />
      
      <main className="relative z-10">
        <Hero />
        <BackgroundSection />
        <SystemDesignSection />
        <PocAppSection />
        <TipsSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;