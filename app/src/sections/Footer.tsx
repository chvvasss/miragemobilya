import { Instagram, Facebook, Linkedin, Twitter, Youtube, type LucideIcon } from 'lucide-react';
import { footerConfig } from '../config';

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  pinterest: Linkedin, // lucide doesn't ship Pinterest by default; using Linkedin glyph as a refined stand-in
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
};

function pickSocialIcon(label: string) {
  const key = label.trim().toLowerCase();
  return SOCIAL_ICONS[key];
}

export default function Footer() {
  const hasFooterContent =
    footerConfig.ageGateText ||
    footerConfig.brandName ||
    footerConfig.brandTaglineLines.length > 0 ||
    footerConfig.columns.length > 0 ||
    footerConfig.copyright;

  if (!hasFooterContent) {
    return null;
  }

  return (
    <footer
      id="footer"
      style={{
        backgroundColor: '#f0ecd7',
        position: 'relative',
        zIndex: 2,
        borderTop: '1px solid rgba(24, 12, 4, 0.10)',
        overflow: 'hidden',
      }}
    >
      {/* Editorial introduction */}
      <div
        style={{
          textAlign: 'center',
          padding: '120px 24px 64px',
          position: 'relative',
        }}
      >
        {footerConfig.ageGateText && (
          <>
            <p
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(26px, 3vw, 42px)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#180c04',
                lineHeight: 1.3,
                maxWidth: '540px',
                margin: '0 auto',
                textWrap: 'balance',
              }}
            >
              {footerConfig.ageGateText}
            </p>

            {/* Ornament */}
            <div
              aria-hidden
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '48px',
              }}
            >
              <span style={{ width: '100px', height: '1px', background: 'linear-gradient(to right, transparent, #938977)' }} />
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  border: '1px solid #938977',
                }}
              />
              <span style={{ width: '100px', height: '1px', background: 'linear-gradient(to left, transparent, #938977)' }} />
            </div>
          </>
        )}
      </div>

      {/* Columns */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px 80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '56px',
        }}
      >
        {/* Brand Column */}
        <div>
          {footerConfig.brandName && (
            <p
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '24px',
                fontWeight: 500,
                color: '#180c04',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {footerConfig.brandName}
            </p>
          )}
          {footerConfig.brandTaglineLines.length > 0 && (
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: 1.8,
                color: 'rgba(24, 12, 4, 0.6)',
                letterSpacing: '0.3px',
              }}
            >
              {footerConfig.brandTaglineLines.map((line, index) => (
                <span key={`${line}-${index}`}>
                  {line}
                  {index < footerConfig.brandTaglineLines.length - 1 && <br />}
                </span>
              ))}
            </p>
          )}
        </div>

        {footerConfig.columns.map((column) => {
          const isSocial = column.heading.toLowerCase().includes('sosyal') ||
            column.heading.toLowerCase().includes('social');

          return (
            <div key={column.heading}>
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#938977',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  marginBottom: '22px',
                }}
              >
                {column.heading}
              </p>

              {isSocial ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {column.links.map((item) => {
                    const Icon = pickSocialIcon(item.label);
                    return (
                      <a
                        key={`${column.heading}-${item.label}`}
                        href={item.href}
                        onClick={(e) => {
                          if (!item.href || item.href === '#') e.preventDefault();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: '12px',
                          fontWeight: 400,
                          color: 'rgba(24, 12, 4, 0.65)',
                          textDecoration: 'none',
                          transition: 'color 0.4s ease, transform 0.4s ease',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color = '#180c04';
                          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(24, 12, 4, 0.65)';
                          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(0)';
                        }}
                      >
                        {Icon && <Icon size={14} strokeWidth={1.5} />}
                        <span>{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              ) : (
                column.links.map((item) => (
                  <a
                    key={`${column.heading}-${item.label}`}
                    href={item.href}
                    onClick={(e) => {
                      if (!item.href || item.href === '#') e.preventDefault();
                    }}
                    style={{
                      display: 'block',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '12px',
                      fontWeight: 400,
                      color: 'rgba(24, 12, 4, 0.65)',
                      textDecoration: 'none',
                      marginBottom: '12px',
                      letterSpacing: '0.3px',
                      transition: 'color 0.4s ease, transform 0.4s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#180c04';
                      (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(24, 12, 4, 0.65)';
                      (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(0)';
                    }}
                  >
                    {item.label}
                  </a>
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: '1px solid rgba(24, 12, 4, 0.10)',
          padding: '28px 24px',
          textAlign: 'center',
        }}
      >
        {footerConfig.copyright && (
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 400,
              color: 'rgba(24, 12, 4, 0.55)',
              letterSpacing: '0.6px',
            }}
          >
            {footerConfig.copyright}
          </p>
        )}
      </div>
    </footer>
  );
}
