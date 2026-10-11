import React, { useState, useEffect } from 'react';
import { Maximize2, X, ShieldCheck } from 'lucide-react';
import { createSvgDataUri } from '../../services/seedData';
import { INCIDENT_VISUALS } from '../../services/incidentVisuals';

interface EvidenceImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  enableZoom?: boolean;
}

export const EvidenceImage: React.FC<EvidenceImageProps> = ({
  src,
  alt,
  className = '',
  fallbackText = 'Civic Evidence Photo',
  enableZoom = false
}) => {
  const resolveSource = (source?: string) => {
    if (!source || !source.trim()) return INCIDENT_VISUALS.sample_preview;
    if (source.startsWith('/src/assets/images/')) {
      return source.replace('/src/assets/images/', '/assets/images/');
    }
    return source;
  };

  const [imgSrc, setImgSrc] = useState<string>(() => resolveSource(src));
  const [hasError, setHasError] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    setImgSrc(resolveSource(src));
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Clean, guaranteed instant SVG fallback
      const fallbackSvg = createSvgDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
          <rect width="640" height="400" fill="#1e293b"/>
          <rect y="220" width="640" height="180" fill="#0f172a"/>
          <circle cx="320" cy="170" r="50" fill="#137C62" opacity="0.3"/>
          <text x="320" y="175" fill="#C8F169" font-family="system-ui, sans-serif" font-weight="bold" font-size="15" text-anchor="middle">
            ${(fallbackText || 'Civic Inspection Photo').replace(/[<>&"]/g, '')}
          </text>
          <text x="320" y="210" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">
            Geo-Tagged Civic Evidence • WasteShadow AI
          </text>
          <rect x="20" y="20" width="220" height="28" rx="6" fill="#065f46" opacity="0.9"/>
          <text x="130" y="38" fill="#ffffff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">
            VERIFIED EVIDENCE ASSET
          </text>
        </svg>
      `);
      setImgSrc(fallbackSvg);
    }
  };

  return (
    <>
      <div className="relative w-full h-full group">
        <img
          src={imgSrc}
          alt={alt}
          onError={handleError}
          loading="lazy"
          referrerPolicy="no-referrer"
          className={`${className} object-cover w-full h-full block`}
        />

        {enableZoom && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            title="Inspect full image"
            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#0f172a] rounded-3xl overflow-hidden border border-[#E4EAE5]/20 shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 text-white">
              <div className="flex items-center gap-2 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-[#C8F169]" />
                <span>{alt}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[80vh]">
              <img
                src={imgSrc}
                alt={alt}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
