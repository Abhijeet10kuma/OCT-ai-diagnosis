import React, { useState } from 'react';
import { Eye, FileText, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RecentScansTable = ({ scans }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  const getColor = (type) => {
    switch (type) {
      case 'CNV': return 'bg-accent';
      case 'DME': return 'bg-[#ff7733]';
      case 'DRUSEN': return 'bg-[#ffaa44]';
      case 'NORMAL': return 'bg-success';
      default: return 'bg-[#444]';
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case 'CNV': return 'text-accent';
      case 'DME': return 'text-[#ff7733]';
      case 'DRUSEN': return 'text-[#ffaa44]';
      case 'NORMAL': return 'text-success';
      default: return 'text-white';
    }
  };

  const mockScans = [
    { id: 'a1b2', class: 'DRUSEN', conf: 71, file: 'scan_1.jpg', date: 'May 9' },
    { id: 'c3d4', class: 'DME', conf: 98, file: 'scan_2.jpg', date: 'May 9' },
    { id: 'e5f6', class: 'NORMAL', conf: 99, file: 'scan_3.jpg', date: 'May 8' },
    { id: 'g7h8', class: 'CNV', conf: 92, file: 'scan_4.jpg', date: 'May 8' },
    { id: 'i9j0', class: 'NORMAL', conf: 96, file: 'scan_5.jpg', date: 'May 7' },
  ];

  const data = scans && scans.length > 0 ? scans.map(s => ({
    id: s.prediction_id.slice(-4),
    class: s.predicted_class,
    conf: Math.round(s.confidence),
    file: 'scan_img.jpg',
    date: new Date(s.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })) : mockScans;

  const sortedData = [...data].sort((a, b) => {
    return sortOrder === 'desc' ? b.conf - a.conf : a.conf - b.conf;
  });

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-[8px] h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[#1f1f1f] flex justify-between items-center shrink-0">
        <h3 className="text-[11px] font-body text-text-muted tracking-[0.08em] uppercase font-bold">
          Recent Scans
        </h3>
        <div className="flex gap-2">
          <button className="text-[11px] font-bold text-text-muted hover:text-white transition-colors">View All &rarr;</button>
          <button className="text-[11px] font-bold text-text-muted hover:text-white transition-colors">Export &darr;</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-3 text-[11px] text-[#333] uppercase tracking-wide font-medium border-b border-[#1f1f1f]">ID</th>
              <th className="px-4 py-3 text-[11px] text-[#333] uppercase tracking-wide font-medium border-b border-[#1f1f1f]">Class</th>
              <th 
                className="px-4 py-3 text-[11px] text-[#333] uppercase tracking-wide font-medium border-b border-[#1f1f1f] cursor-pointer hover:text-[#555] transition-colors"
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              >
                <div className="flex items-center gap-1">
                  Conf. {sortOrder === 'desc' ? <ChevronDown size={12}/> : <ChevronUp size={12}/>}
                </div>
              </th>
              <th className="px-4 py-3 text-[11px] text-[#333] uppercase tracking-wide font-medium border-b border-[#1f1f1f]">File</th>
              <th className="px-4 py-3 text-[11px] text-[#333] uppercase tracking-wide font-medium border-b border-[#1f1f1f]">Date</th>
              <th className="px-4 py-3 text-[11px] text-[#333] uppercase tracking-wide font-medium border-b border-[#1f1f1f]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, i) => (
              <React.Fragment key={row.id}>
                <tr 
                  className="hover:bg-[#161616] transition-colors border-b border-[#1f1f1f] group cursor-pointer"
                  onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                >
                  <td className="px-4 py-3 font-mono text-[13px] text-[#555] group-hover:text-white transition-colors border-l-2 border-transparent group-hover:border-accent">
                    {row.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getColor(row.class)}`}></div>
                      <span className={`text-[12px] font-bold ${getTextColor(row.class)}`}>{row.class}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-[#222] rounded-full overflow-hidden">
                        <div className={`h-full ${getColor(row.class)}`} style={{ width: `${row.conf}%` }}></div>
                      </div>
                      <span className="text-[12px] font-bold text-white tabular-nums">{row.conf}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-secondary">{row.file}</td>
                  <td className="px-4 py-3 text-[13px] text-text-secondary">{row.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-[#444]">
                      <Eye size={14} className="hover:text-white transition-colors" onClick={(e) => e.stopPropagation()} />
                      <FileText size={14} className="hover:text-white transition-colors" onClick={(e) => e.stopPropagation()} />
                      <Trash2 size={14} className="hover:text-accent transition-colors" onClick={(e) => e.stopPropagation()} />
                    </div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedId === row.id && (
                    <tr>
                      <td colSpan="6" className="p-0 border-b border-[#1f1f1f]">
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-[#0f0f0f] px-6 py-4 flex gap-6 items-center"
                        >
                          <div className="w-20 h-20 bg-[#1a1a1a] border border-[#222] rounded flex items-center justify-center overflow-hidden shrink-0">
                            {/* Grad-CAM placeholder */}
                            <div className={`w-full h-full opacity-50 bg-gradient-to-tr from-transparent to-${getColor(row.class).replace('bg-', '')}`}></div>
                          </div>
                          <div className="flex-1 text-[12px] text-text-secondary">
                            <p className="mb-1 text-white font-medium">Grad-CAM Preview Generated</p>
                            <p>Model focused on sub-retinal fluid and hyper-reflective foci.</p>
                            <button className="mt-2 text-accent hover:underline">View Full Analysis &rarr;</button>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
