import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

interface IncidentGeoPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  severity: 'high' | 'moderate' | 'unassessed' | 'low';
  tag: string;
  badgeClass: string;
}

interface RealisticGeoMapProps {
  selectedIncidentId: string;
  onSelectIncident: (id: string) => void;
  showSensors?: boolean;
  showRadar?: boolean;
  showTraffic?: boolean;
}

// Region coordinate presets
const REGION_PRESETS = {
  sector4: {
    name: 'Sector 4 • Boston Metropolitan',
    coords: [42.3601, -71.0589] as [number, number],
    zoom: 14,
    incidents: [
      {
        id: 'INC-2048',
        lat: 42.3605,
        lng: -71.0585,
        title: 'Lower Riverside & 4th Ave',
        severity: 'high',
        tag: 'INC-2048 HIGH',
        badgeClass: 'bg-error text-on-error border-error-container',
      },
      {
        id: 'INC-2051',
        lat: 42.3685,
        lng: -71.0665,
        title: 'Expressway Slowdown',
        severity: 'moderate',
        tag: 'INC-2051 Mod Traffic',
        badgeClass: 'bg-amber-600 text-white border-amber-300',
      },
      {
        id: 'INC-2054',
        lat: 42.3635,
        lng: -71.052,
        title: 'Sub-station 9 Telemetry',
        severity: 'unassessed',
        tag: 'INC-2054 Telemetry Dev',
        badgeClass: 'bg-secondary text-white border-secondary-fixed',
      },
      {
        id: 'INC-2057',
        lat: 42.353,
        lng: -71.062,
        title: 'Civic Plaza Drain Clogged',
        severity: 'low',
        tag: 'INC-2057 Civic Drain',
        badgeClass: 'bg-stone-700 text-white border-stone-400',
      },
    ] as IncidentGeoPoint[],
  },
  mumbaiPune: {
    name: 'Mumbai – Pune Corridor (Maharashtra)',
    coords: [18.7295, 74.232] as [number, number],
    zoom: 9,
    incidents: [
      {
        id: 'INC-2048',
        lat: 18.922,
        lng: 72.834,
        title: 'Mumbai South Inundation',
        severity: 'high',
        tag: 'INC-2048 HIGH (Mumbai)',
        badgeClass: 'bg-error text-on-error border-error-container',
      },
      {
        id: 'INC-2051',
        lat: 18.751,
        lng: 73.409,
        title: 'Mumbai-Pune Expressway Ghat Corridor',
        severity: 'moderate',
        tag: 'INC-2051 Expressway Jam',
        badgeClass: 'bg-amber-600 text-white border-amber-300',
      },
      {
        id: 'INC-2054',
        lat: 18.5204,
        lng: 73.8567,
        title: 'Pune Mula-Mutha Hydro-transducer',
        severity: 'unassessed',
        tag: 'INC-2054 Telemetry Dev',
        badgeClass: 'bg-secondary text-white border-secondary-fixed',
      },
      {
        id: 'INC-2057',
        lat: 19.033,
        lng: 73.0297,
        title: 'Navi Mumbai Storm Drain Sump',
        severity: 'low',
        tag: 'INC-2057 Civic Drain',
        badgeClass: 'bg-stone-700 text-white border-stone-400',
      },
    ] as IncidentGeoPoint[],
  },
};

type TileStyle = 'google-streets' | 'google-hybrid' | 'google-satellite' | 'google-terrain' | 'osm';

