import React from 'react';
import { motion } from 'framer-motion';

export const ActivityFeed = () => {
  const events = [
    { id: 1, type: 'DRUSEN', time: '2m ago', title: 'DRUSEN detected', details: 'Confidence: 71.3% · 143ms' },
    { id: 2, type: 'DME', time: '5m ago', title: 'DME detected', details: 'Confidence: 98.3% · 128ms' },
    { id: 3, type: 'REPORT', time: '8m ago', title: 'Report generated', details: 'OCT_Report_A1B2C3.pdf' },
    { id: 4, type: 'UPLOAD', time: '12m ago', title: 'New scan uploaded', details: 'oct_scan_002.jpg · 2.3MB' },
    { id: 5, type: 'SYSTEM', time: '1h ago', title: 'Model loaded', details: 'EfficientNet-B3 · 0.8s init' },
    { id: 6, type: 'NORMAL', time: '2h ago', title: 'NORMAL detected', details: 'Confidence: 99.1% · 120ms' },
  ];

  const getColor = (type) => {
    switch (type) {
      case 'CNV': return 'bg-accent';
      case 'DME': return 'bg-[#ff7733]';
      case 'DRUSEN': return 'bg-[#ffaa44]';
      case 'NORMAL': return 'bg-success';
      case 'REPORT': return 'bg-[#444]';
      case 'UPLOAD': return 'bg-[#444]';
      case 'SYSTEM': return 'bg-[#222]';
      default: return 'bg-accent';
    }
  };

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-[8px] h-[350px] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[#1f1f1f] flex justify-between items-center shrink-0">
        <h3 className="text-[11px] font-body text-text-muted tracking-[0.08em] uppercase font-bold">
          AI Activity Feed
        </h3>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
          <span className="text-[10px] text-success font-mono tracking-widest uppercase">Live</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {events.map((event, i) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-start gap-4 p-3 rounded-[4px] hover:bg-[#161616] transition-colors group cursor-default"
          >
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getColor(event.type)} group-hover:scale-125 transition-transform`}></div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="text-[13px] text-white font-medium truncate pr-2">{event.title}</span>
                <span className="text-[11px] text-[#333] font-mono shrink-0">{event.time}</span>
              </div>
              <div className="text-[11px] text-[#444] truncate">{event.details}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
