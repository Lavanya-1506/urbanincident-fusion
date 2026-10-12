import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../store/uiStore';
import { useIncidentStore } from '../../store/incidentStore';

export const NotificationsDrawer: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, notifications, markNotificationAsRead, clearNotifications } = useUiStore();
  const { setSelectedIncidentId } = useIncidentStore();
  const navigate = useNavigate();

  if (!isNotificationsOpen) return null;

  const handleOpenIncident = (incidentId?: string) => {
    if (incidentId) {
      setSelectedIncidentId(incidentId);
      setIsNotificationsOpen(false);
      navigate(`/incidents/${incidentId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-primary/30 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-surface-container-lowest border-l border-outline-variant shadow-stitch-modal h-full flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">notifications</span>
            <h3 className="font-title-sm text-title-sm font-semibold text-on-surface">Operational Alerts</h3>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-label-mono-sm bg-error-container text-on-error-container font-semibold">
              {notifications.filter(n => !n.read).length} new
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearNotifications}
              className="font-caption text-caption text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                markNotificationAsRead(item.id);
                handleOpenIncident(item.incidentId);
              }}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                item.read 
                  ? 'bg-surface border-outline-variant/40 opacity-75' 
                  : 'bg-surface-container-low border-outline-variant hover:bg-surface-container'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-title-sm text-title-sm font-semibold text-on-surface">
                  {item.title}
                </span>
                <span className="text-[10px] font-label-mono-sm text-on-surface-variant shrink-0">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-snug">
                {item.message}
              </p>
              {item.incidentId && (
                <div className="mt-2 flex items-center justify-between text-[11px] font-label-mono-sm">
                  <span className="text-primary font-semibold">{item.incidentId}</span>
                  <span className="text-secondary font-medium">View Incident →</span>
                </div>
              )}
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="p-8 text-center text-on-surface-variant font-caption text-caption">
              No active operational alerts. System operating normally.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