// 100% Free, authentic, watermark-free realistic map servers (Google Maps & OpenStreetMap)
const TILE_SERVERS: Record<TileStyle, { url: string; subdomains: string[]; attribution: string; maxZoom: number }> = {
  'google-streets': {
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    attribution: '&copy; Google Maps',
    maxZoom: 21,
  },
  'google-hybrid': {
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    attribution: '&copy; Google Maps Hybrid',
    maxZoom: 21,
  },
  'google-satellite': {
    url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    attribution: '&copy; Google Maps Satellite',
    maxZoom: 21,
  },
  'google-terrain': {
    url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    attribution: '&copy; Google Maps Terrain',
    maxZoom: 21,
  },
  'osm': {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
};

export const RealisticGeoMap: React.FC<RealisticGeoMapProps> = ({
  selectedIncidentId,
  onSelectIncident,
  showSensors = true,
  showRadar = true,
  showTraffic = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const overlaysLayerRef = useRef<L.LayerGroup | null>(null);

  const [currentRegion, setCurrentRegion] = useState<'sector4' | 'mumbaiPune'>('sector4');
  const [activeTileStyle, setActiveTileStyle] = useState<TileStyle>('google-streets');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(14);
  const [mapCenterStr, setMapCenterStr] = useState('42.3601° N, 71.0589° W');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const regionData = REGION_PRESETS[currentRegion];
      const map = L.map(mapContainerRef.current, {
        center: regionData.coords,
        zoom: regionData.zoom,
        zoomControl: false, // Custom clean controls
        attributionControl: false,
      });

      // Add default Google Maps Street layer
      const tileConfig = TILE_SERVERS[activeTileStyle];
      const tileLayer = L.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        maxZoom: tileConfig.maxZoom,
        subdomains: tileConfig.subdomains,
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Add layer groups
      const markersLayer = L.layerGroup().addTo(map);
      const overlaysLayer = L.layerGroup().addTo(map);

      markersLayerRef.current = markersLayer;
      overlaysLayerRef.current = overlaysLayer;
      mapInstanceRef.current = map;

      // Track pan/zoom
      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });
      map.on('moveend', () => {
        const c = map.getCenter();
        const latStr = `${Math.abs(c.lat).toFixed(4)}° ${c.lat >= 0 ? 'N' : 'S'}`;
        const lngStr = `${Math.abs(c.lng).toFixed(4)}° ${c.lng >= 0 ? 'E' : 'W'}`;
        setMapCenterStr(`${latStr}, ${lngStr}`);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Tile Style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileConfig = TILE_SERVERS[activeTileStyle];
    const newTileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
      subdomains: tileConfig.subdomains,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [activeTileStyle]);

  // Handle Region switch
  const handleSwitchRegion = (regionKey: 'sector4' | 'mumbaiPune') => {
    setCurrentRegion(regionKey);
    const regionData = REGION_PRESETS[regionKey];
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(regionData.coords, regionData.zoom, {
        animate: true,
        duration: 1.2,
      });
    }
  };

  // Render Markers and Overlays whenever region or selectedIncident changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !overlaysLayerRef.current) return;

    const markersGroup = markersLayerRef.current;
    const overlaysGroup = overlaysLayerRef.current;

    markersGroup.clearLayers();
    overlaysGroup.clearLayers();

    const regionData = REGION_PRESETS[currentRegion];

    // 1. Flood Inundation Polygon around INC-2048
    const inc2048 = regionData.incidents.find((i) => i.id === 'INC-2048');
    if (inc2048) {
      const floodCoords: [number, number][] =
        currentRegion === 'sector4'
          ? [
              [42.362, -71.061],
              [42.3615, -71.056],
              [42.3595, -71.057],
              [42.36, -71.062],
            ]
          : [
              [18.94, 72.82],
              [18.93, 72.85],
              [18.91, 72.84],
              [18.915, 72.815],
            ];

      const floodPolygon = L.polygon(floodCoords, {
        color: '#ba1a1a',
        weight: 2,
        fillColor: '#ba1a1a',
        fillOpacity: 0.22,
        dashArray: '5 5',
      });
      floodPolygon.bindTooltip('INC-2048 Flood Inundation Zone (+0.84m Hydrographic Surge)', {
        permanent: false,
        direction: 'top',
        className: 'font-label-mono-sm text-xs bg-surface-container-lowest shadow-md text-error px-2 py-1 rounded font-semibold',
      });
      overlaysGroup.addLayer(floodPolygon);

      // Radar buffer ring
      if (showRadar) {
        const radarCircle = L.circle([inc2048.lat, inc2048.lng], {
          radius: currentRegion === 'sector4' ? 700 : 25000,
          color: '#2a6194',
          weight: 1.5,
          fillColor: '#2a6194',
          fillOpacity: 0.1,
          dashArray: '3 6',
        });
        overlaysGroup.addLayer(radarCircle);
      }
    }

    // 2. Incident Callout Markers
    regionData.incidents.forEach((inc) => {
      const isSelected = selectedIncidentId === inc.id;
      const pulseHtml =
        inc.severity === 'high'
          ? `<span class="absolute -top-1 -right-1 flex h-3 w-3">
               <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
               <span class="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
             </span>`
          : '';

      const customIcon = L.divIcon({
        className: 'custom-incident-marker',
        iconSize: [160, 40],
        iconAnchor: [80, 20],
        html: `
          <div class="relative cursor-pointer select-none transition-all duration-150 ${
            isSelected
              ? 'scale-110 z-50 ring-2 ring-error ring-offset-2 shadow-2xl'
              : 'hover:scale-105'
          } flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg ${
            inc.severity === 'high'
              ? 'bg-[#191c19] text-white border-2 border-error'
              : inc.severity === 'moderate'
              ? 'bg-[#191c19] text-white border-2 border-amber-500'
              : 'bg-[#191c19] text-white border-2 border-slate-600'
          }">
            <span class="w-2.5 h-2.5 rounded-full shrink-0 ${
              inc.severity === 'high'
                ? 'bg-error'
                : inc.severity === 'moderate'
                ? 'bg-amber-500'
                : inc.severity === 'unassessed'
                ? 'bg-secondary'
                : 'bg-emerald-500'
            }"></span>
            <span class="font-label-mono-sm text-[11px] font-bold tracking-tight truncate">${inc.tag}</span>
            ${pulseHtml}
          </div>
        `,
      });

      const marker = L.marker([inc.lat, inc.lng], { icon: customIcon });
      marker.on('click', () => {
        onSelectIncident(inc.id);
      });
      markersGroup.addLayer(marker);
    });

    // 3. Sensor Nodes (if toggled)
    if (showSensors) {
      const sensorCoords: Array<{ name: string; type: string; coords: [number, number]; val: string }> =
        currentRegion === 'sector4'
          ? [
              { name: 'USGS Stream Gauge W-18', type: 'Hydro', coords: [42.3615, -71.054], val: '+0.84m' },
              { name: 'MassDOT CCTV TF-04', type: 'Camera', coords: [42.369, -71.063], val: '15 fps' },
              { name: 'NEXRAD Radar D-4', type: 'Atmospheric', coords: [42.355, -71.051], val: '38 mm/h' },
            ]
          : [
              { name: 'Hydro Station M-12', type: 'Hydro', coords: [18.88, 72.95], val: '+1.1m' },
              { name: 'Toll Plaza CCTV-01', type: 'Camera', coords: [18.78, 73.35], val: 'HD Stream' },
            ];

      sensorCoords.forEach((sensor) => {
        const sensorIcon = L.divIcon({
          className: 'custom-sensor-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          html: `
            <div class="w-7 h-7 rounded-full bg-surface-container-lowest border border-secondary shadow-md flex items-center justify-center text-secondary hover:scale-110 transition-transform cursor-pointer" title="${sensor.name}: ${sensor.val}">
              <span class="material-symbols-outlined text-[16px]">sensors</span>
            </div>
          `,
        });

        const sMarker = L.marker(sensor.coords, { icon: sensorIcon });
        sMarker.bindTooltip(`<b>${sensor.name}</b><br/>Telemetry: ${sensor.val}`, {
          className: 'font-label-mono-sm text-[11px] bg-surface-container-lowest text-on-surface shadow-md p-1.5 rounded',
        });
        overlaysGroup.addLayer(sMarker);
      });
    }
  }, [currentRegion, selectedIncidentId, showSensors, showRadar, showTraffic]);

  // Recenter map when selected incident changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const regionData = REGION_PRESETS[currentRegion];
    const targetInc = regionData.incidents.find((i) => i.id === selectedIncidentId);
    if (targetInc) {
      mapInstanceRef.current.panTo([targetInc.lat, targetInc.lng], {
        animate: true,
        duration: 0.8,
      });
    }
  }, [selectedIncidentId]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#e5e3df] select-none">
      {/* Real Map Container Rendered by Leaflet with Google Maps Tiles */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* Floating Region Switcher Pill (Top Center) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-1 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-outline-variant font-label-mono-sm text-label-mono-sm">
        <span className="material-symbols-outlined text-[16px] text-secondary">explore</span>
        <button
          onClick={() => handleSwitchRegion('sector4')}
          className={`px-3 py-1 rounded-full transition-colors ${
            currentRegion === 'sector4'
              ? 'bg-primary text-on-primary font-bold shadow-xs'
              : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          Sector 4 (Central)
        </button>
        <button
          onClick={() => handleSwitchRegion('mumbaiPune')}
          className={`px-3 py-1 rounded-full transition-colors ${
            currentRegion === 'mumbaiPune'
              ? 'bg-primary text-on-primary font-bold shadow-xs'
              : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          Mumbai – Pune Corridor
        </button>
      </div>

      {/* Bottom-Right Controls: Layers Switcher + Zoom Buttons (Separated from Left Legend) */}
      <div className="absolute bottom-5 right-5 z-[400] flex flex-col items-end gap-2">
        {/* Layer Switcher Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="flex items-center gap-2 bg-surface-container-lowest/95 hover:bg-surface-container-lowest backdrop-blur-md px-3 py-2 rounded-xl shadow-xl border border-outline-variant text-on-surface transition-all group"
            title="Toggle Map Cartography"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-outline-variant shrink-0 bg-slate-900 flex items-center justify-center">
              {activeTileStyle.includes('satellite') ? (
                <span className="material-symbols-outlined text-[18px] text-emerald-400">satellite_alt</span>
              ) : activeTileStyle.includes('terrain') ? (
                <span className="material-symbols-outlined text-[18px] text-amber-500">terrain</span>
              ) : (
                <span className="material-symbols-outlined text-[18px] text-sky-400">map</span>
              )}
            </div>
            <div className="flex flex-col text-left leading-tight pr-0.5">
              <span className="font-title-sm text-title-sm font-semibold flex items-center gap-1">
                Layers
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant group-hover:translate-y-0.5 transition-transform">
                  expand_less
                </span>
              </span>
              <span className="font-label-mono-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
                {activeTileStyle === 'google-streets' ? 'Google Roads' : activeTileStyle === 'google-satellite' ? 'Satellite' : activeTileStyle === 'google-hybrid' ? 'Hybrid' : activeTileStyle === 'google-terrain' ? 'Terrain' : 'OpenStreet'}
              </span>
            </div>
          </button>

          {/* Expanded Layer Options Drawer (Opens upward to the left) */}
          {showLayerMenu && (
            <div className="absolute bottom-14 right-0 w-64 bg-surface-container-lowest/98 backdrop-blur-lg rounded-xl shadow-2xl border border-outline-variant p-2 flex flex-col gap-1 z-[450] animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-2 py-1 text-[11px] font-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                Map Types (Google Maps Core)
              </div>
              <button
                onClick={() => {
                  setActiveTileStyle('google-streets');
                  setShowLayerMenu(false);
                }}
                className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors ${
                  activeTileStyle === 'google-streets' ? 'bg-secondary-fixed/40 font-semibold text-primary' : 'hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">explore</span>
                <div className="flex flex-col leading-tight">
                  <span className="text-body-sm text-[13px] font-medium">Google Maps Streets</span>
                  <span className="text-[10px] text-on-surface-variant">Full road networks &amp; labeled landmarks</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTileStyle('google-hybrid');
                  setShowLayerMenu(false);
                }}
                className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors ${
                  activeTileStyle === 'google-hybrid' ? 'bg-secondary-fixed/40 font-semibold text-primary' : 'hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-600">satellite_alt</span>
                <div className="flex flex-col leading-tight">
                  <span className="text-body-sm text-[13px] font-medium">Google Maps Hybrid</span>
                  <span className="text-[10px] text-on-surface-variant">High-res aerial imagery + road overlays</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTileStyle('google-satellite');
                  setShowLayerMenu(false);
                }}
                className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors ${
                  activeTileStyle === 'google-satellite' ? 'bg-secondary-fixed/40 font-semibold text-primary' : 'hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-700">photo_camera</span>
                <div className="flex flex-col leading-tight">
                  <span className="text-body-sm text-[13px] font-medium">Pure Satellite Aerial</span>
                  <span className="text-[10px] text-on-surface-variant">Satellite photography without labels</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTileStyle('google-terrain');
                  setShowLayerMenu(false);
                }}
                className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors ${
                  activeTileStyle === 'google-terrain' ? 'bg-secondary-fixed/40 font-semibold text-primary' : 'hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-amber-600">terrain</span>
                <div className="flex flex-col leading-tight">
                  <span className="text-body-sm text-[13px] font-medium">Google Maps Terrain</span>
                  <span className="text-[10px] text-on-surface-variant">Topographic shading &amp; contours</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTileStyle('osm');
                  setShowLayerMenu(false);
                }}
                className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors ${
                  activeTileStyle === 'osm' ? 'bg-secondary-fixed/40 font-semibold text-primary' : 'hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-slate-600">public</span>
                <div className="flex flex-col leading-tight">
                  <span className="text-body-sm text-[13px] font-medium">OpenStreetMap Standard</span>
                  <span className="text-[10px] text-on-surface-variant">Community cartography baseline</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Recenter & Fit All Button */}
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              const reg = REGION_PRESETS[currentRegion];
              mapInstanceRef.current.setView(reg.coords, reg.zoom, { animate: true });
            }
          }}
          className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-lg border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
          title="Recenter Map View"
        >
          <span className="material-symbols-outlined text-[20px]">my_location</span>
        </button>

        {/* Zoom In & Out Buttons */}
        <div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-lg border border-outline-variant overflow-hidden">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container border-b border-outline-variant transition-colors"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
        </div>

        {/* Live Coordinate Badge & Scale Bar */}
        <div className="px-2.5 py-1 rounded-md bg-surface-container-lowest/90 backdrop-blur-sm border border-outline-variant text-[10px] font-label-mono-sm text-on-surface-variant shadow-sm flex items-center gap-2">
          <span>{mapCenterStr}</span>
          <span>•</span>
          <span>Z: {currentZoom}</span>
        </div>
      </div>
    </div>
  );
};
