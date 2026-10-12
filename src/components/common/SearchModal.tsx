import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, AlertTriangle, Database, Activity, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useIncidentStore } from '../../store/incidentStore';
import { INITIAL_INCIDENTS, INITIAL_DATA_SOURCES } from '../../services/mockData';
import { SeverityBadge } from './SeverityBadge';
import { OriginBadge } from './OriginBadge';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useUiStore();
  const { setSelectedIncidentId } = useIncidentStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredIncidents = INITIAL_INCIDENTS.filter(i => 
    i.id.toLowerCase().includes(query.toLowerCase()) ||
    i.title.toLowerCase().includes(query.toLowerCase()) ||
    i.location.address?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSources = INITIAL_DATA_SOURCES.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.protocol.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectIncident = (id: string) => {
    setSelectedIncidentId(id);
    setIsSearchOpen(false);
    navigate(`/incidents/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-primary/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-lg shadow-stitch-modal overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-outline-variant bg-surface-container-low">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant mr-3 shrink-0">
            search
          </span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search incident ID (e.g. INC-2048), location, telemetry..."
            className="w-full bg-transparent text-body-md font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none"
          />
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Route Navigations */}
          <div>
            <div className="px-2 py-1 text-[10px] font-label-mono-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Quick Navigations
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button 
                onClick={() => { setIsSearchOpen(false); navigate('/map'); }}
                className="flex items-center justify-between p-2 rounded bg-surface hover:bg-surface-container text-left transition-colors border border-outline-variant/60"
              >
                <span className="flex items-center gap-2 text-on-surface font-body-sm text-body-sm font-medium">
                  <span className="material-symbols-outlined text-[16px] text-secondary">map</span>
                  Live Cartographic Map
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_forward</span>
              </button>
              <button 
                onClick={() => { setIsSearchOpen(false); navigate('/replay'); }}
                className="flex items-center justify-between p-2 rounded bg-surface hover:bg-surface-container text-left transition-colors border border-outline-variant/60"
              >
                <span className="flex items-center gap-2 text-on-surface font-body-sm text-body-sm font-medium">
                  <span className="material-symbols-outlined text-[16px] text-warning-dark">history_toggle_off</span>
                  Replay Lab Workspace
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Incidents Section */}
          <div>
            <div className="px-2 py-1 text-[10px] font-label-mono-sm text-on-surface-variant uppercase tracking-wider font-semibold flex justify-between">
              <span>Matching Incidents ({filteredIncidents.length})</span>
            </div>
            <div className="mt-1 space-y-1">
              {filteredIncidents.slice(0, 4).map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => handleSelectIncident(inc.id)}
                  className="p-2.5 rounded bg-surface hover:bg-surface-container border border-outline-variant/50 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-label-mono-sm text-label-mono-sm font-bold text-primary">
                        {inc.id}
                      </span>
                      <span className="font-title-sm text-title-sm font-medium text-on-surface">
                        {inc.title}
                      </span>
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                      {inc.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-on-surface-variant">
                    <span>{inc.location.address || inc.location.zone || 'Sector 4 Central'}</span>
                    <span className="text-secondary font-medium">Investigate →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 border-t border-outline-variant bg-surface-container-low flex items-center justify-between text-caption text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span>Press <kbd className="px-1 bg-surface border border-outline-variant rounded font-label-mono-sm">ESC</kbd> to exit</span>
          </div>
          <span>UrbanIncident Intelligence • District Central</span>
        </div>
      </div>
    </div>
  );
};
