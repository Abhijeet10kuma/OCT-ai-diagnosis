import { motion } from 'framer-motion';
import { User, Mail, ShieldCheck, Clock, Activity, Key, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold mb-2">My Profile</h2>
        <p className="text-gray-400">Manage your account and view security preferences.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Account Details */}
        <div className="md:col-span-1 space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-6 rounded-2xl text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-4xl shadow-xl mx-auto mb-4 border-4 border-surface">
              {user?.name?.charAt(0).toUpperCase() || 'D'}
            </div>
            <h3 className="text-xl font-bold">{user?.name || 'Dr. Smith'}</h3>
            <p className="text-sm text-primary capitalize mb-6">{user?.role || 'Doctor'}</p>
            
            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <Key size={16} /> Change Password
              </button>
              <button onClick={handleLogout} className="p-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Information */}
        <div className="md:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold border-b border-white/10 pb-4">Personal Information</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm text-gray-400 flex items-center gap-2"><User size={14} /> Full Name</label>
                <div className="text-white font-medium">{user?.name || 'Dr. Smith'}</div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400 flex items-center gap-2"><Mail size={14} /> Email Address</label>
                <div className="text-white font-medium">{user?.email || 'doctor@hospital.com'}</div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400 flex items-center gap-2"><Activity size={14} /> Role</label>
                <div className="text-white font-medium capitalize">{user?.role || 'Doctor'}</div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400 flex items-center gap-2"><Clock size={14} /> Member Since</label>
                <div className="text-white font-medium">May 2026</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-8 rounded-2xl bg-gradient-to-br from-surface to-bg-dark border-l-4 border-success">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><ShieldCheck className="text-success" size={20} /> Data Privacy & HIPAA</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your account is configured for strict data privacy. All uploaded OCT scans are processed in-memory and are not persisted to persistent storage unless explicitly saved into a report. Patient Identifiable Information (PII) is obfuscated automatically.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
