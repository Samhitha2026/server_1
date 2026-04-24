import React, { useState } from 'react';
import { 
  Shield, MapPin, Sun, Info, Check, Clock, 
  Trash2, Lightbulb, TreePine, Droplets, Grid, 
  Send, Camera, Smartphone, Mail, Activity,
  ChevronDown, Search, Zap, Star, Layout,
  ArrowRight, Globe, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Global Types ---
type UserRole = 'citizen' | 'authority' | null;

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('citizen');
  const [view, setView] = useState<'submit' | 'track' | 'dashboard'>('submit');

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="mesh-bg" />
      
      <Navbar view={view} setView={setView} />
      
      <main className="max-w-[1400px] mx-auto px-8 py-16">
        <AnimatePresence mode="wait">
          {view === 'submit' && <CitizenEliteHub key="submit" />}
          {view === 'track' && <div className="py-32 text-center opacity-30 font-bold uppercase tracking-[0.3em]">Protocol Records Restricted</div>}
        </AnimatePresence>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em]">
          CityVoice Protocol • Elite Governance Architecture • v4.0.1
        </p>
      </footer>
    </div>
  );
};

// --- Navbar (Elite Design) ---
const Navbar = ({ view, setView }: any) => (
  <nav className="sticky top-0 z-50 w-full px-10 py-6 flex items-center justify-between backdrop-blur-2xl border-b border-white/5">
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className="bg-primary p-3 rounded-[1.25rem] shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform">
        <Shield className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-black tracking-tighter leading-none">CityVoice</span>
        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-1">Core Protocol</span>
      </div>
    </div>

    <div className="bg-white/5 p-1.5 rounded-2xl border border-white/5 flex items-center gap-1 shadow-inner">
      <NavBtn label="Submit Complaint" active={view === 'submit'} onClick={() => setView('submit')} />
      <NavBtn label="My Records" active={view === 'track'} onClick={() => setView('track')} />
      <NavBtn label="Analytics" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
    </div>

    <div className="flex items-center gap-4">
      <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all">
        <Sun className="w-5 h-5 text-slate-400" />
      </button>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-700 border border-white/20 flex-center font-bold text-xs">SV</div>
    </div>
  </nav>
);

const NavBtn = ({ label, active, onClick }: any) => (
  <button onClick={onClick} className={`nav-btn ${active ? 'active' : 'hover:text-white'}`}>
    {label}
  </button>
);

