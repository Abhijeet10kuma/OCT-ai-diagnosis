import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, History, Activity, LogOut, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Sidebar = () => {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'New Scan', icon: UploadCloud, path: '/dashboard/upload' },
    { name: 'History', icon: History, path: '/dashboard/history' },
    { name: 'Analytics', icon: Activity, path: '/dashboard/analytics' },
    { name: 'Profile', icon: User, path: '/dashboard/profile' },
  ];

  return (
    <div className="w-[220px] h-screen bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col hidden md:flex">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-[#1a1a1a]">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <Activity size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">OCT AI</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
          <span className="text-[10px] text-text-muted font-mono tracking-widest">LIVE</span>
        </div>
      </div>
      
      {/* Model Status Box */}
      <div className="mx-4 mt-6 p-3 bg-[#0f1a0f] border border-success/20 rounded-[6px]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-success"></div>
          <span className="text-[11px] font-bold text-success uppercase tracking-wider">Model Online</span>
        </div>
        <div className="font-mono text-[11px] text-white/80 mb-1">EfficientNet-B3</div>
        <div className="font-mono text-[10px] text-success/70">&lt;200ms latency</div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-[4px] transition-all text-[13px] ${
                isActive 
                  ? 'bg-[#1a0a08] text-white border-l-2 border-accent' 
                  : 'text-text-secondary hover:text-white hover:bg-[#111] border-l-2 border-transparent'
              }`
            }
          >
            <item.icon size={16} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* System Info */}
      <div className="px-6 py-4 border-t border-[#1a1a1a]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">API Status</span>
          <div className="flex gap-[2px]">
            {[...Array(4)].map((_, i) => <div key={i} className="w-1.5 h-3 bg-success/80"></div>)}
            <div className="w-1.5 h-3 bg-[#222]"></div>
          </div>
        </div>
        <div className="flex justify-between items-center text-[11px] font-mono text-[#444] mb-1">
          <span>UPTIME</span>
          <span>99.8%</span>
        </div>
        <div className="flex justify-between items-center text-[11px] font-mono text-[#444]">
          <span>MODEL VER</span>
          <span>v1.0</span>
        </div>
      </div>

      {/* User Card */}
      <div className="p-4 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-3 px-2 py-2 w-full rounded-[6px] hover:bg-[#111] transition-colors cursor-pointer group" onClick={logout}>
          <div className="w-8 h-8 rounded-full bg-[#1f1f1f] flex items-center justify-center font-bold text-accent text-[12px]">
            {user?.name?.charAt(0).toUpperCase() || 'D'}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="font-medium text-white text-[13px] truncate">{user?.name || 'Dr. Smith'}</div>
            <div className="text-[11px] text-text-muted capitalize">{user?.role || 'Doctor'}</div>
          </div>
          <LogOut size={14} className="text-text-muted group-hover:text-accent transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
