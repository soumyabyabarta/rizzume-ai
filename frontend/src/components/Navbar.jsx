import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full py-6 px-6 md:px-12 flex items-center justify-between absolute top-0 left-0 z-50 text-[#FAFAFA]">
      {/* Consistent Header Logo: Rizzume AI */}
      <Link to="/" className="text-2xl font-black tracking-tighter italic flex items-center gap-2 uppercase">
        <Zap fill="#DFE104" stroke="none" size={24} />
        Rizzume <span className="text-[#DFE104]">AI</span>
      </Link>
    </nav>
  );
};

export default Navbar;