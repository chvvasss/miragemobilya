import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { tiersConfig } from '../config';
import type { TierConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

interface TierRowProps {
  tier: TierConfig;
  index: number;
  total: number;
}

function TierRow({ tier, index, total }: TierRowProps) {
  const reverse = index % 2 === 1;
  const rowRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cornersRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const editionRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const ctx = gsap.context(() => {
      // Image frame: clip-path reveal — opens from a thin vertical slit
      if (imageWrapRef.current) {
        gsap.fromTo(
          imageWrapRef.current,
          { clipPath: 'inset(8% 42% 8% 42%)', opacity: 0.0 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Image: ken-burns slow zoom-out, scroll-scrubbed
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.22, transformOrigin: reverse ? '70% 50%' : '30% 50%' },
          {
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
            },
          }
        );
      }

      // Gold L-corner frame: draw in
      if (cornersRef.current) {
        gsap.fromTo(
          cornersRef.current.querySelectorAll('[data-corner]'),
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.0,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 72%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Edition Roman numeral: dramatic blur fade
      if (editionRef.current) {
        gsap.fromTo(
          editionRef.current,
          { opacity: 0, y: 30, filter: 'blur(14px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 68%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Caption under image
      if (captionRef.current) {
        gsap.fromTo(
          captionRef.current,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'power2.out',
            delay: 0.4,
            scrollTrigger: {
              trigger: row,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Text content stagger
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.querySelectorAll('[data-anim]'),
          { opacity: 0, y: 28, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.0,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: row,
              start: 'top 65%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, row);

    return () => ctx.revert();
  }, [reverse]);

  return (
    <article
      ref={rowRef}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
        gridTemplateAreas: reverse ? '"text image"' : '"image text"',
        gap: 'clamp(40px, 6vw, 96px)',
        alignItems: 'center',
        padding: 'clamp(60px, 9vh, 120px) 0',
        borderBottom:
          index < total - 1 ? '1px solid rgba(147, 137, 119, 0.22)' : 'none',
      }}
      className="tier-row"
    >
      {/* IMAGE COLUMN */}
      <div
        style={{
          gridArea: 'image',
          position: 'relative',
          width: '100%',
        }}
      >
        {/* Frame + image */}
        <div
          ref={imageWrapRef}
          className="tier-image-frame"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 5',
            overflow: 'hidden',
            backgroundColor: '#1a1207',
            willChange: 'clip-path, opacity',
          }}
        >
          {tier.image && (
            <img
              ref={imageRef}
              src={tier.image}
              alt={tier.name}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                willChange: 'transform',
              }}
            />
          )}

          {/* Vignette inside image */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 80% 70% at 50% 45%, transparent 0%, rgba(0,0,0,0.35) 100%)',
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
            }}
          />

          {/* Edition badge inside image */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '20px',
              left: '24px',
              right: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '10px',
                fontWeight: 600,
                color: 'rgba(252, 250, 238, 0.75)',
                letterSpacing: '3px',
                textTransform: 'uppercase',
              }}
            >
              Mirage · Édition {ROMAN[index] ?? index + 1}
            </span>
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '10px',
                fontWeight: 600,
                color: 'rgba(252, 250, 238, 0.55)',
                letterSpacing: '2px',
              }}
            >
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Gold L-corner frame overlay */}
        <div
          ref={cornersRef}
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-14px',
            pointerEvents: 'none',
          }}
        >
          {[
            { top: 0, left: 0, borderTop: '1px solid #938977', borderLeft: '1px solid #938977' },
            { top: 0, right: 0, borderTop: '1px solid #938977', borderRight: '1px solid #938977' },
            { bottom: 0, left: 0, borderBottom: '1px solid #938977', borderLeft: '1px solid #938977' },
            { bottom: 0, right: 0, borderBottom: '1px solid #938977', borderRight: '1px solid #938977' },
          ].map((s, i) => (
            <span
              key={i}
              data-corner
              style={{
                position: 'absolute',
                width: '28px',
                height: '28px',
                ...s,
              }}
            />
          ))}
        </div>

        {/* Caption */}
        <p
          ref={captionRef}
          style={{
            margin: '28px 0 0',
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'rgba(24, 12, 4, 0.65)',
            letterSpacing: '0.3px',
            textAlign: reverse ? 'right' : 'left',
          }}
        >
          — Édition {ROMAN[index] ?? index + 1} · {tier.name}
        </p>
      </div>

      {/* TEXT COLUMN */}
      <div
        ref={textRef}
        style={{
          gridArea: 'text',
          position: 'relative',
          maxWidth: '500px',
        }}
      >
        {/* Massive italic edition numeral */}
        <span
          ref={editionRef}
          aria-hidden
          style={{
            position: 'absolute',
            top: '-28px',
            left: reverse ? 'auto' : '-12px',
            right: reverse ? '-12px' : 'auto',
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(80px, 11vw, 150px)',
            fontWeight: 300,
            color: 'rgba(147, 137, 119, 0.18)',
            lineHeight: 0.85,
            letterSpacing: '-4px',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {ROMAN[index] ?? index + 1}
        </span>

        <div data-anim style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
          <span aria-hidden style={{ width: '44px', height: '1px', backgroundColor: '#938977' }} />
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
            {tier.journeys}
          </p>
        </div>

        <h3
          data-anim
          style={{
            margin: '0 0 14px',
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 'clamp(30px, 3.2vw, 46px)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: '#180c04',
            textWrap: 'balance',
          }}
        >
          {tier.name}
        </h3>

        <p
          data-anim
          style={{
            margin: '0 0 32px',
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '20px',
            fontWeight: 400,
            color: '#938977',
            lineHeight: 1.2,
          }}
        >
          <span style={{ fontStyle: 'italic' }}>{tier.price}</span>
          {tier.frequency && (
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                color: 'rgba(24, 12, 4, 0.5)',
                marginLeft: '12px',
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
              }}
            >
              · {tier.frequency}
            </span>
          )}
        </p>

        <p
          data-anim
          style={{
            margin: '0 0 32px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '15px',
            fontWeight: 400,
            lineHeight: 1.75,
            color: 'rgba(24, 12, 4, 0.72)',
            maxWidth: '460px',
          }}
        >
          {tier.description}
        </p>

        <ul data-anim style={{ listStyle: 'none', padding: 0, margin: '0 0 40px' }}>
          {tier.amenities.map((amenity) => (
            <li
              key={amenity}
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                lineHeight: 1.5,
                color: 'rgba(24, 12, 4, 0.78)',
                padding: '14px 0',
                borderBottom: '1px solid rgba(24, 12, 4, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: '28px',
                  height: '1px',
                  backgroundColor: '#938977',
                  flexShrink: 0,
                }}
              />
              {amenity}
            </li>
          ))}
        </ul>

        {tier.ctaText && (
          <a
            data-anim
            href={tier.ctaHref || '#'}
            onClick={(e) => {
              if (!tier.ctaHref || tier.ctaHref === '#') e.preventDefault();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              color: '#180c04',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '16px 36px',
              border: '1px solid rgba(24, 12, 4, 0.3)',
              borderRadius: '2px',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = '#180c04';
              el.style.color = '#fcfaee';
              el.style.borderColor = '#180c04';
              el.style.letterSpacing = '4px';
              const arrow = el.querySelector<HTMLSpanElement>('.cta-arrow');
              if (arrow) arrow.style.transform = 'translateX(6px)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = 'transparent';
              el.style.color = '#180c04';
              el.style.borderColor = 'rgba(24, 12, 4, 0.3)';
              el.style.letterSpacing = '3px';
              const arrow = el.querySelector<HTMLSpanElement>('.cta-arrow');
              if (arrow) arrow.style.transform = 'translateX(0)';
            }}
          >
            <span>{tier.ctaText}</span>
            <span
              className="cta-arrow"
              aria-hidden
              style={{
                display: 'inline-block',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              →
            </span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function Tiers() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tiers = tiersConfig.tiers;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.querySelectorAll('[data-anim]'),
          { opacity: 0, y: 26, filter: 'blur(8px)' },
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!tiersConfig.sectionLabel && !tiersConfig.title && tiers.length === 0) {
    return null;
  }

  return (
    <section
      id="tiers"
      ref={sectionRef}
      style={{
        backgroundColor: '#fcfaee',
        position: 'relative',
        zIndex: 2,
        padding: '140px 0 140px',
        overflow: 'hidden',
      }}
    >
      {/* Section Header */}
      <div
        ref={headerRef}
        style={{
          textAlign: 'center',
          padding: '0 24px 120px',
        }}
      >
        {tiersConfig.sectionLabel && (
          <div
            data-anim
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '26px',
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
                letterSpacing: '4px',
                textTransform: 'uppercase',
              }}
            >
              {tiersConfig.sectionLabel}
            </p>
            <span aria-hidden style={{ width: '40px', height: '1px', background: 'linear-gradient(to left, transparent, #938977)' }} />
          </div>
        )}
        {tiersConfig.title && (
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
            {tiersConfig.title}
          </h2>
        )}
      </div>

      {/* Tier rows */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 clamp(24px, 5vw, 64px)',
        }}
      >
        {tiers.map((tier, i) => (
          <TierRow key={tier.name} tier={tier} index={i} total={tiers.length} />
        ))}
      </div>
    </section>
  );
}
