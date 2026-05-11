import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChairShowcase from '../effects/ChairShowcase';
import { anatomyConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Anatomy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pillarRefs = useRef<(HTMLElement | null)[]>([]);
  const chapterNumRef = useRef<HTMLSpanElement>(null);
  const chapterFillRef = useRef<HTMLDivElement>(null);
  const chairStageRef = useRef<HTMLDivElement>(null);
  const pillars = anatomyConfig.pillars;
  const segmentCount = Math.max(1, pillars.length);

  useEffect(() => {
    const scrolly = scrollyRef.current;
    if (!scrolly || pillars.length === 0) return;
    const segments = pillars.length;

    const ctx = gsap.context(() => {
      // Header reveal
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

      // Scroll-driven pillar cross-fade & chapter indicator
      ScrollTrigger.create({
        trigger: scrolly,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const progress = self.progress; // 0..1 across the scrollytelling region
          const exact = progress * segments; // 0..segments

          // Update chapter indicator
          const activeIdx = Math.min(segments - 1, Math.max(0, Math.floor(exact)));
          if (chapterNumRef.current) {
            chapterNumRef.current.textContent = String(activeIdx + 1).padStart(2, '0');
          }
          if (chapterFillRef.current) {
            chapterFillRef.current.style.transform = `scaleY(${progress})`;
          }

          // Cross-fade each pillar based on distance from its segment center
          pillarRefs.current.forEach((el, i) => {
            if (!el) return;
            const distFromCenter = Math.abs(exact - (i + 0.5));
            const raw = Math.max(0, 1 - distFromCenter / 0.55);
            const eased = raw * raw * (3 - 2 * raw);
            const yOff = (exact - (i + 0.5)) * -32;
            const blur = (1 - raw) * 7;
            el.style.opacity = String(eased);
            el.style.transform = `translateY(${yOff}px)`;
            el.style.filter = `blur(${blur}px)`;
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [pillars.length]);

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
      {/* Top seam blending from manifesto's dark */}
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
            <span aria-hidden style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #938977)' }} />
            <p style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', fontWeight: 600, color: '#938977', letterSpacing: '3px', textTransform: 'uppercase' }}>
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

      {/* Scrollytelling region — one viewport per pillar */}
      <div
        ref={scrollyRef}
        className="anatomy-scrolly"
        style={{
          position: 'relative',
          height: `${segmentCount * 110}vh`,
        }}
      >
        {/* Sticky stage */}
        <div
          className="anatomy-stage"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(24px, 5vw, 80px)',
            gap: 'clamp(24px, 4vw, 64px)',
          }}
        >
          {/* Chair scene — left side */}
          <div
            ref={chairStageRef}
            className="anatomy-chair-stage"
            style={{
              flex: '1 1 58%',
              maxWidth: '780px',
              height: '92vh',
              minHeight: '500px',
              position: 'relative',
            }}
          >
            <ChairShowcase />
          </div>

          {/* Text overlay — right side, cross-fading pillars */}
          <div
            className="anatomy-text-stage"
            style={{
              flex: '0 1 38%',
              height: '92vh',
              minHeight: '500px',
              position: 'relative',
              maxWidth: '460px',
            }}
          >
            {pillars.map((pillar, i) => (
              <article
                key={pillar.label}
                ref={(el) => { pillarRefs.current[i] = el; }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  opacity: 0,
                  willChange: 'opacity, transform, filter',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '32px' }}>
                  <span
                    style={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontStyle: 'italic',
                      fontSize: 'clamp(56px, 6vw, 80px)',
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
                  style={{
                    margin: '0 0 26px',
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: 'clamp(28px, 3vw, 44px)',
                    fontWeight: 500,
                    lineHeight: 1.15,
                    color: '#180c04',
                    textWrap: 'balance',
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: 1.78,
                    color: 'rgba(24, 12, 4, 0.72)',
                    maxWidth: '440px',
                  }}
                >
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>

          {/* Chapter indicator — vertical, right edge */}
          <div
            aria-hidden
            className="anatomy-chapter"
            style={{
              position: 'absolute',
              top: '50%',
              right: 'clamp(16px, 2.4vw, 32px)',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '18px',
              pointerEvents: 'none',
            }}
          >
            <span
              ref={chapterNumRef}
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontSize: '15px',
                fontWeight: 400,
                color: '#938977',
                minWidth: '20px',
                textAlign: 'center',
              }}
            >
              01
            </span>
            <div
              style={{
                width: '1px',
                height: '170px',
                background: 'rgba(147, 137, 119, 0.25)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                ref={chapterFillRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: '#938977',
                  transformOrigin: 'top',
                  transform: 'scaleY(0)',
                  willChange: 'transform',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontSize: '13px',
                fontWeight: 400,
                color: 'rgba(147, 137, 119, 0.55)',
                minWidth: '20px',
                textAlign: 'center',
              }}
            >
              {String(segmentCount).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
