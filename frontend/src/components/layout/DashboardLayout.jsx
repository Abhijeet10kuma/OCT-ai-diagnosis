import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import useAuthStore from '../../store/authStore';
import { Bell, Search, Plus, FileText, BarChart2 } from 'lucide-react';

const DashboardLayout = () => {
  const user = useAuthStore(state => state.user);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-accent selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        
        {/* Topbar */}
        <header className="h-[80px] border-b border-[#1a1a1a] flex items-center justify-between px-8 bg-[rgba(13,13,13,0.9)] backdrop-blur-md z-20 shrink-0">
          <div>
            <h2 className="text-[16px] font-medium text-white mb-0.5">
              Welcome back, Dr. {user?.name?.split(' ')[1] || 'Smith'}
            </h2>
            <p className="text-[12px] text-text-secondary">
              Here's your diagnostic overview &middot; {today}
            </p>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search scans, patients, or reports..." 
                className="w-full bg-[#111] border border-[#1f1f1f] rounded-[6px] pl-9 pr-4 py-2 text-[14px] font-body text-white placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="bg-[#1f1f1f] text-text-secondary text-[10px] px-1.5 py-0.5 rounded-[4px] font-mono">⌘</kbd>
                <kbd className="bg-[#1f1f1f] text-text-secondary text-[10px] px-1.5 py-0.5 rounded-[4px] font-mono">K</kbd>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-text-secondary hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border-2 border-[#0d0d0d]"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#1f1f1f] flex items-center justify-center font-bold text-accent text-[12px] shadow-[0_0_10px_rgba(230,58,46,0.2)]">
              {user?.name?.charAt(0).toUpperCase() || 'D'}
            </div>
          </div>
        </header>

        {/* Quick Actions Strip */}
        <div className="h-[40px] bg-[#0d0d0d] border-b border-[#1a1a1a] px-8 flex items-center gap-4 z-10 shrink-0">
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold mr-2">Quick Actions:</span>
          <Link to="/dashboard/upload" className="flex items-center gap-2 text-[12px] text-text-secondary hover:text-white bg-[#111] hover:bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#1f1f1f] transition-colors">
            <Plus size={12} /> New Scan
          </Link>
          <Link to="/dashboard/history" className="flex items-center gap-2 text-[12px] text-text-secondary hover:text-white bg-[#111] hover:bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#1f1f1f] transition-colors">
            <FileText size={12} /> Last Report
          </Link>
          <Link to="/dashboard/analytics" className="flex items-center gap-2 text-[12px] text-text-secondary hover:text-white bg-[#111] hover:bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#1f1f1f] transition-colors">
            <BarChart2 size={12} /> Compare Scans
          </Link>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 z-0 relative">
          {/* Subtle noise over content area only if needed, but handled globally via body::before */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
