import { motion, MotionConfig } from 'framer-motion';
import { LanguageProvider, useLanguage, LANG_FADE_MS } from '@/i18n/LanguageContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Research from '@/components/Research';
import Projects from '@/components/Projects';
import Publications from '@/components/Publications';
import Skills from '@/components/Skills';
import Resume from '@/components/Resume';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

function Page() {
  const { isSwitching } = useLanguage();
  const fade = {
    animate: isSwitching ? { opacity: 0, y: 6 } : { opacity: 1, y: 0 },
    transition: { duration: LANG_FADE_MS / 1000, ease: 'easeInOut' as const },
  };

  return (
    <div className="min-h-screen bg-base-950 text-gray-300">
      <Navbar />
      <motion.main initial={false} {...fade}>
        <Hero />
        <About />
        <Experience />
        <Research />
        <Projects />
        <Publications />
        <Skills />
        <Resume />
        <Contact />
      </motion.main>
      <motion.div initial={false} {...fade}>
        <Footer />
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <Page />
      </LanguageProvider>
    </MotionConfig>
  );
}
