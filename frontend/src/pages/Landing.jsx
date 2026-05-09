import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { Activity, ShieldCheck, Zap, ArrowRight, Eye, Brain, Lock, FileText, Star } from 'lucide-react';
import { ScrollScene } from '../components/3d/ScrollScene';
import { useScrollTransform } from '../hooks/useScrollTransform';

const Landing = () => {
  const { sceneOpacity } = useScrollTransform();

  const diseases = [
    { name: "CNV", full: "Choroidal Neovascularization", desc: "Abnormal vessel growth. Urgent intervention required." },
    { name: "DME", full: "Diabetic Macular Edema", desc: "Fluid accumulation in the macula due to diabetic retinopathy." },
    { name: "DRUSEN", full: "Drusen Deposits", desc: "Yellow deposits under the retina indicating potential AMD." },
    { name: "NORMAL", full: "Healthy Retina", desc: "No pathological findings detected in the retinal layers." }
  ];

  return (
    <div className="bg-primary min-h-screen text-text-primary overflow-x-hidden selection:bg-accent selection:text-white">
      
      {/* 3D Background */}
      <motion.div style={{ opacity: sceneOpacity }}>
        <ScrollScene />
      </motion.div>

      {/* Main Content Overlay */}
      <div className="relative z-10">
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/85 backdrop-blur-md border-b border-[#1f1f1f]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">OCT AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-[14px] font-normal text-white">
              <a href="#features" className="hover:text-accent transition-colors">Home</a>
              <a href="#diseases" className="hover:text-accent transition-colors">Features</a>
              <a href="#workflow" className="hover:text-accent transition-colors">Diseases</a>
              <a href="#workflow" className="hover:text-accent transition-colors">How It Works</a>
              <a href="#workflow" className="hover:text-accent transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="hidden md:block text-[14px] font-normal text-white hover:text-accent transition-colors">Log In</Link>
              <Link to="/dashboard" className="bg-accent text-white font-medium rounded-full px-6 py-2 hover:opacity-90 transition-all text-[14px]">
                Upload Scan
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 lg:pt-[180px] lg:pb-[120px] px-6 lg:px-10 max-w-[1280px] mx-auto grid grid-cols-12 gap-6 min-h-screen">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="col-span-12 lg:col-span-5 flex flex-col justify-center"
          >
            <h1 className="text-[72px] lg:text-[96px] font-display font-[800] leading-[0.95] tracking-tight mb-8">
              <motion.span variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="block font-light">Your OCT</motion.span>
              <motion.span variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="block">Scan, Read</motion.span>
              <motion.span variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="block text-accent">By AI</motion.span>
            </h1>
            
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-[14px] text-text-secondary leading-relaxed mb-10 max-w-sm">
              From upload to diagnosis, we analyze your retinal OCT scan and surface CNV, DME, and DRUSEN with Grad-CAM visual explainability.
            </motion.p>
            
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link to="/dashboard" className="bg-accent text-white font-medium rounded-full px-8 py-3 hover:opacity-90 transition-all text-center">
                Upload Scan
              </Link>
              <Link to="/dashboard" className="bg-transparent border border-[#333] text-white font-medium rounded-full px-8 py-3 hover:bg-white/5 transition-all text-center">
                View Sample Report
              </Link>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex gap-8 border-t border-[#1f1f1f] pt-8">
              <div>
                <div className="text-[11px] text-text-muted tracking-[0.08em] uppercase mb-1">Training Images</div>
                <div className="font-display font-bold text-white tabular-nums">84K+</div>
              </div>
              <div className="w-[1px] bg-[#1f1f1f]"></div>
              <div>
                <div className="text-[11px] text-text-muted tracking-[0.08em] uppercase mb-1">Accuracy</div>
                <div className="font-display font-bold text-white tabular-nums">97%+</div>
              </div>
              <div className="w-[1px] bg-[#1f1f1f]"></div>
              <div>
                <div className="text-[11px] text-text-muted tracking-[0.08em] uppercase mb-1">Inference</div>
                <div className="font-display font-bold text-white tabular-nums">&lt;200ms</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Hero Cards (over Three.js canvas) */}
          <div className="hidden lg:block col-span-7 relative pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute top-10 right-0 bg-[#111]/80 backdrop-blur-md border border-[#222] p-4 rounded-[6px] shadow-2xl pointer-events-auto"
              style={{ y: useScrollTransform().scrollYProgress }} // Slight scroll parallax
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <span className="text-[14px] font-bold text-white">CNV Detected</span>
              </div>
              <div className="text-[12px] text-text-secondary mb-1">Confidence: 94.7%</div>
              <div className="w-48 h-1 bg-[#222] rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[94.7%]"></div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              animate-y={{ y: [0, -8, 0] }} // Float animation
              className="absolute bottom-32 right-20 bg-[#111] border border-[#222] p-6 rounded-[6px] shadow-2xl pointer-events-auto"
            >
              <div className="text-[48px] font-display font-bold text-white leading-none mb-1 tabular-nums">230+</div>
              <div className="text-[14px] text-text-secondary leading-tight">Scans<br/>Analyzed</div>
            </motion.div>
          </div>
        </section>

        {/* Editorial Section */}
        <section className="py-[120px] px-6 lg:px-10 max-w-[1280px] mx-auto border-t border-[#1f1f1f]">
          <div className="max-w-4xl">
            <h2 className="text-[28px] lg:text-[40px] font-display font-medium leading-[1.2] text-white">
              We <span className="text-white">detect</span> and <span className="text-accent">surface AI insights</span> with precision at the core, ensuring every scan reveals <span className="text-accent">real retinal disease markers</span>.
            </h2>
          </div>
          <div className="mt-16 pt-8 border-t border-[#1f1f1f] max-w-xl">
            <p className="text-[14px] text-[#666] leading-relaxed">
              Our PyTorch-based inference engine operates entirely in-memory, providing millisecond latency without ever writing patient data to disk. Explanatory heatmaps are generated natively, giving clinicians unparalleled transparency into model behavior.
            </p>
          </div>
        </section>

        {/* Stats / Social Proof Row */}
        <section className="py-[60px] px-6 lg:px-10 max-w-[1280px] mx-auto grid md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, rotateX: 15, z: -30 }}
            whileInView={{ opacity: 1, rotateX: 0, z: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            style={{ perspective: 1000 }}
            className="relative bg-[#111] border border-[#1f1f1f] p-10 rounded-[8px] overflow-hidden group"
          >
            <div className="absolute inset-0 bg-accent mix-blend-multiply opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-[24px] font-display font-bold text-white mb-2">Available for research use</h3>
                <p className="text-[14px] text-text-secondary">Based in San Francisco, CA</p>
              </div>
              <div className="mt-12">
                <Link to="/dashboard" className="bg-accent text-white font-medium rounded-full px-6 py-2 inline-flex items-center gap-2 hover:opacity-90">
                  Upload Scan <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, rotateX: 15, z: -30 }}
            whileInView={{ opacity: 1, rotateX: 0, z: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{ perspective: 1000 }}
            className="bg-[#111] border border-[#1f1f1f] p-10 rounded-[8px] flex flex-col justify-between"
          >
            <div className="flex gap-1 text-accent mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
            </div>
            <div className="text-[72px] font-display font-bold text-white tabular-nums leading-none mb-6">84K+</div>
            <div>
              <p className="text-[16px] text-white italic mb-4">"The Grad-CAM overlays are indistinguishable from what our senior clinicians highlight manually."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center font-bold text-[14px] text-accent">SC</div>
                <div>
                  <div className="text-[14px] font-bold text-white">Dr. Sarah Chen</div>
                  <div className="text-[12px] text-text-secondary">Lead Ophthalmologist</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Services/Features Section */}
        <section id="diseases" className="py-[120px] px-6 lg:px-10 max-w-[1280px] mx-auto border-t border-[#1f1f1f]">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <span className="text-[11px] text-text-muted tracking-[0.08em] uppercase font-bold">Detection Classes</span>
          </div>
          <h2 className="text-[48px] font-display font-bold leading-[1.1] text-white mb-16 max-w-lg">
            4-Class Retinal<br/>AI Detection
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {diseases.map((disease, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, rotateX: 15, z: -30 }}
                whileInView={{ opacity: 1, rotateX: 0, z: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
                style={{ perspective: 1000 }}
                className="bg-[#111] border border-[#1f1f1f] p-8 rounded-[6px] hover:border-accent transition-colors group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px] group-hover:bg-accent/20 transition-colors"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-accent text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-[2px] font-bold">
                      {disease.name}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                  </div>
                  <h3 className="text-[20px] font-display font-bold text-white mb-4">{disease.full}</h3>
                  <div className="h-[1px] w-full bg-[#1f1f1f] mb-4"></div>
                  <p className="text-[14px] text-text-secondary mb-8 h-10">{disease.desc}</p>
                  <Link to="/dashboard" className="text-[14px] font-bold text-white group-hover:text-accent transition-colors inline-flex items-center gap-2">
                    Learn More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#1f1f1f] bg-[#0a0a0a] py-12 px-6 lg:px-10">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Activity size={20} className="text-accent" />
              <span className="font-display font-bold text-[16px] text-white">OCT AI</span>
            </div>
            <div className="text-[12px] text-text-muted flex items-center gap-2 max-w-xl text-center md:text-right">
              <ShieldCheck size={14} className="shrink-0" />
              <span>Not intended for clinical use without physician oversight. For research and educational purposes only.</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
