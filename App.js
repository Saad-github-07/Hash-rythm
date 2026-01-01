import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, onSnapshot, 
  query, serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken 
} from 'firebase/auth';
import { 
  ResponsiveContainer, Tooltip as ReTooltip, XAxis, YAxis, AreaChart, Area, CartesianGrid
} from 'recharts';
import { 
  Zap, ShieldCheck, Coins, Layers, Globe, ArrowRight, 
  MessageSquare, Send, Lock, FastForward, Info, TrendingUp, 
  Activity, Server, X, User, Key, Calculator, Gauge,
  Database, Network, Cpu, CheckCircle2,
  Terminal, History, Code
} from 'lucide-react';

// --- Firebase Configuration & Initialization ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'hash-rythm-v1';

const App = () => {
  const [activeTab, setActiveTab] = useState('lightning');
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calcAmount, setCalcAmount] = useState(1000);
  const [scrolled, setScrolled] = useState(false);

  // Handle Navbar styling on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auth Initialization
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth failed:", error);
      }
    };
    initAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, setUser);
    return () => unsubscribeAuth();
  }, []);

  // Firestore Comments Listener
  useEffect(() => {
    if (!user) return;
    
    // Rule 1: Using the mandatory strict path
    const commentsCollection = collection(db, 'artifacts', appId, 'public', 'data', 'comments');
    
    // Rule 2: Simple query (no orderBy in query to avoid index requirement)
    const unsubscribe = onSnapshot(
      commentsCollection, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Manual sort in JS memory to adhere to Rule 2
        const sorted = docs.sort((a, b) => {
          const timeA = a.timestamp?.seconds || 0;
          const timeB = b.timestamp?.seconds || 0;
          return timeB - timeA;
        });
        setComments(sorted);
      }, 
      (error) => console.error("Firestore error:", error)
    );
    return () => unsubscribe();
  }, [user]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'comments'), {
        userId: user.uid,
        user: `Node_${user.uid.slice(0, 4)}`,
        text: newComment,
        timestamp: serverTimestamp()
      });
      setNewComment("");
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = [
    { name: 'Jan', cap: 4200, nodes: 15200 },
    { name: 'Feb', cap: 4600, nodes: 15800 },
    { name: 'Mar', cap: 4400, nodes: 16100 },
    { name: 'Apr', cap: 5100, nodes: 17200 },
    { name: 'May', cap: 5350, nodes: 17900 },
    { name: 'Jun', cap: 5432, nodes: 18294 },
  ];

  const l2Techs = {
    lightning: {
      title: "Lightning Network",
      desc: "Instant, high-velocity state channels enabling near-instant, trustless micropayments for the global economy.",
      features: ["Bi-directional Channels", "Onion Routing", "HTLC/PTLC Logic"],
      metrics: { tps: "1M+", latency: "< 500ms", fee: "1-10 Sats" }
    },
    sidechains: {
      title: "Sidechains & Liquid",
      desc: "Independent blockchains attached via a two-way peg, enabling confidential transactions and complex assets.",
      features: ["Federated Consensus", "Issued Assets", "Merged Mining"],
      metrics: { tps: "3,000+", latency: "1-2 min", fee: "100 Sats" }
    },
    statechains: {
      title: "Statechains",
      desc: "UTXO-based off-chain transfers that enable scaling without the complexity of channel liquidity management.",
      features: ["UTXO Transfer", "Zero-Knowledge Proofs", "Optimistic Validation"],
      metrics: { tps: "Unlimited", latency: "Instant", fee: "Minimal" }
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-slate-400 selection:bg-amber-500/30 font-sans antialiased overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/[0.03] blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-6 md:py-8'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className={`flex items-center justify-between px-4 md:px-6 py-3 rounded-2xl border transition-all ${scrolled ? 'bg-black/60 backdrop-blur-xl border-white/10 shadow-xl' : 'bg-transparent border-transparent'}`}>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Zap className="text-black w-4 h-4 md:w-5 md:h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base md:text-lg text-white tracking-tight uppercase italic leading-none">Hash Rythm</span>
                <span className="text-[8px] md:text-[9px] font-bold text-amber-500 uppercase tracking-widest mt-1">Research Collective</span>
              </div>
            </div>

            <div className="hidden lg:flex gap-10 items-center">
              {['Architecture', 'Analytics', 'Simulator', 'Community'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-all">{item}</a>
              ))}
            </div>

            <button 
              onClick={() => setShowLogin(true)}
              className="bg-white text-black px-4 md:px-6 py-2 rounded-xl text-[10px] md:text-xs font-bold hover:bg-amber-500 hover:text-white transition-all transform active:scale-95"
            >
              {user?.isAnonymous === false ? 'Node Authorized' : 'Initiate Sync'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-48 pb-20 md:pb-32 px-6 max-w-7xl mx-auto z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/10 text-amber-500 text-[9px] md:text-[10px] font-bold tracking-widest uppercase mb-8">
            <History className="w-3 h-3" /> Technical Evolution of Bitcoin L2
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
            Unlocking <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Off-Chain Velocity</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-sm md:text-lg leading-relaxed mb-12">
            Scaling Bitcoin without compromising decentralization. Hash Rythm provides an 
            institutional knowledge base for high-frequency settlement infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all shadow-lg flex items-center justify-center gap-2 group text-sm">
              Explore Network <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-sm">
              Documentation
            </button>
          </div>
        </motion.div>
      </section>

      {/* Analytics Bento Grid */}
      <section id="analytics" className="py-12 md:py-24 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-[#0d0d10] border border-white/5 rounded-[32px] p-6 md:p-10 shadow-2xl relative overflow-hidden group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-1 italic uppercase tracking-tight">Network Momentum</h3>
                <p className="text-slate-500 text-xs md:text-sm">Aggregate liquidity across public Bitcoin L2 channels</p>
              </div>
              <div className="flex gap-8">
                <div className="text-right">
                  <div className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Total Capacity</div>
                  <div className="text-xl md:text-2xl font-mono font-bold text-amber-500 tracking-tighter">5,432 BTC</div>
                </div>
                <div className="hidden sm:block text-right border-l border-white/10 pl-8">
                  <div className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Growth (YoY)</div>
                  <div className="text-xl md:text-2xl font-mono font-bold text-emerald-500 tracking-tighter">+124%</div>
                </div>
              </div>
            </div>
            <div className="h-[250px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis hide domain={['auto', 'auto']} />
                  <ReTooltip 
                    contentStyle={{ backgroundColor: '#111114', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="cap" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorCap)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-[#0d0d10] border border-white/5 rounded-[32px] p-6 md:p-8 group hover:border-amber-500/20 transition-all flex-1 shadow-inner">
               <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6">
                 <TrendingUp className="w-5 h-5" />
               </div>
               <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Efficiency</div>
               <div className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tighter">0.02%</div>
               <p className="text-[10px] md:text-[11px] text-slate-500 leading-relaxed font-medium italic">Standard Routing Fees.</p>
            </div>
            <div className="bg-amber-500 rounded-[32px] p-6 md:p-8 flex-1 text-black relative overflow-hidden flex flex-col justify-between shadow-2xl">
               <Gauge className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10" />
               <div>
                  <div className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60 italic">Settlement Latency</div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter leading-none">380ms</div>
               </div>
               <p className="text-[9px] md:text-[10px] font-bold opacity-80 mt-6 uppercase tracking-widest italic leading-tight">Instant Verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-12 md:py-24 px-6 max-w-6xl mx-auto z-10 relative">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tighter uppercase italic underline decoration-amber-500/30 underline-offset-8">Layered Architecture</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
          {Object.keys(l2Techs).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 md:px-6 py-2 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all border ${
                activeTab === key 
                ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/10' 
                : 'bg-white/5 text-slate-500 border-white/10 hover:border-white/20'
              }`}
            >
              {l2Techs[key].title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 bg-[#0d0d10] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-inner">
                    <Database className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-bold text-white tracking-tight italic uppercase">{l2Techs[activeTab].title}</h3>
                </div>
                <p className="text-slate-400 text-sm md:text-base mb-10 leading-relaxed max-w-2xl font-medium">
                  {l2Techs[activeTab].desc}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                  <div className="space-y-4">
                    <h4 className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 md:mb-6 italic opacity-70 underline underline-offset-4">Technical Pillars</h4>
                    <ul className="space-y-3 md:space-y-4">
                      {l2Techs[activeTab].features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-300 text-xs md:text-sm font-bold italic">
                          <CheckCircle2 className="w-4 h-4 text-amber-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 md:p-8 bg-black/40 rounded-[32px] border border-white/5 shadow-2xl">
                    <h4 className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 text-center italic opacity-70">Benchmarks</h4>
                    <div className="space-y-5 md:space-y-6">
                      {Object.entries(l2Techs[activeTab].metrics).map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-[8px] md:text-[9px] font-bold text-slate-600 uppercase">{k}</span>
                          <span className="text-xs md:text-sm font-mono font-bold text-white">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-indigo-950/40 to-blue-950/40 border border-white/10 rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden group flex-1">
               <Cpu className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 group-hover:rotate-12 transition-all duration-700" />
               <h4 className="text-[9px] font-black uppercase tracking-widest mb-4 text-blue-400 opacity-70">Security</h4>
               <div className="text-xl md:text-2xl font-black mb-4 tracking-tighter leading-none uppercase">FRAUD <br />PROOFS</div>
               <p className="text-[11px] text-slate-400 leading-relaxed italic font-medium">
                 Ensuring off-chain integrity through challenge-response mechanisms that settle on L1.
               </p>
            </div>
            <div className="bg-[#0d0d10] border border-white/5 rounded-[40px] p-8 md:p-10 shadow-xl flex-1">
               <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-inner">
                    <Network className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Routing</span>
               </div>
               <div className="text-lg md:text-xl font-bold text-white mb-4 italic uppercase tracking-tighter">Gossip Protocol</div>
               <p className="text-[11px] text-slate-500 leading-relaxed font-bold">
                 Distributed pathfinding utilizing Dijkstra's variants across 70,000+ public channels.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section id="simulator" className="py-12 md:py-24 px-6 max-w-4xl mx-auto z-10 relative">
        <div className="bg-[#0d0d10] border border-white/5 rounded-[48px] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-20" />
          <div className="text-center mb-12 md:mb-16">
             <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500 border border-amber-500/20 shadow-inner">
               <Calculator className="w-6 h-6 md:w-8 md:h-8" />
             </div>
             <h2 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">Simulator 3.0</h2>
             <p className="text-slate-500 text-xs md:text-base font-medium max-w-md mx-auto italic opacity-80 uppercase tracking-widest">Fee Arbitrage Analysis</p>
          </div>

          <div className="mb-12 md:mb-16 px-4">
             <div className="flex justify-between items-end mb-6 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <span>Value: ${calcAmount}</span>
                <span className="text-amber-500 italic uppercase">Network Load: Standard</span>
             </div>
             <input 
              type="range" min="10" max="10000" step="50" value={calcAmount} 
              onChange={(e) => setCalcAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-900 rounded-full appearance-none cursor-pointer accent-amber-500 transition-all border border-white/5 shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="p-8 md:p-10 rounded-[40px] bg-black/40 border border-white/5 group transition-all shadow-inner">
              <div className="text-[9px] font-bold text-slate-700 uppercase tracking-widest mb-6 italic opacity-70">L1 Base Layer</div>
              <div className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter italic">${(calcAmount * 0.02 + 4.5).toFixed(2)}</div>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider italic">Economically Infeasible</p>
            </div>
            <div className="p-8 md:p-10 rounded-[40px] bg-amber-500/5 border border-amber-500/20 shadow-xl shadow-amber-500/5 flex flex-col justify-between">
              <div>
                <div className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-6 italic opacity-70">Hash Rythm L2</div>
                <div className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter italic font-mono">$0.0002</div>
              </div>
              <p className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-6">
                <CheckCircle2 className="w-4 h-4" /> 99.9% Fee Optimization
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Discourse Section */}
      <section id="community" className="py-12 md:py-24 px-6 max-w-3xl mx-auto z-10 relative">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4 italic uppercase tracking-tighter">Node Discourse</h2>
          <p className="text-slate-500 text-[10px] md:text-xs font-bold italic opacity-70 uppercase tracking-widest">Global P2P Collective Feed</p>
        </div>

        <form onSubmit={handleAddComment} className="mb-12 md:mb-16 relative group">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "Input technical feedback..." : "Synchronizing Node..."}
            disabled={!user || isSubmitting}
            className="w-full bg-[#0d0d10] border border-white/10 rounded-[32px] p-6 md:p-8 text-white text-sm md:text-base focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500/30 outline-none resize-none h-40 md:h-48 transition-all font-medium italic shadow-2xl"
          />
          <button 
            type="submit" 
            disabled={isSubmitting || !newComment.trim()}
            className="absolute bottom-6 right-6 bg-amber-500 text-black p-3 md:p-4 rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50"
          >
            {isSubmitting ? <Activity className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>

        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {comments.length > 0 ? comments.map((c) => (
              <motion.div 
                key={c.id} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="p-6 md:p-8 rounded-[32px] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all group shadow-xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-[10px] font-black border border-amber-500/20 shadow-inner group-hover:scale-110 transition-transform">
                      {c.user?.charAt(5) || 'N'}
                    </div>
                    <span className="text-amber-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest italic">{c.user || 'Unknown Node'}</span>
                  </div>
                  <span className="text-[8px] md:text-[9px] text-slate-700 font-mono font-black uppercase tracking-widest italic">
                    {c.timestamp ? new Date(c.timestamp.seconds * 1000).toLocaleTimeString() : '...'}
                  </span>
                </div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed font-bold italic">"{c.text}"</p>
              </motion.div>
            )) : (
              <div className="text-center py-20 opacity-20">
                <Activity className="w-10 h-10 md:w-12 md:h-12 text-white mx-auto mb-4 animate-pulse" />
                <p className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest italic">Broadcasting Handshake...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 md:py-24 px-6 md:px-10 bg-[#040405] border-t border-white/5 z-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 mb-20">
            <div className="md:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Zap className="text-black w-6 h-6 fill-current" />
                </div>
                <span className="font-black text-2xl text-white uppercase italic tracking-tighter leading-none">Hash Rythm</span>
              </div>
              <p className="text-slate-500 max-w-sm text-xs md:text-sm font-bold italic opacity-70 leading-relaxed">
                The institutional knowledge layer for the high-velocity Bitcoin economy. Secure. Scalable. Decentralized.
              </p>
            </div>
            
            {[
              { title: "Protocol", items: ["Lightning Network", "Sidechains", "Statechains"] },
              { title: "Engineering", items: ["Verification", "Routing", "Watchtowers"] },
              { title: "Network", items: ["Docs Hub", "SDK", "Audit Log"] }
            ].map((col, idx) => (
              <div key={idx} className="space-y-4 md:space-y-6">
                <h5 className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest italic mb-6 md:mb-8 underline decoration-amber-500 decoration-2 underline-offset-8">{col.title}</h5>
                <ul className="space-y-3 md:space-y-4 text-[10px] md:text-[11px] font-black text-slate-600 tracking-wider uppercase leading-none">
                  {col.items.map((item, i) => (
                    <li key={i} className="hover:text-amber-500 cursor-pointer transition-all italic">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/5 pt-16">
            <span className="text-slate-700 text-[9px] md:text-[10px] font-black uppercase tracking-widest italic opacity-60">© 2026 Hash Rythm Research Collective.</span>
            <div className="flex gap-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-700 italic">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowLogin(false)} 
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-md bg-[#0d0d10] border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-white/5 to-amber-500" />
              <button onClick={() => setShowLogin(false)} className="absolute top-8 right-8 p-2 hover:bg-white/5 rounded-full text-slate-600 transition-all hover:rotate-90">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              <div className="text-center mb-10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-amber-500/10 rounded-[25px] flex items-center justify-center mx-auto mb-8 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                  <Lock className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tighter uppercase italic">Authorize Node</h2>
                <p className="text-slate-500 text-xs md:text-sm font-medium italic opacity-70">Handshake Required.</p>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-700 group-focus-within:text-amber-500 transition-colors" />
                  <input type="text" placeholder="Identity UID" className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 md:py-5 pl-14 pr-4 outline-none focus:border-amber-500/40 transition-all text-xs md:text-sm font-bold text-white shadow-inner" />
                </div>
                <div className="relative group">
                  <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-700 group-focus-within:text-amber-500 transition-colors" />
                  <input type="password" placeholder="Access Secret" className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 md:py-5 pl-14 pr-4 outline-none focus:border-amber-500/40 transition-all text-xs md:text-sm font-bold text-white shadow-inner" />
                </div>
                <button 
                  onClick={() => setShowLogin(false)} 
                  className="w-full bg-amber-500 text-black py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-amber-400 transition-all mt-6 shadow-xl shadow-amber-500/10 active:scale-95"
                >
                  Execute Sync
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
