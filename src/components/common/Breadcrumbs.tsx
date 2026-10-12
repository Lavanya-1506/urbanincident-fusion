import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const routeNameMap: Record<string, string> = {
    dashboard: 'Operations Overview',
    map: 'Interactive 3D City & Map',
    incidents: 'Incident Explorer',
    replay: 'Timeline Replay Lab',
    analytics: 'Trends & Risk Analytics',
    sources: 'Data Source Health',
    settings: 'Settings & Permissions',
  };

  return (
    <nav className="flex items-center text-xs text-command-400 font-mono py-1">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>OPS</span>
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[name] || name;

        return (
          <React.Fragment key={name}>
            <ChevronRight className="w-3 h-3 text-command-600 mx-1.5" />
            {isLast ? (
              <span className="text-cyan-400 font-medium truncate max-w-[200px]">{displayName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-cyan-400 transition-colors truncate max-w-[150px]">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
