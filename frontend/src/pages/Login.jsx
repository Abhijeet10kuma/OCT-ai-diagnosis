import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // Email or Username
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // General validation rules
    if (identifier.trim().length < 3) {
      setLocalError('Username or email must be at least 3 characters long.');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }

    // Bypass backend authentication and log in automatically
    const mockUser = {
      name: identifier,
      email: identifier.includes('@') ? identifier : `${identifier}@example.com`,
      role: 'user'
    };

    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    useAuthStore.setState({
      user: mockUser,
      token: 'mock-jwt-token',
      isAuthenticated: true,
      error: null
    });

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden selection:bg-accent selection:text-white">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-[#111]/80 backdrop-blur-xl border border-[#1f1f1f] p-8 md:p-10 rounded-2xl relative z-10 shadow-[0_0_50px_rgba(230,58,46,0.05)]"
      >
        <Link to="/" className="flex items-center gap-3 mb-10 justify-center group">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-[0_0_15px_rgba(230,58,46,0.3)] group-hover:scale-105 transition-transform">
            <Activity size={22} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white group-hover:text-accent transition-colors">OCT AI</span>
        </Link>

        <h2 className="text-[28px] font-display font-bold text-white text-center mb-2">System Login</h2>
        <p className="text-text-secondary text-center mb-8 text-[14px]">Authenticate to access clinical-grade AI inference.</p>

        {localError && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 rounded-[6px] bg-[#1a0f0f] border border-accent/30 text-accent text-sm text-center font-medium">
            {localError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[12px] font-body font-bold uppercase tracking-wider text-text-muted">Username or Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555] group-focus-within:text-accent transition-colors">
                <Mail size={16} />
              </div>
              <input
                type="text"
                required
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-[6px] pl-10 pr-4 py-3 text-[14px] text-white placeholder-[#444] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="admin321"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-body font-bold uppercase tracking-wider text-text-muted">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555] group-focus-within:text-accent transition-colors">
                <Lock size={16} />
              </div>
              <input
                type="password"
                required
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-[6px] pl-10 pr-4 py-3 text-[14px] text-white placeholder-[#444] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-accent text-white font-medium rounded-[6px] px-6 py-3.5 flex items-center justify-center gap-2 mt-6 hover:bg-[#c8391f] transition-colors shadow-[0_0_15px_rgba(230,58,46,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Authenticate'} 
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-text-secondary">
          No access credentials?{' '}
          <Link to="/register" className="text-white hover:text-accent border-b border-transparent hover:border-accent transition-colors font-medium">
            Request System Access
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
