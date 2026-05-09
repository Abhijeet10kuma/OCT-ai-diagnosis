import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ChevronLeft, ChevronRight, Calendar, ActivitySquare } from 'lucide-react';
import usePredictionStore from '../store/predictionStore';

const History = () => {
  const { history, fetchHistory, isLoading, generateReport } = usePredictionStore();
  const [page, setPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchHistory(page * limit, limit);
  }, [fetchHistory, page]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold mb-2">Scan History</h2>
        <p className="text-gray-400">View past predictions and generate reports.</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 font-medium text-gray-400 text-sm">Date</th>
                <th className="p-4 font-medium text-gray-400 text-sm">File Name</th>
                <th className="p-4 font-medium text-gray-400 text-sm">Prediction</th>
                <th className="p-4 font-medium text-gray-400 text-sm">Confidence</th>
                <th className="p-4 font-medium text-gray-400 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">Loading history...</td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No scans found.</td>
                </tr>
              ) : (
                history.map((item, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={item.prediction_id} 
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar size={14} className="text-gray-500" />
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <ActivitySquare size={14} className="text-gray-500" />
                        <span className="truncate max-w-[150px]" title={item.original_filename}>
                          {item.original_filename}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        item.predicted_class === 'NORMAL' 
                          ? 'bg-success/10 text-success border-success/20' 
                          : 'bg-warning/10 text-warning border-warning/20'
                      }`}>
                        {item.predicted_class}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium">
                      {item.confidence.toFixed(1)}%
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => generateReport(item.prediction_id, item.doctor_notes || '')}
                        className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary transition-colors inline-flex items-center justify-center border border-white/5 hover:border-primary/30"
                        title="Download Report"
                      >
                        <Download size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/5">
          <button 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-gray-400">Page {page + 1}</span>
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={history.length < limit}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
