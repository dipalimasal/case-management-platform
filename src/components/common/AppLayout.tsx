import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '◫' },
  { to: '/cases', label: 'Case Queue', icon: '☰' },
];

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-56 bg-[#1a2332] border-r border-[#2d3a4d] flex flex-col shrink-0">
        <div className="px-4 py-5 border-b border-[#2d3a4d]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">CM</div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">Case Management</p>
              <p className="text-xs text-slate-400">Screening Platform</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#2d3a4d]/50'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-[#2d3a4d]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-medium">SC</div>
            <div>
              <p className="text-xs text-slate-200 font-medium">Sarah Chen</p>
              <p className="text-xs text-slate-500">Senior Investigator</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-[#0f1419]">
        <Outlet />
      </main>
    </div>
  );
}
