import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ActivitySquare, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import usePredictionStore from '../store/predictionStore';

import { StatCard } from '../components/dashboard/StatCard';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { RecentScansTable } from '../components/dashboard/RecentScansTable';
import { DiseaseDonut } from '../components/dashboard/DiseaseDonut';
import { QuickUploadBanner } from '../components/dashboard/QuickUploadBanner';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#111', border: '1px solid #e63a2e', borderRadius: '6px', padding: '10px 14px', fontFamily: '"DM Sans", sans-serif' }}>
        <p className="text-[12px] text-white font-bold mb-1">{label} &middot; <span className="text-accent">{payload[0].payload.class || 'DRUSEN'}</span></p>
        <p className="text-[12px] text-text-secondary">{payload[0].value}% confidence</p>
        <p className="text-[10px] text-[#555] mt-2 font-mono">May 10, 2026</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { history, fetchHistory, isLoading } = usePredictionStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const chartData = history.length > 0 ? history.map((item, idx) => ({
    name: `Scan ${history.length - idx}`,
    confidence: Math.round(item.confidence),
    class: item.predicted_class
  })).reverse() : [
    { name: 'Scan 1', confidence: 92, class: 'DRUSEN' },
    { name: 'Scan 2', confidence: 96, class: 'DME' },
    { name: 'Scan 3', confidence: 85, class: 'CNV' },
    { name: 'Scan 4', confidence: 99, class: 'NORMAL' },
    { name: 'Scan 5', confidence: 94, class: 'NORMAL' },
  ];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      
      {/* ROW 1: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <StatCard 
            title="Total Scans" 
            value={history.length > 0 ? history.length : 4} 
            delta="+2" deltaLabel="this week" 
            icon={ActivitySquare} 
            type="progress" 
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <StatCard 
            title="Pathology Detected" 
            value={history.filter(h => h.predicted_class !== 'NORMAL').length || 4} 
            delta="⚠" deltaLabel="CRITICAL" 
            icon={AlertTriangle} 
            type="breakdown" 
            className="border-l-2 border-l-accent"
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <StatCard 
            title="Normal Results" 
            value={history.filter(h => h.predicted_class === 'NORMAL').length || 0} 
            delta="✓" deltaLabel="CLEAR" 
            icon={CheckCircle} 
            type="text" 
            customContent="No normal scans detected yet"
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
          <StatCard 
            title="PDF Reports" 
            value={history.filter(h => h.report_generated).length || 2} 
            delta="" deltaLabel="Last: today" 
            icon={FileText} 
            type="link" 
            customContent="Download latest"
          />
        </motion.div>
      </div>

      {/* ROW 2: Chart & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[350px]">
        {/* Confidence Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="lg:col-span-8 bg-[#111] border border-[#1f1f1f] rounded-[8px] p-6 h-full flex flex-col"
        >
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-[11px] font-body text-text-muted tracking-[0.08em] uppercase font-bold">Confidence Trend</h3>
            <div className="flex bg-[#1a1a1a] rounded-[4px] p-0.5">
              <button className="px-3 py-1 text-[10px] font-bold text-white bg-[#333] rounded-[2px]">7D</button>
              <button className="px-3 py-1 text-[10px] font-bold text-text-muted hover:text-white">30D</button>
              <button className="px-3 py-1 text-[10px] font-bold text-text-muted hover:text-white">All</button>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConfRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(230,58,46,0.3)"/>
                    <stop offset="95%" stopColor="rgba(230,58,46,0)"/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#141414" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#444" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontFamily: 'DM Sans' }}
                />
                <YAxis 
                  stroke="#444" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  domain={[0, 100]} 
                  tick={{ fontFamily: 'DM Sans' }}
                />
                <Tooltip cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }} content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="#e63a2e" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorConfRed)" 
                  activeDot={{ r: 6, fill: '#e63a2e', stroke: 'rgba(230,58,46,0.4)', strokeWidth: 4 }}
                  dot={{ r: 4, fill: '#e63a2e', strokeWidth: 0 }}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 h-full">
          <ActivityFeed />
        </div>
      </div>

      {/* ROW 3: Table & Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[400px]">
        {/* Recent Scans Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="lg:col-span-8 h-full"
        >
          <RecentScansTable scans={history} />
        </motion.div>

        {/* Disease Donut */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="lg:col-span-4 h-full"
        >
          <DiseaseDonut />
        </motion.div>
      </div>

      {/* ROW 4: Quick Upload Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="pb-10"
      >
        <QuickUploadBanner />
      </motion.div>

    </div>
  );
};

export default Dashboard;
