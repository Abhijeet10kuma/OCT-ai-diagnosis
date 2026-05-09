import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Plus } from 'lucide-react';

export const QuickUploadBanner = () => {
  return (
    <div className="bg-[#0f0808] border border-[rgba(230,58,46,0.2)] hover:border-accent transition-colors rounded-[8px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 group">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 border border-accent/30 rounded-[8px] flex items-center justify-center relative bg-[#1a0a0a]">
          <div className="absolute inset-0 border-2 border-accent rounded-[8px] animate-ping opacity-20"></div>
          <UploadCloud size={24} className="text-accent" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-accent rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
        <div>
          <h2 className="text-[20px] font-display font-bold text-white mb-1">
            Ready to analyze a new scan?
          </h2>
          <p className="text-[14px] text-text-secondary">
            Upload an OCT image — results in &lt;200ms
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-md w-full">
        <div className="border border-dashed border-[#333] group-hover:border-accent/50 bg-[#111] rounded-[6px] h-16 flex items-center justify-center text-[12px] text-text-muted transition-colors cursor-pointer">
          Drag & drop scan image here
        </div>
      </div>

      <div>
        <Link to="/dashboard/upload" className="bg-accent text-white font-medium rounded-full px-6 py-3 flex items-center gap-2 hover:opacity-90 shadow-[0_0_15px_rgba(230,58,46,0.2)]">
          <Plus size={16} /> New Analysis
        </Link>
      </div>
    </div>
  );
};
