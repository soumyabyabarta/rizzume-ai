import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Target, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileValidation = (selectedFile) => {
    if (selectedFile) {
      if (selectedFile.size > 1048576) {
        alert("Bro, is this a resume or a whole biography?...Keep it under 1MB ");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) { alert("Drop a file first! 🚩"); return; }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const analysisData = {
        documentId: response.data.data.documentId,
        filename: response.data.data.filename,
        targetJob: jobDescription || "Software Engineer",
        mlAnalysis: response.data.data.ml_analysis
      };
      localStorage.setItem('rizzume_data', JSON.stringify(analysisData));
      navigate('/dashboard');
    } catch (error) {
      alert("Error processing file!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] font-sans pt-24 pb-20 selection:bg-[#DFE104] selection:text-black">
      <div className="w-full max-w-6xl mx-auto px-6">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-[clamp(3rem,6vw,6rem)] font-black text-white leading-[0.9] tracking-tighter uppercase">
            Drop It <br />
            <span className="text-gray-500">Optimize It</span>
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 relative">
          
          <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 overflow-hidden pointer-events-none select-none opacity-5 z-0">
            <h1 className="text-[12vw] font-black text-white leading-none whitespace-nowrap">UPLOAD • ANALYZE</h1>
          </div>

          {/* LEFT: Dark SaaS Card */}
          <motion.div 
            className="flex-1 bg-[#18181B] p-8 rounded-[20px] shadow-sm border border-[#27272A] z-10 relative"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          >
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">   Source File</p>
            <div 
              className="w-full h-[350px] border-2 border-dashed border-gray-700 rounded-[20px] flex flex-col items-center justify-center p-8 hover:bg-[#27272A]/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => handleFileValidation(e.target.files[0])} accept=".pdf,.docx,.txt" className="hidden" />
              <div className="w-16 h-16 rounded-full bg-[#27272A] flex items-center justify-center text-[#DFE104] mb-6">
                <UploadCloud size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Drag & drop your resume</h3>
              <p className="text-gray-400 text-sm mb-6 text-center">Supports PDF, DOCX, and TXT up to 1MB.</p>
              <button className="px-6 py-2 bg-[#DFE104] text-black font-black uppercase tracking-tighter rounded-full text-sm hover:bg-[#c9cb03] transition">
                {file ? file.name : "Browse Files"}
              </button>
            </div>
          </motion.div>

          {/* RIGHT: Kinetic Dark Card */}
          <motion.div 
            className="flex-1 bg-[#09090B] p-8 rounded-none border-l-4 border-[#DFE104] flex flex-col z-10 relative shadow-2xl"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <p className="text-xs font-black text-[#DFE104] uppercase tracking-widest">Target Parameters</p>
              <Target size={20} className="text-[#DFE104]" />
            </div>
            <textarea 
              value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here. The kinetic engine will align your core competencies against these parameters..."
              className="w-full flex-1 bg-transparent border-none outline-none resize-none text-gray-300 placeholder-gray-600 text-sm leading-relaxed"
            ></textarea>
            <div className="mt-4 border-b border-gray-800 pb-2 flex justify-end">
               <span className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">0 / 5000 Chars</span>
            </div>
          </motion.div>
        </div>

        <motion.div className="mt-8 flex justify-end relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <button 
            onClick={handleAnalyze} disabled={isLoading}
            className="group flex items-center gap-4 px-10 py-5 bg-[#DFE104] text-[#09090B] font-black uppercase text-xl md:text-2xl tracking-tight rounded-none shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50"
          >
            {isLoading ? <><Loader2 className="animate-spin" /> Processing...</> : <>Initiate Sequence <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" /></>}
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default Upload;