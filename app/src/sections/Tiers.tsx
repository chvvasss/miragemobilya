import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { tiersConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Tiers() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tierRefs = useRef<(HTMLDivElement | null)[]>([]);
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

      tierRefs.current.forEach((el) => {
        if (!el) return;
        const textEl = el.querySelector('.tier-text-content');
        if (textEl) {
          gsap.fromTo(
            textEl.querySelectorAll('[data-anim]'),
            { opacity: 0, y: 30, filter: 'blur(6px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.0,
              ease: 'power2.out',
              stagger: 0.07,
              scrollTrigger: {
                trigger: el,
                start: 'top 72%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });
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
        padding: '140px 0 120px',
        overflow: 'hidden',
      }}
    >
      {/* Section Header */}
      <div
        ref={headerRef}
        style={{
          textAlign: 'center',
          padding: '0 24px 100px',
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
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                color: '#938977',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                margin: 0,
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
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(32px, 4.2vw, 52px)',
              fontWeight: 500,
              lineHeight: 1.18,
              color: '#180c04',
              maxWidth: '780px',
              margin: '0 auto',
              textWrap: 'balance',
            }}
          >
            {tiersConfig.title}
          </h2>
        )}
      </div>

      {/* Tier Rows */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {tiers.map((tier, i) => (
          <div
            key={tier.name}
            ref={(el) => { tierRefs.current[i] = el; }}
            style={{
              display: 'flex',
              flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
              gap: '80px',
              padding: '60px 0',
              alignItems: 'center',
              flexWrap: 'wrap',
              borderBottom:
                i < tiers.length - 1 ? '1px solid rgba(147, 137, 119, 0.25)' : 'none',
            }}
          >
            {/* Image */}
            <div
              className="tier-image-placeholder"
              style={{
                width: '100%',
                maxWidth: '500px',
                flex: '1 1 380px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '4px',
                boxShadow: '0 18px 40px -22px rgba(24, 12, 4, 0.45)',
              }}
            >
              {tier.image && (
                <img
                  src={tier.image}
                  alt={tier.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                  }}
                />
              )}
            </div>

            {/* Text Content */}
            <div
              className="tier-text-content"
              style={{
                flex: '1 1 380px',
                minWidth: '280px',
              }}
            >
              {/* Edition row */}
              <div data-anim style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '20px' }}>
                <span
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: '36px',
                    fontWeight: 300,
                    color: '#938977',
                    lineHeight: 1,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span aria-hidden style={{ flex: '0 0 40px', height: '1px', backgroundColor: '#938977', marginBottom: '10px', opacity: 0.6 }} />
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
                  {tier.journeys}
                </p>
              </div>

              <h3
                data-anim
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: 'clamp(28px, 2.8vw, 38px)',
                  fontWeight: 500,
                  lineHeight: 1.18,
                  color: '#180c04',
                  marginBottom: '12px',
                  textWrap: 'balance',
                }}
              >
                {tier.name}
              </h3>

              <p
                data-anim
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: '24px',
                  fontWeight: 400,
                  color: '#938977',
                  marginBottom: '28px',
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
                      color: '#696969',
                      marginLeft: '10px',
                      letterSpacing: '2px',
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
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.75,
                  color: 'rgba(24, 12, 4, 0.7)',
                  marginBottom: '32px',
                  maxWidth: '460px',
                }}
              >
                {tier.description}
              </p>

              {/* Amenities */}
              <ul data-anim style={{ listStyle: 'none', padding: 0, margin: '0 0 36px 0' }}>
                {tier.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '13px',
                      fontWeight: 400,
                      lineHeight: 1.5,
                      color: 'rgba(24, 12, 4, 0.78)',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(24, 12, 4, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        display: 'inline-block',
                        width: '24px',
                        height: '1px',
                        backgroundColor: '#938977',
                        flexShrink: 0,
                      }}
                    />
                    {amenity}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {tier.ctaText && (
                <a
                  data-anim
                  href={tier.ctaHref || '#'}
                  onClick={(e) => {
                    if (!tier.ctaHref || tier.ctaHref === '#') e.preventDefault();
                  }}
                  style={{
                    display: 'inline-block',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#180c04',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    padding: '16px 40px',
                    border: '1px solid rgba(24, 12, 4, 0.3)',
                    borderRadius: '2px',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.backgroundColor = '#180c04';
                    el.style.color = '#fcfaee';
                    el.style.borderColor = '#180c04';
                    el.style.letterSpacing = '4px';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.backgroundColor = 'transparent';
                    el.style.color = '#180c04';
                    el.style.borderColor = 'rgba(24, 12, 4, 0.3)';
                    el.style.letterSpacing = '3px';
                  }}
                >
                  {tier.ctaText}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
