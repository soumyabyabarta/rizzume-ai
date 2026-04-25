import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ScanSearch, Map, Flame } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-[#09090B] min-h-screen text-[#FAFAFA] font-sans selection:bg-[#DFE104] selection:text-black overflow-hidden pt-20 flex flex-col justify-between relative">
      
      {/* 10CR LEVEL BACKGROUND TYPOGRAPHY (Spaced Apart & Premium) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <h1 className="absolute top-[-5%] left-[-2%] text-[30vw] font-black text-white opacity-[0.03] leading-none tracking-tighter">78%</h1>
        <h1 className="absolute top-[45%] right-[-5%] text-[30vw] font-black text-white opacity-[0.03] leading-none tracking-tighter hidden md:block">92%</h1>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10 flex-1">
        
        {/* HERO KINETIC TYPOGRAPHY */}
        <div className="pt-12 pb-20">
          <motion.h1 
            className="text-5xl md:text-[clamp(4rem,8vw,8rem)] font-black leading-[1.1] md:leading-[0.85] tracking-tighter uppercase"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Your Resume <br className="hidden sm:block" />
            Isn’t Bad <br className="hidden sm:block" />
            <span className="text-[#DFE104]">It’s Invisible</span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 md:mt-8 text-base md:text-xl text-gray-400 max-w-xl leading-relaxed font-medium"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          >
            Break through the ATS filters. Stop getting ghosted. Turn your career history into a high-impact, kinetic document that demands attention.
          </motion.p>

          <motion.div className="mt-10 md:mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Link to="/upload" className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-5 bg-[#DFE104] text-black font-black uppercase tracking-wide text-lg border-2 border-transparent hover:bg-[#c9cb03] transition-colors rounded-none">
              Fix My Resume
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* INFINITE MARQUEE STRIP */}
      <div className="w-full bg-[#DFE104] py-3 overflow-hidden border-y-2 border-black transform -rotate-1 scale-105 my-10 relative z-10 shadow-lg">
        <motion.div 
          className="flex whitespace-nowrap text-black font-black uppercase tracking-widest text-sm md:text-base"
          animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {Array(10).fill("ATS SCORE 99+ • SKILL MATCH • AI FIX • GET HIRED • ").map((text, i) => (
            <span key={i} className="mx-4">{text}</span>
          ))}
        </motion.div>
      </div>

      {/* GEN-Z BENTO GRIDS SECTION (Top 3 Features) */}
      <div className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
        <h2 className="text-4xl md:text-[clamp(3rem,5vw,4rem)] font-black leading-[1.1] md:leading-[0.9] tracking-tighter uppercase mb-10 md:mb-12">
          Engineered For <br className="hidden md:block" /> Impact
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: ATS Score */}
          <div className="bg-[#18181B] p-8 md:p-10 border border-[#27272A] rounded-none hover:border-[#DFE104] transition-colors group relative overflow-hidden">
            <ScanSearch size={32} className="text-[#DFE104] mb-8 md:mb-12 group-hover:scale-110 transition-transform relative z-10" />
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tight relative z-10">ATS Vibe Check</h3>
            <p className="text-gray-400 font-medium leading-relaxed text-sm relative z-10">
              We run your resume through our ruthless ATS scanner. Find out if your keywords are bussin' or if you're getting instantly ghosted by corporate bots.
            </p>
          </div>

          {/* Feature 2: AI Roadmap */}
          <div className="bg-[#18181B] p-8 md:p-10 border border-[#27272A] rounded-none hover:border-[#DFE104] transition-colors group relative overflow-hidden">
            <Map size={32} className="text-[#DFE104] mb-8 md:mb-12 group-hover:scale-110 transition-transform relative z-10" />
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tight relative z-10">30-Day Lock In</h3>
            <p className="text-gray-400 font-medium leading-relaxed text-sm relative z-10">
              Stop gatekeeping your own potential. We generate a custom 30-day AI roadmap to level up your missing skills and make your profile un-rejectable.
            </p>
          </div>

          {/* Feature 3: Roast Mode (Yellow Accent) */}
          <div className="bg-[#DFE104] p-8 md:p-10 text-black border border-[#DFE104] rounded-none group hover:bg-[#c9cb03] transition-colors relative overflow-hidden">
            <Flame size={32} className="text-black mb-8 md:mb-12 group-hover:scale-110 transition-transform relative z-10" />
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tight relative z-10">Roast Mode 😈</h3>
            <p className="text-black/80 font-bold leading-relaxed text-sm relative z-10">
              Zero sugar-coating. Let our AI violently humble your generic bullet points before a real human recruiter does. Get cooked, apply fixes, get hired.
            </p>
          </div>
        </div>
      </div>

      {/* YELLOW FOOTER (Line Removed) */}
      <footer className="w-full py-8 mt-10 relative z-10">
        <div className="flex justify-center items-center">
          <p className="text-[#DFE104] font-black tracking-widest uppercase text-xs md:text-sm">
            @Soumya || 2026
          </p>
        </div>
      </footer>
      
    </div>
  );
};

export default Home;