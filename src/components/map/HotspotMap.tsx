import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { HotspotLocation } from '../../types';

interface HotspotMapProps {
  hotspots: HotspotLocation[];
  selectedHotspotId?: string;
  onSelectHotspot: (hotspotId: string) => void;
  height?: string;
  filterClassification?: string;
  filterSeverity?: string;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({
  hotspots,
  selectedHotspotId,
  onSelectHotspot,
  height = '520px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker | L.CircleMarker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not yet created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.955, 77.605], // Bengaluru center
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // Subtle, high-contrast CartoDB Positron / OpenStreetMap muted tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Reposition zoom controls to bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Add custom styled circular marker pins
    hotspots.forEach((spot) => {
      const isSelected = spot.id === selectedHotspotId;
      const isRepeated = spot.classification === 'repeated';
      const isEmerging = spot.classification === 'emerging';
      const isDrainCritical = spot.drainRisk === 'critical_flood_hazard';

      // Colors based on design system
      let primaryColor = '#137C62'; // Green
      let ringColor = '#E4F4EC';
      let badgeLabel = 'One-Time';

      if (isRepeated || isDrainCritical) {
        primaryColor = '#E11D48'; // Rose
        ringColor = '#FFE4E6';
        badgeLabel = isDrainCritical ? 'Drain Choke' : 'Chronic';
      } else if (isEmerging) {
        primaryColor = '#D97706'; // Amber
        ringColor = '#FEF3C7';
        badgeLabel = 'Emerging';
      }

      const size = isSelected ? 38 : isRepeated ? 32 : 26;

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-hotspot-pin',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        html: `
          <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${
              isRepeated || isDrainCritical
                ? `<div style="position: absolute; inset: -6px; border-radius: 9999px; background: ${primaryColor}; opacity: 0.25;" class="animate-radar"></div>`
                : ''
            }
            <div style="
              width: ${size}px; 
              height: ${size}px; 
              border-radius: 9999px; 
              background: ${primaryColor}; 
              border: ${isSelected ? '3px solid #123D32' : '2px solid #FFFFFF'}; 
              box-shadow: 0 4px 12px rgba(18, 61, 50, 0.22);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #FFFFFF;
              font-size: ${size > 30 ? '11px' : '9px'};
              font-weight: 700;
              transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            ">
              ${spot.recurrenceScore}
            </div>
          </div>
        `
      });

      const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], { icon: customIcon }).addTo(map);

      // Create rich, Figma-level popup
      const popupContent = document.createElement('div');
      popupContent.style.width = '240px';
      popupContent.style.padding = '14px';
      popupContent.style.fontFamily = "'Plus Jakarta Sans', system-ui, sans-serif";

      popupContent.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span style="
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 2px 7px;
            border-radius: 9999px;
            background: ${ringColor};
            color: ${primaryColor};
          ">
            ${badgeLabel} • Score ${spot.recurrenceScore}/100
          </span>
          <span style="font-size: 10px; color: #74847C; font-weight: 500;">${spot.totalIncidents} events</span>
        </div>
        
        <h4 style="font-size: 12px; font-weight: 700; color: #172B25; margin: 0 0 3px 0; line-height: 1.3;">
          ${spot.name}
        </h4>
        <div style="font-size: 11px; color: #74847C; margin-bottom: 10px;">
          ${spot.wardNumber}
        </div>

        ${
          spot.drainRisk !== 'none'
            ? `<div style="display: flex; align-items: center; gap: 5px; font-size: 10px; color: #0284C7; background: #F0F9FF; padding: 4px 8px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #BAE6FD;">
                <span>💧</span> <b>Culvert Risk:</b> ${spot.drainRisk.replace(/_/g, ' ')}
               </div>`
            : ''
        }

        <button id="btn-pop-investigate-${spot.id}" style="
          width: 100%;
          background: #137C62;
          color: #FFFFFF;
          font-weight: 600;
          font-size: 11px;
          padding: 7px 10px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: background 0.15s ease;
        ">
          <span>Open Investigation</span> →
        </button>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-pop-investigate-${spot.id}`);
        if (btn) {
          btn.onclick = () => onSelectHotspot(spot.id);
        }
      });

      marker.on('click', () => {
        onSelectHotspot(spot.id);
      });

      markersRef.current[spot.id] = marker;
    });

    // Zoom/Pan if selectedHotspotId changes
    if (selectedHotspotId && markersRef.current[selectedHotspotId]) {
      const selected = hotspots.find((h) => h.id === selectedHotspotId);
      if (selected) {
        map.setView([selected.coordinates.lat, selected.coordinates.lng], 13.5, {
          animate: true
        });
        markersRef.current[selectedHotspotId].openPopup();
      }
    }
  }, [hotspots, selectedHotspotId, onSelectHotspot]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E4EAE5] bg-[#FFFFFF] shadow-sm">
      {/* Map Floating Legend */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-[#E4EAE5] shadow-sm text-xs flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#74847C]">Hotspot Recurrence:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]"></span>
          <span className="text-[11px] font-medium text-[#172B25]">Chronic (&gt;75)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
          <span className="text-[11px] font-medium text-[#172B25]">Emerging (40-74)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#137C62]"></span>
          <span className="text-[11px] font-medium text-[#172B25]">One-Time (&lt;40)</span>
        </div>
      </div>

      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
    </div>
  );
};
