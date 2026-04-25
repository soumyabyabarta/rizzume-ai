import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Sparkles, Flame, Lightbulb, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('rizzume_data');
    if (!storedData) { navigate('/upload'); return; }
    
    const parsedData = JSON.parse(storedData);
    setResumeData(parsedData);

    // AI Insights call
    axios.post('http://localhost:5000/api/ai/feedback', {
      documentId: parsedData.documentId, 
      jobDescription: parsedData.targetJob, 
      mode: 'professional'
    })
    .then(res => setAiInsights(res.data.data))
    .catch(console.error);
    
  }, [navigate]);


  if (!resumeData) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <p className="text-[#DFE104] font-black animate-pulse uppercase tracking-widest">Initialising AI Brain...</p>
      </div>
    );
  }

  const mlData = resumeData?.ml_analysis || resumeData?.mlAnalysis || {};
  
  const atsScore = mlData?.ats_score || mlData?.atsScore || 0;
  const matchedSkills = mlData?.matched_skills || mlData?.matchedSkills || [];
  const missingSkills = mlData?.missing_skills || mlData?.missingSkills || [];

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] pt-24 pb-20 font-sans selection:bg-[#DFE104] selection:text-black">
      <div className="w-full max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* SaaS ATS Card - Dark */}
            <motion.div className="bg-[#18181B] p-8 rounded-[20px] shadow-sm border border-[#27272A] relative overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="absolute -bottom-10 right-0 text-[180px] font-black text-[#27272A] opacity-20 leading-none select-none pointer-events-none">{atsScore}</div>
              <h2 className="text-xl font-bold text-white mb-2 relative z-10">ATS Compatibility Score</h2>
              <div className="text-[80px] font-black text-[#DFE104] leading-none tracking-tighter mb-4 relative z-10 drop-shadow-sm">{atsScore}%</div>
              <p className="text-gray-400 text-sm max-w-md relative z-10 font-medium">Your resume analysis is powered by a custom ML engine trained on 2400+ industry records.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Intelligence */}
              <motion.div className="bg-[#18181B] p-8 rounded-[20px] shadow-sm border border-[#27272A] flex flex-col" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h3 className="text-lg font-bold text-white mb-6">Skills Intelligence</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {matchedSkills.length > 0 ? matchedSkills.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 bg-green-900/20 text-green-400 text-xs font-bold rounded-full flex items-center gap-1 border border-green-800/50"><CheckCircle2 size={12}/> {s}</span>
                  )) : <p className="text-gray-600 text-xs italic">No matching skills found.</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.length > 0 ? missingSkills.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 bg-red-900/20 text-red-400 text-xs font-bold rounded-full flex items-center gap-1 border border-red-800/50"><AlertCircle size={12}/> {s}</span>
                  )) : <p className="text-gray-600 text-xs italic">No missing skills detected.</p>}
                </div>
              </motion.div>

              {/* AI Suggestions */}
              <motion.div className="bg-[#18181B] p-8 rounded-[20px] shadow-sm border border-[#27272A] flex flex-col justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div>
                  <h3 className="text-lg font-bold text-white mb-6">AI Suggestions</h3>
                  <div className="space-y-4">
                    {aiInsights?.improvement_suggestions?.slice(0,2).map((insight, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="mt-1"><Sparkles size={16} className="text-[#DFE104]"/></div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{insight.issue}</h4>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{insight.fix}</p>
                        </div>
                      </div>
                     )) || <p className="text-sm text-gray-500 animate-pulse">Rizzume AI is analyzing your profile...</p>}
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/roadmap')}
                  className="mt-8 w-full py-3 bg-[#27272A] hover:bg-[#3f3f46] text-white font-black uppercase tracking-widest text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Map size={14} /> Lock In (30-Day Roadmap)
                </button>
              </motion.div>
            </div>

            {/* ROAST MODE PROMO */}
            <motion.div 
              className="bg-[#09090B] p-8 md:p-12 rounded-none border-l-4 border-[#DFE104] relative group overflow-hidden mt-2 flex flex-col items-start"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 text-[#DFE104] mb-4 text-xs font-black uppercase tracking-widest relative z-10">
                <Flame size={16} /> Signature Feature
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 relative z-10">Roast Mode</h2>
              <div className="bg-[#DFE104] text-black font-black text-xl md:text-2xl uppercase tracking-tighter p-2 inline-block transform -rotate-2 relative z-10 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] group-hover:rotate-0 transition-transform">
                EXPOSE THE GAPS IN YOUR CAREER.
              </div>
              <button 
                onClick={() => navigate('/roast')}
                className="mt-8 px-8 py-4 bg-[#DFE104] text-[#09090B] font-black uppercase tracking-tighter text-lg shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] transition-all relative z-10 flex items-center gap-2"
              >
                <Flame size={20} /> Get Cooked 😈
              </button>
            </motion.div>

          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#18181B] p-8 rounded-[20px] shadow-sm border border-[#27272A] flex flex-col items-center text-center">
              <h3 className="text-lg font-bold text-white mb-6 w-full text-left">Overall Health</h3>
              <div className="text-5xl font-black text-[#DFE104] tracking-tighter">
                {atsScore > 80 ? 'A+' : atsScore > 60 ? 'B+' : 'C-'}
              </div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2 mb-2">Based on ML Logic</div>
            </div>

            <div className="bg-[#18181B] p-6 rounded-[20px] border-l-4 border-[#DFE104] border border-[#27272A]">
              <div className="flex items-center gap-2 font-black text-[10px] text-[#DFE104] uppercase tracking-widest mb-3">
                 <Lightbulb size={14} /> Daily Tip
              </div>
              <p className="text-sm text-gray-300 font-medium leading-relaxed">Ensure your contact info is clean. Recruiters look for your GitHub and LinkedIn in the first 2 seconds.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;