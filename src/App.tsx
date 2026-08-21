import { LanguageProvider } from '@/i18n/LanguageContext';
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

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-base-950 text-gray-300">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Experience />
          <Research />
          <Projects />
          <Publications />
          <Skills />
          <Resume />
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