// --- Citizen Elite Hub ---
const CitizenEliteHub = () => {
  const [activeCategory, setActiveCategory] = useState('Roads');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-24">
      
      {/* Hero Section (Elite) */}
      <section className="text-center space-y-8 py-10 relative">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Next-Gen Reporting Interface</span>
        </div>
        
        <h1 className="text-8xl font-black tracking-tighter leading-[0.9] premium-text">
          Make Your City <br />
          <span className="text-primary italic">Hear Your Voice.</span>
        </h1>
        
        <p className="text-slate-400 text-xl font-medium max-w-3xl mx-auto leading-relaxed">
          The world's most advanced infrastructure resolution protocol. Seamlessly bridge the gap between citizens and authorities with AI-driven intelligence.
        </p>

        <div className="flex items-center justify-center gap-6 pt-6">
          <FeaturePill icon={<Shield />} label="End-to-End Encryption" />
          <FeaturePill icon={<Globe />} label="Global Standards" />
          <FeaturePill icon={<Zap />} label="Instant AI Routing" />
        </div>
      </section>

      {/* Interface Core */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: The Form Engine */}
        <div className="lg:col-span-8 elite-card p-12 md:p-16 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
              <div className="w-2 h-8 bg-primary rounded-full" />
              Initialize Report
            </h2>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">
              Protocol UID: 882-AXV
            </div>
          </div>

          <form className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormGroup label="Identity Name" ph="Enter your legal name" icon={<User size={16}/>} />
              <FormGroup label="Protocol Endpoint" ph="yourname@domain.com" icon={<Mail size={16}/>} />
            </div>

            <FormGroup label="Case Title" ph="Define the infrastructure anomaly..." icon={<FileText size={16}/>} />

            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Anomaly Domain (Category)</label>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <NodeBtn icon={<MapPin size={24}/>} label="Roads" active={activeCategory === 'Roads'} onClick={() => setActiveCategory('Roads')} />
                <NodeBtn icon={<Trash2 size={24}/>} label="Sanitation" active={activeCategory === 'Sanitation'} onClick={() => setActiveCategory('Sanitation')} />
                <NodeBtn icon={<Lightbulb size={24}/>} label="Lighting" active={activeCategory === 'Lighting'} onClick={() => setActiveCategory('Lighting')} />
                <NodeBtn icon={<TreePine size={24}/>} label="Greenery" active={activeCategory === 'Greenery'} onClick={() => setActiveCategory('Greenery')} />
                <NodeBtn icon={<Droplets size={24}/>} label="Water" active={activeCategory === 'Water'} onClick={() => setActiveCategory('Water')} />
                <NodeBtn icon={<Grid size={24}/>} label="Other" active={activeCategory === 'Other'} onClick={() => setActiveCategory('Other')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Priority Level</label>
                 <div className="relative group">
                    <select className="elite-input w-full appearance-none pr-12">
                      <option>Medium Priority</option>
                      <option>High Urgency</option>
                      <option>Critical Failure</option>
                      <option>Low Importance</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                 </div>
              </div>
              <FormGroup label="GPS Coordinates" ph="Street, Sector or Landmark..." icon={<Navigation size={16}/>} />
            </div>

            <div className="pt-6">
              <button type="submit" className="w-full bg-primary hover:bg-blue-500 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.4em] transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 group">
                Establish Protocol <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Insights & Stats */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Progress Guide */}
          <div className="elite-card p-10 space-y-8">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              The Flow
            </h3>
            <div className="space-y-8">
              <EliteStep n="01" t="Initialization" d="Upload parameters and evidence logs." />
              <EliteStep n="02" t="AI Validation" d="Automated categorization & routing." />
              <EliteStep n="03" t="Active Resolution" d="Human verification & infrastructure repair." />
              <EliteStep n="04" t="Audit Log" d="Final report & transparency verification." />
            </div>
          </div>

          {/* Performance Telemetry */}
          <div className="bg-gradient-to-br from-primary to-blue-800 rounded-[2.5rem] p-10 shadow-3xl shadow-primary/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
             <h3 className="text-2xl font-black tracking-tight mb-8">System Telemetry</h3>
             <div className="space-y-8">
                <MetricBar label="Critical" val="1.2 Days" p={95} />
                <MetricBar label="High" val="3.4 Days" p={75} />
                <MetricBar label="Medium" val="6.1 Days" p={45} />
             </div>
             <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-blue-200 opacity-60 tracking-widest">Active Nodes</span>
                  <span className="text-xl font-black">1,492</span>
                </div>
                <div className="p-3 bg-white/10 rounded-xl">
                  <Activity className="w-6 h-6" />
                </div>
             </div>
          </div>

          {/* Alert Card */}
          <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-[2rem] flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
            <p className="text-xs font-medium text-amber-200/80 leading-relaxed">
              System currently experiencing high load in <span className="text-white font-bold underline">Sector 4</span>. Resolution times may vary by +/- 2 hours.
            </p>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

// --- Atomic Components ---
const FeaturePill = ({ icon, label }: any) => (
  <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/5 text-xs font-bold text-slate-300 backdrop-blur-md">
    <div className="text-primary w-4 h-4">{icon}</div>
    {label}
  </div>
);

const NodeBtn = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`category-node ${active ? 'active' : ''}`}>
    <div className={`${active ? 'text-primary scale-110' : 'text-slate-500'} transition-all`}>{icon}</div>
    <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-primary' : 'text-slate-600'}`}>{label}</span>
  </button>
);

const FormGroup = ({ label, ph, icon }: any) => (
  <div className="space-y-3 flex flex-col">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">{label}</label>
    <div className="relative flex items-center">
       <div className="absolute left-5 text-slate-500">{icon}</div>
       <input type="text" placeholder={ph} className="elite-input w-full pl-14" required />
    </div>
  </div>
);

const EliteStep = ({ n, t, d }: any) => (
  <div className="flex gap-6 group">
    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex-center text-xs font-black text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
      {n}
    </div>
    <div className="space-y-1">
      <h4 className="text-sm font-black tracking-tight">{t}</h4>
      <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{d}</p>
    </div>
  </div>
);

const MetricBar = ({ label, val, p }: any) => (
  <div className="space-y-2.5">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-blue-100/70">
      <span>{label}</span>
      <span>{val}</span>
    </div>
    <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
    </div>
  </div>
);

// --- Icons ---
const User = ({ size }: any) => <UserIcon size={size} />;
const UserIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const FileText = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);
const Navigation = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
);

export default App;
