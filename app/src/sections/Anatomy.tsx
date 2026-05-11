import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChairShowcase from '../effects/ChairShowcase';
import { anatomyConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Anatomy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pillarRefs = useRef<(HTMLElement | null)[]>([]);
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

      pillarRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el.querySelectorAll('[data-anim]'),
          { opacity: 0, y: 40, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.0,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: el,
              start: 'top 78%',
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
        // No overflow constraints — they would break the sticky chair below.
      }}
    >
      {/* Top seam blending from manifesto */}
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
          zIndex: 1,
        }}
      />

      {/* Section Header */}
      <div
        ref={headerRef}
        style={{
          textAlign: 'center',
          padding: '140px 24px 60px',
          position: 'relative',
          zIndex: 2,
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
            <span aria-hidden style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #938977)' }} />
            <p
              style={{
                margin: 0,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                color: '#938977',
                letterSpacing: '3px',
                textTransform: 'uppercase',
              }}
            >
              {anatomyConfig.sectionLabel}
            </p>
            <span aria-hidden style={{ width: '40px', height: '1px', background: 'linear-gradient(to left, transparent, #938977)' }} />
          </div>
        )}
        {anatomyConfig.title && (
          <h2
            data-anim
            style={{
              margin: 0,
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(32px, 4.2vw, 52px)',
              fontWeight: 500,
              lineHeight: 1.18,
              color: '#180c04',
              maxWidth: '780px',
              marginInline: 'auto',
              textWrap: 'balance',
            }}
          >
            {anatomyConfig.title}
          </h2>
        )}
      </div>

      {/* Split layout: sticky chair (left) + stacked pillars (right) */}
      <div
        className="anatomy-split"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '60px clamp(24px, 5vw, 64px) 120px',
          gap: 'clamp(24px, 4vw, 72px)',
          alignItems: 'start',
        }}
      >
        {/* Sticky chair column */}
        <div
          className="anatomy-chair-col"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            alignSelf: 'start',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '88vh',
              minHeight: '500px',
              position: 'relative',
            }}
          >
            <ChairShowcase />
          </div>
        </div>

        {/* Stacked pillars column */}
        <div className="anatomy-pillars-col">
          {pillars.map((pillar, i) => (
            <article
              key={pillar.label}
              ref={(el) => { pillarRefs.current[i] = el; }}
              style={{
                padding: i === 0 ? '8vh 0 16vh' : '16vh 0',
                borderTop: i === 0 ? 'none' : '1px solid rgba(147, 137, 119, 0.22)',
              }}
            >
              <div
                data-anim
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '18px',
                  marginBottom: '28px',
                }}
              >
                <span
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 'clamp(54px, 6vw, 88px)',
                    fontWeight: 300,
                    color: '#938977',
                    lineHeight: 0.9,
                    letterSpacing: '-2px',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  aria-hidden
                  style={{
                    flex: '0 0 56px',
                    height: '1px',
                    backgroundColor: '#938977',
                    marginBottom: '20px',
                    opacity: 0.6,
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#938977',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                  }}
                >
                  {pillar.label}
                </p>
              </div>
              <h3
                data-anim
                style={{
                  margin: '0 0 24px',
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: 'clamp(26px, 2.6vw, 36px)',
                  fontWeight: 500,
                  lineHeight: 1.22,
                  color: '#180c04',
                  textWrap: 'balance',
                }}
              >
                {pillar.title}
              </h3>
              <p
                data-anim
                style={{
                  margin: 0,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '15px',
                  fontWeight: 400,
                  lineHeight: 1.78,
                  color: 'rgba(24, 12, 4, 0.72)',
                  maxWidth: '480px',
                }}
              >
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
