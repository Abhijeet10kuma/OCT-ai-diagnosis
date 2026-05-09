import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, CheckCircle, FileText, Download, ActivitySquare } from 'lucide-react';
import usePredictionStore from '../store/predictionStore';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [showGradCam, setShowGradCam] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState('');
  
  const { predict, currentResult, isLoading, generateReport, error } = usePredictionStore();
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile.type.includes('image/')) return;
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const handlePredict = async () => {
    if (!file) return;
    await predict(file);
  };

  const clearUpload = () => {
    setFile(null);
    setPreview('');
    usePredictionStore.getState().clearResult();
  };

  const handleGenerateReport = async () => {
    if (!currentResult) return;
    await generateReport(currentResult.prediction_id, doctorNotes);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold mb-2">Analysis Hub</h2>
          <p className="text-gray-400">Upload OCT scans for immediate AI inference and Grad-CAM visualization.</p>
        </div>
        {currentResult && (
          <button onClick={clearUpload} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
            <UploadCloud size={16} /> New Scan
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!currentResult && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`glass-panel border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
              dragActive ? 'border-primary bg-primary/5' : 'border-white/10'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="max-w-md mx-auto space-y-6">
                <div className="relative rounded-2xl overflow-hidden border border-white/10">
                  <img src={preview} alt="Preview" className="w-full h-auto" />
                  <button 
                    onClick={clearUpload}
                    className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white backdrop-blur-md transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <button onClick={handlePredict} className="btn-primary w-full py-4 text-lg font-bold shadow-xl">
                  Run AI Inference
                </button>
              </div>
            ) : (
              <div className="max-w-md mx-auto py-12">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Drag and drop your scan here</h3>
                <p className="text-gray-400 mb-8">Supports JPEG, PNG (Max 10MB)</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleChange}
                  className="hidden"
                />
                <button 
                  onClick={() => inputRef.current.click()}
                  className="btn-secondary w-full"
                >
                  Browse Files
                </button>
              </div>
            )}
          </motion.div>
        )}

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel rounded-3xl p-24 text-center flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ActivitySquare size={24} className="text-primary animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Analyzing Retinal Layers...</h3>
              <p className="text-gray-400 text-sm">Running ResNet50 inference and generating heatmaps</p>
            </div>
          </motion.div>
        )}

        {currentResult && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Left: Images */}
            <div className="space-y-4">
              <div className="glass-panel p-2 rounded-2xl relative group overflow-hidden">
                <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden">
                  <img 
                    src={showGradCam ? currentResult.gradcam_overlay : currentResult.original_image} 
                    alt="Scan Result" 
                    className="w-full h-full object-contain transition-all duration-500"
                  />
                  
                  {/* Toggle */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 border border-white/10 shadow-xl">
                    <span className={`text-xs font-medium ${!showGradCam ? 'text-white' : 'text-gray-500'}`}>Original</span>
                    <button 
                      onClick={() => setShowGradCam(!showGradCam)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${showGradCam ? 'bg-primary' : 'bg-gray-600'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${showGradCam ? 'left-7' : 'left-1'}`}></div>
                    </button>
                    <span className={`text-xs font-medium ${showGradCam ? 'text-white' : 'text-gray-500'}`}>Grad-CAM</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-400">
                <span className="text-primary font-medium">Inference Time:</span> {currentResult.inference_time_ms}ms
              </p>
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                {currentResult.predicted_class !== 'NORMAL' && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-warning/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                )}
                <h3 className="text-sm font-medium text-gray-400 mb-1">AI Prediction</h3>
                <div className="flex items-end gap-4 mb-6">
                  <h2 className={`text-4xl font-display font-bold ${currentResult.predicted_class === 'NORMAL' ? 'text-success' : 'text-warning'}`}>
                    {currentResult.predicted_class}
                  </h2>
                  <div className="mb-1 bg-white/5 px-3 py-1 rounded-full border border-white/10 text-sm font-medium">
                    {currentResult.confidence.toFixed(1)}% Confidence
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(currentResult.probabilities).map(([cls, prob]) => (
                    <div key={cls}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-300">{cls}</span>
                        <span className="text-gray-400">{(prob * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${prob * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${cls === 'NORMAL' ? 'bg-success' : 'bg-primary'}`}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {currentResult.confidence < 70 && (
                   <div className="mt-6 p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-3">
                     <AlertCircle className="text-warning shrink-0 mt-0.5" size={18} />
                     <p className="text-sm text-warning font-medium leading-relaxed">Low confidence — recommend clinical review by a specialist.</p>
                   </div>
                )}
              </div>

              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FileText size={18} /> Clinical Report
                </h3>
                <textarea 
                  className="input-field min-h-[120px] mb-4 resize-none"
                  placeholder="Add physician notes or clinical observations here..."
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                ></textarea>
                <div className="flex gap-4">
                  <button 
                    onClick={handleGenerateReport}
                    className="btn-primary flex-1 flex justify-center items-center gap-2"
                  >
                    <Download size={18} /> Download PDF
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                <AlertCircle size={12} /> {currentResult.disclaimer || "AI predictions should be verified by a qualified clinical professional."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Upload;
