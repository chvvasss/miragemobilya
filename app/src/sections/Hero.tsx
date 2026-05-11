import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { heroConfig } from '../config';
import { getLenis } from '../hooks/useLenis';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const hasHeroContent =
    heroConfig.videoPath ||
    heroConfig.eyebrow ||
    heroConfig.titleLine ||
    heroConfig.titleEmphasis ||
    heroConfig.subtitleLine1 ||
    heroConfig.subtitleLine2 ||
    heroConfig.ctaText;

  useEffect(() => {
    if (!hasHeroContent) return;

    const tl = gsap.timeline({ delay: 0.4 });

    if (eyebrowRef.current) {
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 16, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power2.out' }
      );
    }

    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power2.out' },
        '-=0.5'
      );
    }

    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 0.85, y: 0, duration: 1.0, ease: 'power2.out' },
        '-=0.7'
      );
    }

    if (ctaRef.current) {
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      );
    }

    if (scrollCueRef.current) {
      tl.fromTo(
        scrollCueRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.2'
      );
    }

    return () => {
      tl.kill();
    };
  }, [hasHeroContent]);

  if (!hasHeroContent) {
    return null;
  }

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!heroConfig.ctaTargetId) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(heroConfig.ctaTargetId);
    } else {
      document.querySelector(heroConfig.ctaTargetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollCue = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const lenis = getLenis();
    const target = '#manifesto';
    if (lenis) {
      lenis.scrollTo(target);
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: '14vh',
      }}
    >
      {/* Video Background */}
      {heroConfig.videoPath && (
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src={heroConfig.videoPath} type="video/mp4" />
        </video>
      )}

      {/* Cinematic dark overlay with vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.45) 55%, rgba(24,12,4,0.78) 100%)',
          zIndex: 1,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 60% at 50% 55%, transparent 0%, rgba(0,0,0,0.55) 100%)',
          zIndex: 1,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Hairline frame */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
          bottom: '24px',
          border: '1px solid rgba(252, 250, 238, 0.10)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Content Panel */}
      <div
        className="liquid-glass"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '620px',
          width: '90%',
          padding: '52px 44px 44px',
          borderRadius: '2px',
          textAlign: 'center',
        }}
      >
        {heroConfig.eyebrow && (
          <p
            ref={eyebrowRef}
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              color: '#938977',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginBottom: '22px',
              opacity: 0,
            }}
          >
            {heroConfig.eyebrow}
          </p>
        )}

        {(heroConfig.titleLine || heroConfig.titleEmphasis) && (
          <h1
            ref={titleRef}
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(40px, 5.2vw, 68px)',
              fontWeight: 400,
              color: '#fcfaee',
              lineHeight: 1.12,
              marginBottom: '24px',
              opacity: 0,
              textWrap: 'balance',
            }}
          >
            {heroConfig.titleLine}
            {heroConfig.titleEmphasis && (
              <>
                <br />
                <em style={{ fontStyle: 'italic' }}>{heroConfig.titleEmphasis}</em>
              </>
            )}
          </h1>
        )}

        {/* Decorative hairline below title */}
        <div
          aria-hidden
          style={{
            width: '40px',
            height: '1px',
            backgroundColor: 'rgba(147, 137, 119, 0.7)',
            margin: '0 auto 28px',
          }}
        />

        {(heroConfig.subtitleLine1 || heroConfig.subtitleLine2) && (
          <p
            ref={subtitleRef}
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: 400,
              color: '#fcfaee',
              lineHeight: 1.8,
              marginBottom: '36px',
              opacity: 0,
              maxWidth: '440px',
              marginInline: 'auto',
              letterSpacing: '0.3px',
            }}
          >
            {heroConfig.subtitleLine1}
            {heroConfig.subtitleLine1 && heroConfig.subtitleLine2 && <br />}
            {heroConfig.subtitleLine2}
          </p>
        )}

        {heroConfig.ctaText && (
          <a
            ref={ctaRef}
            href={heroConfig.ctaTargetId || '#'}
            onClick={handleCtaClick}
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              color: '#fcfaee',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(252, 250, 238, 0.4)',
              paddingBottom: '6px',
              opacity: 0,
              display: 'inline-block',
              transition: 'border-color 0.6s ease, color 0.6s ease, letter-spacing 0.6s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderBottomColor = '#938977';
              el.style.color = '#fcfaee';
              el.style.letterSpacing = '4px';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderBottomColor = 'rgba(252, 250, 238, 0.4)';
              el.style.letterSpacing = '3px';
            }}
          >
            {heroConfig.ctaText}
          </a>
        )}
      </div>

      {/* Scroll cue */}
      <div
        ref={scrollCueRef}
        onClick={handleScrollCue}
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          opacity: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '9px',
            fontWeight: 600,
            color: 'rgba(252, 250, 238, 0.7)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          Keşfet
        </span>
        <span
          aria-hidden
          className="scroll-cue-line"
          style={{
            display: 'inline-block',
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, rgba(252,250,238,0.6), rgba(252,250,238,0))',
          }}
        />
      </div>
    </section>
  );
}
