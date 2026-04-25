import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Roast from './pages/Roast';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-brand-purple/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/roast" element={<Roast />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;