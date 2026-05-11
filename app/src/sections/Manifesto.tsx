import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { manifestoConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const ornamentRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasManifestoContent = manifestoConfig.sectionLabel || manifestoConfig.text;

  useEffect(() => {
    if (!hasManifestoContent) return;

    const textEl = textRef.current;
    const containerEl = containerRef.current;
    if (!containerEl) return;

    function initAnimation() {
      // Reveal label + ornament once on entry
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current.querySelectorAll('[data-anim]'),
          { opacity: 0, y: 18, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.0,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: containerEl,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (ornamentRef.current) {
        gsap.fromTo(
          ornamentRef.current,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1,
            scaleX: 1,
            duration: 1.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ornamentRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (!textEl) return;

      // Clean up previous
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === textEl) st.kill();
      });

      // Split text into words
      splitRef.current = new SplitType(textEl, { types: 'words' });
      const words = textEl.querySelectorAll('.word');
      if (words.length === 0) return;

      tlRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: textEl,
          start: 'top 82%',
          end: 'center 55%',
          scrub: true,
        },
      });

      tlRef.current.fromTo(
        words,
        {
          opacity: 0,
          filter: 'blur(12px) brightness(30%)',
          willChange: 'filter, opacity',
        },
        {
          opacity: 1,
          filter: 'blur(0px) brightness(100%)',
          stagger: 0.04,
          ease: 'sine.out',
        }
      );
    }

    document.fonts.ready.then(() => {
      initAnimation();
    });

    const ro = new ResizeObserver(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => initAnimation(), 150);
    });
    ro.observe(containerEl);

    return () => {
      ro.disconnect();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (tlRef.current) tlRef.current.kill();
      if (splitRef.current) splitRef.current.revert();
    };
  }, [hasManifestoContent]);

  if (!hasManifestoContent) {
    return null;
  }

  return (
    <section
      id="manifesto"
      style={{
        backgroundColor: '#180c04',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      {/* Ambient warm radial glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(147, 137, 119, 0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        ref={containerRef}
        className="manifesto-container"
        style={{
          maxWidth: '80vw',
          margin: '0 auto',
          padding: '160px 0 180px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {manifestoConfig.sectionLabel && (
          <div
            ref={labelRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '72px',
            }}
          >
            <span
              data-anim
              aria-hidden
              style={{
                display: 'inline-block',
                width: '60px',
                height: '1px',
                background: 'linear-gradient(to right, transparent, #938977)',
              }}
            />
            <p
              data-anim
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                color: '#938977',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              {manifestoConfig.sectionLabel}
            </p>
            <span
              data-anim
              aria-hidden
              style={{
                display: 'inline-block',
                width: '60px',
                height: '1px',
                background: 'linear-gradient(to left, transparent, #938977)',
              }}
            />
          </div>
        )}

        {manifestoConfig.text && (
          <p
            ref={textRef}
            className="manifesto-text"
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(1.6rem, 4vw, 3.1rem)',
              fontWeight: 400,
              lineHeight: 1.22,
              color: '#fcfaee',
              textAlign: 'center',
              textWrap: 'balance',
              maxWidth: '1100px',
              margin: '0 auto',
            }}
          >
            {manifestoConfig.text}
          </p>
        )}

        {/* Ornamental closing flourish */}
        <div
          ref={ornamentRef}
          aria-hidden
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '72px',
            transformOrigin: 'center',
          }}
        >
          <span style={{ display: 'inline-block', width: '80px', height: '1px', background: 'linear-gradient(to right, transparent, #938977)' }} />
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              border: '1px solid #938977',
            }}
          />
          <span style={{ display: 'inline-block', width: '80px', height: '1px', background: 'linear-gradient(to left, transparent, #938977)' }} />
        </div>
      </div>
    </section>
  );
}
