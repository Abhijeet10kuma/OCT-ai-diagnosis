import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ title, value, delta, deltaLabel, icon: Icon, type = "text", customContent, className = "" }) => {
  return (
    <motion.div 
      className={`bg-[#111] border border-[#1f1f1f] rounded-[8px] p-6 hover:border-accent hover:bg-[#161616] transition-colors group relative overflow-hidden flex flex-col justify-between h-full ${className}`}
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-[11px] font-body text-text-muted tracking-[0.08em] uppercase font-bold">
          {title}
        </h3>
        {Icon && <Icon size={16} className="text-text-muted group-hover:text-white transition-colors" />}
      </div>
      
      <div className="relative z-10 flex items-end gap-3 mb-4">
        <div className="text-[42px] font-display font-[700] text-white leading-none tabular-nums group-hover:scale-105 origin-left transition-transform duration-300">
          {value}
        </div>
        {delta && (
          <div className="text-[11px] text-text-muted mb-1 flex items-center gap-1">
            <span className={delta.startsWith('+') ? 'text-success' : 'text-danger'}>{delta}</span>
            {deltaLabel}
          </div>
        )}
      </div>

      <div className="h-[1px] w-full bg-[#1f1f1f] mb-4 relative z-10"></div>

      <div className="relative z-10">
        {type === 'progress' && (
          <div>
            <div className="w-full h-1 bg-[#222] rounded-full overflow-hidden mb-1">
              <div className="h-full bg-[#444] group-hover:bg-accent transition-colors" style={{ width: '80%' }}></div>
            </div>
            <div className="text-[11px] text-text-secondary text-right">80% capacity</div>
          </div>
        )}

        {type === 'breakdown' && (
          <div className="flex gap-1">
            <div className="h-1 bg-accent w-1/2"></div>
            <div className="h-1 bg-[#ff7733] w-1/3"></div>
            <div className="h-1 bg-[#ffaa44] w-1/6"></div>
          </div>
        )}

        {type === 'text' && (
          <div className="text-[11px] text-text-secondary">
            {customContent}
          </div>
        )}

        {type === 'link' && (
          <a href="#" className="text-[11px] font-bold text-text-muted group-hover:text-accent transition-colors">
            {customContent} &rarr;
          </a>
        )}
      </div>
    </motion.div>
  );
};
