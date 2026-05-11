import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChairShowcase from '../effects/ChairShowcase';
import { anatomyConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Anatomy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pillarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pillars = anatomyConfig.pillars;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.querySelectorAll('[data-anim]'),
          { opacity: 0, y: 30, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.1,
            ease: 'power2.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      pillarRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el.querySelectorAll('[data-anim]'),
          { opacity: 0, y: 50, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power2.out',
            stagger: 0.08,
            delay: i * 0.05,
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              end: 'top 40%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!anatomyConfig.sectionLabel && !anatomyConfig.title && pillars.length === 0) {
    return null;
  }

  return (
    <section
      id="anatomy"
      ref={sectionRef}
      style={{
        backgroundColor: '#f0ecd7',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      {/* Faint top gradient seam blending from manifesto's dark */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '180px',
          background:
            'linear-gradient(to bottom, rgba(24, 12, 4, 0.10) 0%, rgba(24, 12, 4, 0) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Section Header */}
      <div
        ref={headerRef}
        style={{
          textAlign: 'center',
          padding: '140px 24px 80px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {anatomyConfig.sectionLabel && (
          <div
            data-anim
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '24px',
            }}
          >
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                width: '40px',
                height: '1px',
                background: 'linear-gradient(to right, transparent, #938977)',
              }}
            />
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                color: '#938977',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              {anatomyConfig.sectionLabel}
            </p>
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                width: '40px',
                height: '1px',
                background: 'linear-gradient(to left, transparent, #938977)',
              }}
            />
          </div>
        )}
        {anatomyConfig.title && (
          <h2
            data-anim
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(32px, 4.2vw, 52px)',
              fontWeight: 500,
              lineHeight: 1.18,
              color: '#180c04',
              maxWidth: '760px',
              margin: '0 auto',
              textWrap: 'balance',
            }}
          >
            {anatomyConfig.title}
          </h2>
        )}
      </div>

      {/* Split Layout */}
      <div
        style={{
          display: 'flex',
          maxWidth: '1400px',
          margin: '0 auto',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {/* Left: Sticky ChairShowcase */}
        <div
          style={{
            width: '50%',
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="hidden md:flex"
        >
          <div style={{ width: '100%', height: '85vh', position: 'relative' }}>
            <ChairShowcase />
          </div>
        </div>

        {/* Right: Scrolling Content */}
        <div
          style={{
            width: '50%',
            padding: '0 56px',
          }}
          className="w-full md:w-1/2"
        >
          {pillars.map((pillar, i) => (
            <div
              key={pillar.label}
              ref={(el) => { pillarRefs.current[i] = el; }}
              style={{
                padding: '18vh 0',
                borderBottom:
                  i < pillars.length - 1 ? '1px solid rgba(147, 137, 119, 0.25)' : 'none',
                position: 'relative',
              }}
            >
              {/* Editorial pillar number */}
              <div
                data-anim
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '16px',
                  marginBottom: '28px',
                }}
              >
                <span
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: '52px',
                    fontWeight: 300,
                    color: '#938977',
                    lineHeight: 1,
                    letterSpacing: '-1px',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  aria-hidden
                  style={{
                    display: 'inline-block',
                    flex: '0 0 56px',
                    height: '1px',
                    backgroundColor: '#938977',
                    marginBottom: '14px',
                    opacity: 0.6,
                  }}
                />
                <p
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#938977',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  {pillar.label}
                </p>
              </div>
              <h3
                data-anim
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: 'clamp(26px, 2.4vw, 34px)',
                  fontWeight: 500,
                  lineHeight: 1.22,
                  color: '#180c04',
                  marginBottom: '24px',
                  textWrap: 'balance',
                }}
              >
                {pillar.title}
              </h3>
              <p
                data-anim
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '15px',
                  fontWeight: 400,
                  lineHeight: 1.75,
                  color: 'rgba(24, 12, 4, 0.7)',
                  maxWidth: '480px',
                }}
              >
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
