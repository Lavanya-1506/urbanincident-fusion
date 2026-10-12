import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUiStore } from '../../store/uiStore';
import { SearchModal } from './SearchModal';
import { NotificationsDrawer } from './NotificationsDrawer';
import { ReportGenerationModal } from '../../features/reports/ReportGenerationModal';
import { RaiseComplaintModal } from './RaiseComplaintModal';
import { useComplaintStore } from '../../store/complaintStore';

export const AppShell: React.FC = () => {
  const [isRailCollapsed, setIsRailCollapsed] = useState(false);
  const { 
    setIsSearchOpen, 
    isNotificationsOpen, 
    setIsNotificationsOpen, 
    notifications,
  } = useUiStore();
  const { setIsRaiseComplaintOpen } = useComplaintStore();

  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Operational Summary';
    if (path.includes('/map')) return 'Live Operational Map';
    if (path.includes('/incidents/')) return 'Incident Investigation';
    if (path.includes('/incidents')) return 'Incident Explorer';
    if (path.includes('/reports')) return 'Report History & Causal Dossiers';
    if (path.includes('/replay')) return 'Replay Lab - Comparison Workspace';
    if (path.includes('/analytics')) return 'Operational Analytics';
    if (path.includes('/sources')) return 'Data Sources & Telemetry';
    if (path.includes('/audit')) return 'Audit History & Compliance';
    if (path.includes('/settings')) return 'System Settings';
    return 'Operational Summary';
  };

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen flex flex-col">
      {/* Search Modal, Notifications Drawer, Report Modal, and Raise Complaint Modal */}
      <SearchModal />
      <NotificationsDrawer />
      <ReportGenerationModal />
      <RaiseComplaintModal />

      {/* Left Navigation Rail (Stitch exact layout) */}
      <aside 
        className={`fixed left-0 top-0 h-full ${
          isRailCollapsed ? 'w-16' : 'w-60'
        } bg-surface-container-lowest z-50 flex flex-col justify-between border-r border-outline-variant transition-all duration-200 select-none`}
      >
        <div className="flex flex-col">
          {/* Header Brand */}
          <div className="h-14 px-space-md flex items-center gap-space-sm border-b border-outline-variant overflow-hidden">
            <div className="w-8 h-8 rounded bg-primary-container text-tertiary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">radar</span>
            </div>
            {!isRailCollapsed && (
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate tracking-tight">
                  UrbanIncident
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider text-[10px]">
                  Fusion Ops
                </span>
              </div>
            )}
          </div>

          {/* Section: Operations */}
          <div className={`px-space-md pt-space-md pb-space-xs ${isRailCollapsed ? 'hidden' : 'block'}`}>
            <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider text-[10px] font-semibold">
              Operations
            </span>
          </div>
          <nav className="px-space-sm flex flex-col gap-0.5">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-sm py-2 rounded transition-colors font-body-sm text-body-sm ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
              title={isRailCollapsed ? 'Overview' : undefined}
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              {!isRailCollapsed && <span>Overview</span>}
            </NavLink>

            <NavLink
              to="/map"
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-sm py-2 rounded transition-colors font-body-sm text-body-sm ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
              title={isRailCollapsed ? 'Live Map' : undefined}
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              {!isRailCollapsed && <span>Live Map</span>}
            </NavLink>

            <NavLink
              to="/incidents"
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-sm py-2 rounded transition-colors font-body-sm text-body-sm ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
              title={isRailCollapsed ? 'Incidents' : undefined}
            >
              <span className="material-symbols-outlined text-[18px]">warning</span>
              {!isRailCollapsed && <span>Incidents</span>}
            </NavLink>

            <NavLink
              to="/replay"
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-sm py-2 rounded transition-colors font-body-sm text-body-sm ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
              title={isRailCollapsed ? 'Replay Lab' : undefined}
            >
              <span className="material-symbols-outlined text-[18px]">history_toggle_off</span>
              {!isRailCollapsed && <span>Replay Lab</span>}
            </NavLink>

            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-sm py-2 rounded transition-colors font-body-sm text-body-sm ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
              title={isRailCollapsed ? 'Analytics' : undefined}
            >
              <span className="material-symbols-outlined text-[18px]">insights</span>
              {!isRailCollapsed && <span>Analytics</span>}
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-sm py-2 rounded transition-colors font-body-sm text-body-sm ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
              title={isRailCollapsed ? 'Reports & Dossiers' : undefined}
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              {!isRailCollapsed && <span>Reports</span>}
            </NavLink>

            {/* Raise Complaint Action */}
            <button
              type="button"
              onClick={() => setIsRaiseComplaintOpen(true)}
              className="flex items-center gap-space-sm px-space-sm py-2 rounded transition-colors font-body-sm text-body-sm text-primary hover:bg-surface-container font-medium w-full text-left cursor-pointer mt-1"
              title={isRailCollapsed ? 'Raise Complaint' : undefined}
            >
              <span className="material-symbols-outlined text-[18px] text-primary">campaign</span>
              {!isRailCollapsed && <span>Raise Complaint</span>}
            </button>
          </nav>

          {/* Section: System */}
          <div className={`px-space-md pt-space-lg pb-space-xs ${isRailCollapsed ? 'hidden' : 'block'}`}>
            <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider text-[10px] font-semibold">
              System
            </span>
          </div>
          <nav className="px-space-sm flex flex-col gap-0.5">
            <NavLink
              to="/sources"
              className={({ isActive }) =>
                `flex items-center justify-between px-space-sm py-2 rounded transition-colors font-body-sm text-body-sm ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
              title={isRailCollapsed ? 'Data Sources' : undefined}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[18px]">sensors</span>
                {!isRailCollapsed && <span>Data Sources</span>}
              </div>
              {!isRailCollapsed && (
                <span className="px-1.5 py-0.5 rounded text-[11px] font-label-mono-sm text-label-mono-sm bg-tertiary-fixed text-on-tertiary-fixed font-semibold">
                  12/12
                </span>
              )}
            </NavLink>

            <NavLink
              to="/audit"
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-sm py-2 rounded transition-colors font-body-sm text-body-sm ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
              title={isRailCollapsed ? 'Audit History' : undefined}
            >
              <span className="material-symbols-outlined text-[18px]">policy</span>
              {!isRailCollapsed && <span>Audit History</span>}
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-sm py-2 rounded transition-colors font-body-sm text-body-sm ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
              title={isRailCollapsed ? 'Settings' : undefined}
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              {!isRailCollapsed && <span>Settings</span>}
            </NavLink>
          </nav>
        </div>

        {/* Rail Footer */}
        <div className="p-space-md border-t border-outline-variant flex items-center justify-between bg-surface-container-lowest">
          {!isRailCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant truncate">
                District Central
              </span>
              <span className="font-caption text-caption text-on-surface-variant text-[10px]">
                v2.4.1 Production
              </span>
            </div>
          )}
          <button
            aria-label="Collapse sidebar"
            onClick={() => setIsRailCollapsed(!isRailCollapsed)}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isRailCollapsed ? 'dock_to_right' : 'dock_to_left'}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-200 ${isRailCollapsed ? 'pl-16' : 'pl-60'}`}>
        {/* Top Header Bar (Stitch exact layout) */}
        <header 
          className={`fixed top-0 ${
            isRailCollapsed ? 'left-16' : 'left-60'
          } right-0 h-14 bg-surface-container-lowest border-b border-outline-variant z-40 flex items-center justify-between px-space-lg transition-all duration-200`}
        >
          {/* Left Breadcrumb */}
          <div className="flex items-center gap-space-sm">
            <span className="font-caption text-caption text-on-surface-variant">UrbanIncident</span>
            <span className="text-outline-variant">/</span>
            <span className="font-title-sm text-title-sm text-on-surface font-medium">
              {getPageTitle()}
            </span>
          </div>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-md mx-space-xl">
            <div 
              onClick={() => setIsSearchOpen(true)}
              className="relative flex items-center cursor-pointer group"
            >
              <span className="material-symbols-outlined absolute left-3 text-[18px] text-on-surface-variant pointer-events-none group-hover:text-on-surface">
                search
              </span>
              <input
                readOnly
                className="w-full h-9 pl-9 pr-12 rounded bg-surface border border-outline-variant font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none cursor-pointer hover:border-secondary transition-colors"
                placeholder="Search incident ID (e.g. INC-2048), location..."
                type="text"
              />
              <kbd className="absolute right-2 px-1.5 py-0.5 text-[10px] font-label-mono-sm text-label-mono-sm text-on-surface-variant bg-surface-container border border-outline-variant rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right Status & Profile Cluster */}
          <div className="flex items-center gap-space-sm sm:gap-space-md">
            {/* Raise Civic Area Complaint Button */}
            <button
              type="button"
              onClick={() => setIsRaiseComplaintOpen(true)}
              className="h-8.5 px-3 rounded bg-primary text-on-primary font-title-sm text-title-sm hover:bg-primary-container shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Report an incident or raise an area complaint to Municipal Command"
            >
              <span className="material-symbols-outlined text-[17px]">campaign</span>
              <span className="hidden sm:inline font-semibold">Raise Complaint</span>
            </button>

            {/* Live Indicator */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-surface border border-outline-variant">
              <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                Live • 14s ago
              </span>
            </div>

            <div className="h-4 w-px bg-outline-variant hidden sm:block"></div>

            {/* Notification Bell */}
            <button
              aria-label="View notifications"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative text-on-surface-variant hover:text-on-surface p-1.5 rounded hover:bg-surface-container transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-4 h-4 bg-error text-on-error font-caption text-caption text-[10px] rounded-full flex items-center justify-center font-bold">
                {notifications.filter(n => !n.read).length || 3}
              </span>
            </button>

            {/* Documentation Help */}
            <button
              aria-label="Documentation"
              onClick={() => navigate('/settings')}
              className="text-on-surface-variant hover:text-on-surface p-1.5 rounded hover:bg-surface-container transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">help_outline</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-space-sm pl-space-xs cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
                EV
              </div>
              <div className="hidden lg:flex flex-col leading-tight">
                <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                  Elena Vance
                </span>
                <span className="font-caption text-caption text-on-surface-variant text-[11px]">
                  Lead Incident Analyst
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                arrow_drop_down
              </span>
            </div>
          </div>
        </header>

        {/* Viewport content */}
        <main className="pt-14 min-h-screen bg-background text-on-surface">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
