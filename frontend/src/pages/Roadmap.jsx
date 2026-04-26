import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Loader2, AlertTriangle, Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Roadmap = () => {
  const navigate = useNavigate();
  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem('rizzume_data');
    if (!storedData) { navigate('/upload'); return; }
    const parsedData = JSON.parse(storedData);
    
    const fetchRoadmap = async () => {
      try {
        const response = await axios.post('https://rizzume-backend.onrender.com/api/ai/roadmap', {
          targetJob: parsedData.targetJob || "Software Engineer",
          missingSkills: parsedData.mlAnalysis?.missing_skills || []
        }, { timeout: 60000 });
        setRoadmapData(response.data.data);
      } catch (error) {
        setErrorMsg("Bruh, the servers are literally fighting for their lives right now. Too many of y'all are trying to lock in at once. Give it a sec and retry! 💀🔥");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoadmap();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-[#09090B] flex flex-col items-center justify-center text-white selection:bg-[#DFE104] selection:text-black px-6 text-center">
        <Loader2 className="animate-spin text-[#DFE104] mb-6" size={64} />
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Cooking your Roadmap...</h2>
        <p className="text-gray-400 font-medium max-w-md leading-relaxed">
          Let us cook…this ain’t instant, it’s worth it 🔥 Give it 15 seconds! 💀
        </p>
      </div>
    );
  }

  if (errorMsg || !roadmapData) return (
     <div className="w-full h-screen bg-[#09090B] flex flex-col items-center justify-center text-white text-center px-6">
       <AlertTriangle size={64} className="text-[#FF3333] mb-4"/>
       <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">We got cooked.</h2>
       <p className="text-gray-400 max-w-md leading-relaxed">{errorMsg || "No Data found. Go back and upload again."}</p>
       <button 
         onClick={() => window.location.reload()} 
         className="mt-8 px-8 py-4 bg-[#DFE104] text-[#09090B] font-black uppercase tracking-tighter text-lg hover:bg-[#c9cb03] transition-colors rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
       >
          Retry Sequence
       </button>
     </div>
  );

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] font-sans selection:bg-[#DFE104] selection:text-black">
      
      {/* KINETIC HEADER */}
      <div className="w-full pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#18181B] transform skew-x-12 translate-x-32 border-l-2 border-[#27272A] z-0"></div>
        
        <div className="w-full max-w-7xl mx-auto relative z-10">
          <motion.h1 
            className="text-[clamp(4rem,10vw,8rem)] font-black text-[#DFE104] uppercase leading-[0.85] tracking-tighter"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            Your Next <br/>
            <span className="text-white">30 Days</span>
          </motion.h1>
          <motion.p 
            className="mt-8 text-gray-400 max-w-lg text-lg font-medium leading-relaxed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            Execute the playbook. Build momentum. Secure the interviews. This is your high-impact timeline based on missing core competencies.
          </motion.p>

          <motion.div className="mt-20 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
             <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Mastery Progress</span>
                <span className="text-6xl font-black text-[#DFE104] leading-none tracking-tighter">0%</span>
             </div>
             <div className="w-full h-4 bg-gray-800 flex">
                <div className="h-full bg-[#DFE104] w-[5%] border-r-4 border-black"></div>
             </div>
          </motion.div>
        </div>
      </div>

      {/* ROADMAP CONTENT (DARK) */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        
        {roadmapData.phases?.map((phase, pIdx) => (
          <div key={pIdx} className="mb-20">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-10 h-10 bg-[#DFE104] text-[#09090B] rounded-full flex items-center justify-center font-black text-sm tracking-tighter">
                  W{pIdx + 1}
               </div>
               <h2 className="text-3xl font-bold text-white">{phase.phase_title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {phase.days?.slice(0, 3).map((day, dIdx) => (
                <motion.div 
                  key={dIdx} 
                  className="bg-[#18181B] p-8 rounded-[20px] border border-[#27272A] hover:border-[#DFE104] transition-colors flex flex-col"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: dIdx * 0.1 }}
                >
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{day.day}</p>
                  <h3 className="text-xl font-bold text-white mb-6 leading-tight">{day.title}</h3>
                  
                  <div className="space-y-4 flex-1">
                    {day.skills_to_learn?.slice(0, 3).map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3">
                         {sIdx === 0 ? <CheckSquare size={18} className="text-[#DFE104] mt-0.5 shrink-0" /> : <Square size={18} className="text-gray-600 mt-0.5 shrink-0" />}
                         <span className={`text-sm font-medium ${sIdx === 0 ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{skill}</span>
                      </div>
                    ))}
                  </div>

                  {/* Task and Focus buttons removed from here */}
                  
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* LOCKED PHASE */}
        <div className="mb-20 opacity-40">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-10 h-10 bg-[#27272A] text-gray-500 rounded-full flex items-center justify-center font-black text-sm tracking-tighter">W4</div>
               <h2 className="text-3xl font-bold text-gray-600">Advanced Alignment</h2>
            </div>
            <div className="bg-[#18181B] p-12 rounded-[20px] border border-[#27272A] border-dashed flex flex-col items-center justify-center text-center">
                <Lock size={32} className="text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-500 mb-2">Complete previous sprints to unlock</h3>
                <p className="text-sm font-medium text-gray-600">Targeting & Keyword Injection</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Roadmap;