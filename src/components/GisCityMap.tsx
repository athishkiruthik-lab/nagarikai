import React, { useState, useEffect, useRef } from 'react';
import { Complaint, CivicCategory, CivicPriority, ComplaintStatus } from '../types/civic';
import { AppLanguage, getTranslation } from '../utils/i18n';
import { Filter, Layers, Navigation, ZoomIn, ZoomOut, CheckCircle2, AlertTriangle, Clock, Eye, Sparkles, MapPin, RefreshCw } from 'lucide-react';

interface GisCityMapProps {
  complaints: Complaint[];
  selectedComplaint: Complaint | null;
  onSelectComplaint: (complaint: Complaint) => void;
  categoryFilter: CivicCategory | 'all';
  priorityFilter: CivicPriority | 'all';
  statusFilter: ComplaintStatus | 'all';
  onCategoryFilterChange: (cat: CivicCategory | 'all') => void;
  onPriorityFilterChange: (prio: CivicPriority | 'all') => void;
  onStatusFilterChange: (stat: ComplaintStatus | 'all') => void;
  language: AppLanguage;
}

export const GisCityMap: React.FC<GisCityMapProps> = ({
  complaints,
  selectedComplaint,
  onSelectComplaint,
  categoryFilter,
  priorityFilter,
  statusFilter,
  onCategoryFilterChange,
  onPriorityFilterChange,
  onStatusFilterChange,
  language
}) => {
  const t = getTranslation(language);
  const isTa = language === 'ta';

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const markersGroupRef = useRef<any>(null);
  const predictiveLayerGroupRef = useRef<any>(null);

  const [showPredictiveHotspots, setShowPredictiveHotspots] = useState(true);
  const [activeLayer, setActiveLayer] = useState<'carto' | 'osm'>('carto');

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  // Load Leaflet library dynamically if not on window
  useEffect(() => {
    let isMounted = true;
    async function loadLeaflet() {
      try {
        if ((window as any).L) {
          if (isMounted) setLeafletLoaded(true);
          return;
        }
        const L = (await import('leaflet')).default;
        (window as any).L = L;
        if (isMounted) setLeafletLoaded(true);
      } catch (err) {
        console.warn('Leaflet direct import fallback:', err);
        if ((window as any).L && isMounted) {
          setLeafletLoaded(true);
        }
      }
    }
    loadLeaflet();
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    // Prevent re-initialization error
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
      return;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [13.045, 80.235], // Chennai central coordinates
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // Tile Layer
      const tileUrl =
        activeLayer === 'carto'
          ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileUrl, {
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Layer groups
      markersGroupRef.current = L.layerGroup().addTo(map);
      predictiveLayerGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;

      // Invalidate size on container layout changes
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      if (mapContainerRef.current) {
        resizeObserver.observe(mapContainerRef.current);
      }

      // Initial size recalculation
      setTimeout(() => {
        map.invalidateSize();
      }, 250);

      return () => {
        resizeObserver.disconnect();
        map.remove();
        mapInstanceRef.current = null;
      };
    } catch (err) {
      console.error('Error initializing Leaflet map:', err);
    }
  }, [leafletLoaded, activeLayer]);

  // Render AI Predictive Hotspots Layer (Monsoon flooding, aging transformers, drainage choke)
  useEffect(() => {
    if (!mapInstanceRef.current || !predictiveLayerGroupRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    predictiveLayerGroupRef.current.clearLayers();

    if (showPredictiveHotspots) {
      // 1. Velachery Low-lying Inundation Zone
      L.circle([12.9815, 80.2180], {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.18,
        radius: 1100,
        weight: 1.5,
        dashArray: '4, 4'
      })
        .bindTooltip(
          isTa
            ? '⚡ AI கணிப்பு: வேளச்சேரி ஏரி வடிகால் வழித்தடம் (மழைக்கால வெள்ள அபாயம்)'
            : '⚡ AI Hotspot: Velachery Catchment Basin (Monsoon Inundation Vulnerability)',
          { permanent: false, direction: 'top' }
        )
        .addTo(predictiveLayerGroupRef.current);

      // 2. T. Nagar Commercial Density Corridor
      L.circle([13.0418, 80.2337], {
        color: '#f59e0b',
        fillColor: '#f59e0b',
        fillOpacity: 0.16,
        radius: 950,
        weight: 1.5,
        dashArray: '4, 4'
      })
        .bindTooltip(
          isTa
            ? '⚡ AI கணிப்பு: தி.நகர் வர்த்தக மையம் (அதிதீவிர குப்பை மற்றும் போக்குவரத்து அழுத்தம்)'
            : '⚡ AI Hotspot: T. Nagar Core (Heavy Waste Volume & High Footfall Stress)',
          { permanent: false, direction: 'top' }
        )
        .addTo(predictiveLayerGroupRef.current);

      // 3. Guindy Transit Node
      L.circle([13.0102, 80.2158], {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.15,
        radius: 800,
        weight: 1.5,
        dashArray: '4, 4'
      })
        .bindTooltip(
          isTa
            ? '⚡ AI கணிப்பு: கிண்டி தொழிற்பேட்டை & ரயில்வே சந்திப்பு (வடிகால் சீரமைப்பு முன்னுரிமை)'
            : '⚡ AI Hotspot: Guindy Industrial Gateway (Drainage Choke Point Risk)',
          { permanent: false, direction: 'top' }
        )
        .addTo(predictiveLayerGroupRef.current);
    }
  }, [showPredictiveHotspots, isTa]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    markersGroupRef.current.clearLayers();

    filteredComplaints.forEach(complaint => {
      const isSelected = selectedComplaint?.id === complaint.id;
      const isResolved = complaint.status === 'RESOLVED';
      const isCritical = complaint.priority === 'CRITICAL';

      const markerColor = isResolved
        ? '#10b981'
        : isCritical
        ? '#ef4444'
        : complaint.priority === 'HIGH'
        ? '#f59e0b'
        : '#3b82f6';

      const iconEmoji =
        complaint.category === 'roads'
          ? '🛣️'
          : complaint.category === 'sanitation'
          ? '🗑️'
          : complaint.category === 'electricity'
          ? '⚡'
          : complaint.category === 'water'
          ? '💧'
          : complaint.category === 'traffic'
          ? '🚦'
          : '⚠️';

      const markerHtml = `
        <div style="
          position: relative;
          width: ${isSelected ? '38px' : '30px'};
          height: ${isSelected ? '38px' : '30px'};
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${markerColor};
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 4px 16px rgba(0,0,0,0.45);
          cursor: pointer;
          transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
          transition: all 0.2s ease;
        ">
          <span style="font-size: ${isSelected ? '14px' : '12px'};">${iconEmoji}</span>
          ${
            isCritical && !isResolved
              ? `<div style="position: absolute; inset: -6px; border-radius: 50%; border: 2px solid #ef4444; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-civic-marker',
        html: markerHtml,
        iconSize: isSelected ? [38, 38] : [30, 30],
        iconAnchor: isSelected ? [19, 19] : [15, 15]
      });

      const marker = L.marker([complaint.location.lat, complaint.location.lng], { icon: customIcon })
        .addTo(markersGroupRef.current)
        .on('click', () => {
          onSelectComplaint(complaint);
          mapInstanceRef.current?.panTo([complaint.location.lat, complaint.location.lng]);
        });

      // Bind tooltip
      const tooltipTitle = isTa ? complaint.titleTamil : complaint.title;
      marker.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px; font-weight: 600; padding: 2px;">
          ${tooltipTitle}
          <div style="color: #10b981; font-weight: bold; font-size: 10px;">${complaint.targetPortal.code} • ${complaint.status}</div>
        </div>`,
        { direction: 'top', offset: [0, -10] }
      );
    });
  }, [filteredComplaints, selectedComplaint, isTa]);

  // Pan to selected complaint smoothly
  useEffect(() => {
    if (mapInstanceRef.current && selectedComplaint) {
      mapInstanceRef.current.flyTo([selectedComplaint.location.lat, selectedComplaint.location.lng], 14, {
        duration: 1.2
      });
    }
  }, [selectedComplaint]);

  const resetViewToChennai = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([13.045, 80.235], 12, { duration: 1 });
    }
  };

  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(currentZoom + delta);
    }
  };

  return (
    <div className="relative w-full h-[640px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Top Filter Floating Bar */}
      <div className="absolute top-4 left-4 z-[500] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-xl max-w-sm sm:max-w-md w-full space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              {t.gisActiveSpots}
            </h4>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {filteredComplaints.length} {isTa ? 'இடங்கள்' : 'Active'}
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'all', label: t.categoryAll },
            { id: 'roads', label: isTa ? '🛣️ சாலைகள்' : '🛣️ Roads' },
            { id: 'sanitation', label: isTa ? '🗑️ தூய்மை' : '🗑️ Sanitation' },
            { id: 'electricity', label: isTa ? '⚡ மின்சாரம்' : '⚡ Power' },
            { id: 'water', label: isTa ? '💧 குடிநீர்' : '💧 Water' },
            { id: 'safety', label: isTa ? '⚠️ வடிகால்' : '⚠️ Safety' },
            { id: 'traffic', label: isTa ? '🚦 சிக்னல்' : '🚦 Traffic' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategoryFilterChange(cat.id as any)}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                categoryFilter === cat.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Priority & Status dropdowns */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">{isTa ? 'முன்னுரிமை:' : 'Priority:'}</span>
            <select
              value={priorityFilter}
              onChange={e => onPriorityFilterChange(e.target.value as any)}
              className="bg-slate-800 text-slate-200 rounded-lg px-2 py-1 border border-slate-700 text-xs focus:outline-none"
            >
              <option value="all">{t.priorityAll}</option>
              <option value="CRITICAL">🔴 {t.prioCritical}</option>
              <option value="HIGH">🟠 {t.prioHigh}</option>
              <option value="MEDIUM">🟡 {t.prioMedium}</option>
              <option value="LOW">🔵 {t.prioLow}</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-400">{isTa ? 'நிலை:' : 'Status:'}</span>
            <select
              value={statusFilter}
              onChange={e => onStatusFilterChange(e.target.value as any)}
              className="bg-slate-800 text-slate-200 rounded-lg px-2 py-1 border border-slate-700 text-xs focus:outline-none"
            >
              <option value="all">{t.statusAll}</option>
              <option value="SUBMITTED">{t.statusSubmitted}</option>
              <option value="IN_PROGRESS">{t.statusInProgress}</option>
              <option value="RESOLVED">{t.statusResolved}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Control Buttons (Zoom, Reset, AI Hotspot toggle) */}
      <div className="absolute top-4 right-4 z-[500] flex flex-col gap-2">
        <button
          onClick={() => setShowPredictiveHotspots(!showPredictiveHotspots)}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xl transition-all border ${
            showPredictiveHotspots
              ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/20'
              : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
          title={isTa ? 'AI முன்னறிவிப்பு பகுதிகள்' : 'Toggle AI Predictive Hotspots Layer'}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.aiPredictionLayer}</span>
        </button>

        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-1 flex flex-col gap-1 shadow-lg">
          <button
            onClick={() => handleZoom(1)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-1)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetViewToChennai}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center transition-colors"
            title="Reset to Chennai Center"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-[10]" />

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[500] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2.5 shadow-xl text-[11px] text-slate-300 flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/30" />
          {t.legendCritical}
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          {t.legendHigh}
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          {t.legendResolved}
        </span>
      </div>

      {/* Floating Selected Complaint Preview Card */}
      {selectedComplaint && (
        <div className="absolute bottom-4 right-4 z-[500] bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-3xl p-4 shadow-2xl max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-3">
          <div className="flex items-start gap-3">
            <img
              src={selectedComplaint.imageUrl}
              alt={selectedComplaint.title}
              className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {selectedComplaint.targetPortal.code}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedComplaint.id}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate mt-1">
                {isTa ? selectedComplaint.titleTamil : selectedComplaint.title}
              </h4>
              <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                {selectedComplaint.location.address}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {isTa ? selectedComplaint.descriptionTamil : selectedComplaint.description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              SLA: {selectedComplaint.slaHours}h {t.hours}
            </span>
            <button
              onClick={() => onSelectComplaint(selectedComplaint)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1 text-xs transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              {t.viewFullDossier}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
