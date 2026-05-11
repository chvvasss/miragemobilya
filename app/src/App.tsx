import { useEffect, useState } from 'react';
import { useLenis } from './hooks/useLenis';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import Anatomy from './sections/Anatomy';
import Tiers from './sections/Tiers';
import Footer from './sections/Footer';
import ScrollProgress from './components/ScrollProgress';
import { siteConfig } from './config';

function App() {
  useLenis();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.title = siteConfig.siteTitle || '';
    document.documentElement.lang = siteConfig.language || '';

    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = siteConfig.siteDescription || '';

    // Page-load fade-in
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <Manifesto />
        <Anatomy />
        <Tiers />
        <Footer />
      </main>
    </div>
  );
}

export default App;
