import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Flame, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Roast = () => {
  const navigate = useNavigate();
  const [roastContent, setRoastContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem('rizzume_data');
    if (!storedData) { navigate('/upload'); return; }
    const parsedData = JSON.parse(storedData);

    const fetchRoast = async () => {
      try {
        const response = await axios.post('https://rizzume-backend.onrender.com/api/ai/feedback', {
          documentId: parsedData.documentId, jobDescription: parsedData.targetJob, mode: 'roast' 
        });
        setRoastContent(response.data.data);
      } catch (error) {
        setErrorMsg("Arre bhai bhai bhai... server ki hawa nikal gayi! 💀 Too many Gen-Z kids are trying to get roasted right now. Thoda wait kar le mere bhai!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoast();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-[#09090B] flex flex-col items-center justify-center text-[#DFE104] selection:bg-[#FAFAFA] selection:text-black">
        <Loader2 className="animate-spin mb-6" size={64} />
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 text-center px-4">Toh chaliye shuru karte hain...</h2>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Bina kisi b@ckchodi ke 🔪🔥</p>
      </div>
    );
  }

  if (errorMsg || !roastContent) {
    return (
      <div className="w-full h-screen bg-[#09090B] flex flex-col items-center justify-center text-white text-center px-6">
        <AlertTriangle size={64} className="text-[#FF3333] mb-4"/>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Gajab Beizzati Hai!</h2>
        <p className="text-gray-400 max-w-md leading-relaxed">{errorMsg || "No Data found. Go back and upload again."}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-8 px-8 py-4 bg-[#DFE104] text-[#09090B] font-black uppercase tracking-tighter text-lg hover:bg-[#c9cb03] transition-colors rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
        >
           Retry Sequence
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] font-sans pt-24 pb-32 selection:bg-[#DFE104] selection:text-black">
      <div className="w-full max-w-7xl mx-auto px-6">
        
        {/* Navigation & Warning */}
        <div className="flex items-center justify-between mb-16">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors">
            <ArrowLeft size={16} /> Retreat to Safety
          </button>
          <div className="flex items-center gap-2 text-[#FF3333] font-black uppercase tracking-widest text-[10px] border border-[#FF3333] px-3 py-1">
            <Flame size={12} /> Brutal Mode Active
          </div>
        </div>

        {/* KINETIC HERO */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <h1 className="text-[clamp(4rem,10vw,9rem)] font-black uppercase leading-[0.85] tracking-tighter mb-8">
            Roast <br />
            <span className="text-[#DFE104]">Mode.</span>
          </h1>
          <div className="bg-[#18181B] border-l-4 border-[#DFE104] p-6 max-w-2xl">
             <p className="text-xl font-bold uppercase tracking-tight text-gray-300 leading-relaxed">
               "{roastContent.overall_verdict || "Kahan se aate hain ye log? Let's fix this disaster."}"
             </p>
          </div>
        </motion.div>

        {/* BRUTALIST ROAST GRID (Handling Long Text) */}
        <div className="grid grid-cols-1 gap-8">
          {roastContent.roast_points?.map((point, idx) => (
            <motion.div 
              key={idx}
              className="bg-[#18181B] border-2 border-[#27272A] p-8 md:p-10 rounded-none hover:border-[#DFE104] transition-colors group relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            >
              <div className="absolute -top-10 -right-10 text-[200px] font-black text-[#27272A] opacity-20 pointer-events-none leading-none">"</div>
              
              <div className="mb-6 relative z-10">
                <span className="text-[#DFE104] font-black uppercase tracking-widest text-xs border border-[#DFE104] px-3 py-1">
                  {point.section}
                </span>
              </div>
              
              <div className="relative z-10">
                <div className="bg-[#DFE104] text-[#09090B] font-black text-xl md:text-2xl uppercase tracking-tighter p-2 inline-block transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] mb-6 group-hover:rotate-0 transition-transform">
                  THIS SECTION SAYS NOTHING.
                </div>
                
                <p className="text-white text-base md:text-lg font-medium leading-relaxed mt-4 whitespace-pre-wrap">
                  "{point.roast}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ACTION CTA (Redirects to Roadmap) */}
        <motion.div className="mt-24 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Done crying? Let's fix it.</h2>
          <button 
            onClick={() => navigate('/roadmap')}
            className="inline-block px-12 py-6 bg-[#DFE104] text-[#09090B] font-black uppercase text-2xl tracking-tighter rounded-none shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transition-all"
          >
            Apply AI Optimizations
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default Roast;