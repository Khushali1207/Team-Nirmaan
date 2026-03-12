import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRight, HeartPulse, History, Phone, User, Menu, X, Calendar, MapPin, Clock, Search, ChevronRight } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('home'); 
  const [userRole, setUserRole] = useState(null); 
  const [authStep, setAuthStep] = useState('choice'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGPSAlert, setShowGPSAlert] = useState(false);

  const dateInputRef = useRef(null);

  const handleAction = (targetView) => {
    setIsMobileMenuOpen(false);
    setView(targetView);
  };

  const finalizeLogin = (role) => {
    setUserRole(role);
    if (role === 'Patient') {
      setView('patientDashboard'); // Straight to AI Appointment
      setTimeout(() => setShowGPSAlert(true), 800);
    } else {
      setView('doctorDashboard'); // Straight to Patient Info
    }
  };

  const slideIn = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
    transition: { type: "spring", damping: 25, stiffness: 200 }
  };

  // --- GPS POPUP ---
  const GPSAlert = () => (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
    >
      <div className="bg-white p-10 rounded-[3.5rem] max-w-sm w-full text-center shadow-2xl">
        <div className="w-20 h-20 bg-[#8B0000]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="text-[#8B0000]" size={32} />
        </div>
        <h3 className="text-2xl font-serif font-black text-[#2D2926] mb-4 italic uppercase">Enable GPS</h3>
        <p className="text-stone-500 text-sm font-medium mb-8 leading-relaxed">
          To connect you with the nearest doctors and optimize your AI checkup, please turn on your GPS.
        </p>
        <button onClick={() => setShowGPSAlert(false)} className="w-full py-5 bg-[#8B0000] text-white rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all">
          Allow Access
        </button>
      </div>
    </motion.div>
  );

  // --- NAVIGATION ---
  const Navigation = () => (
    <nav className="fixed top-0 w-full z-[100] bg-[#8B0000] shadow-2xl">
      <div className="flex w-full items-center justify-between px-6 py-4 md:py-0 text-[#F5F1EA] border-b border-white/10">
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className="hidden md:flex flex-1 justify-around py-9 border-r border-white/10">
          <button onClick={() => handleAction(userRole === 'Doctor' ? 'doctorDashboard' : 'patientDashboard')} className="hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] font-black flex items-center gap-3">
            <Activity size={16} /> {userRole === 'Doctor' ? 'Records' : 'Appointment'}
          </button>
          <button onClick={() => handleAction('history')} className="hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] font-black flex items-center gap-3">
            <History size={16} /> History
          </button>
        </div>
        
        <div className="flex flex-col items-center cursor-pointer py-2 md:px-14 md:py-4" onClick={() => setView('home')}>
           <div className="w-10 h-10 md:w-14 md:h-14 bg-[#F5F1EA] rounded-xl flex items-center justify-center shadow-inner mb-1 md:mb-2">
              <HeartPulse className="text-[#8B0000] w-6 h-6 md:w-8 md:h-8" />
           </div>
           <span className="text-lg md:text-2xl font-serif font-black text-[#F5F1EA] italic uppercase tracking-tighter leading-none">AROGYA</span>
        </div>

        <div className="hidden md:flex flex-1 justify-around py-9 bg-white/5">
          <button onClick={() => handleAction('contact')} className="hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] font-black flex items-center gap-3">
            <Phone size={16} /> Contact Us
          </button>
          <button onClick={() => {setUserRole(null); setView('auth'); setAuthStep('choice');}} className="bg-[#F5F1EA] text-[#8B0000] px-10 py-3 rounded-full hover:bg-white transition-all uppercase tracking-[0.2em] text-[9px] font-black shadow-lg">
            {userRole ? 'Logout' : "Login"}
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setView('auth')}>
          <User size={28} />
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden bg-[#8B0000] overflow-hidden flex flex-col border-t border-white/10">
            <button onClick={() => handleAction(userRole === 'Doctor' ? 'doctorDashboard' : 'patientDashboard')} className="flex items-center gap-4 px-8 py-6 border-b border-white/5 text-white uppercase tracking-[0.3em] text-[11px] font-black">
              <Activity size={18} /> {userRole === 'Doctor' ? 'Records' : 'Appointment'}
            </button>
            <button onClick={() => handleAction('history')} className="flex items-center gap-4 px-8 py-6 border-b border-white/5 text-white uppercase tracking-[0.3em] text-[11px] font-black">
              <History size={18} /> History
            </button>
            <button onClick={() => handleAction('contact')} className="flex items-center gap-4 px-8 py-6 border-b border-white/5 text-white uppercase tracking-[0.3em] text-[11px] font-black">
              <Phone size={18} /> Contact Us
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  // --- PATIENT PAGE: AI APPOINTMENT ---
  const PatientDashboard = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-40 px-6 pb-20 max-w-4xl mx-auto">
      <div className="bg-white rounded-[4rem] p-8 md:p-14 shadow-2xl border-b-[16px] border-[#8B0000]">
        <h2 className="text-4xl font-serif italic font-black text-[#8B0000] mb-8 uppercase tracking-tighter">AI Appointment</h2>
        <div className="space-y-6">
          <div className="p-10 bg-stone-100 rounded-[3rem] border-2 border-dashed border-stone-300 flex flex-col items-center">
            <Activity className="text-stone-300 mb-4" size={40} />
            <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest text-center">Scan medical reports or type symptoms</p>
          </div>
          <textarea 
            placeholder="Describe your current condition in detail..." 
            className="w-full p-8 bg-stone-50 rounded-[3rem] min-h-[180px] outline-none border-none text-stone-700 font-medium placeholder:opacity-30" 
          />
          <button className="w-full py-6 bg-[#8B0000] text-white rounded-full font-black uppercase tracking-[0.25em] text-[11px] shadow-xl active:scale-95 transition-all">
            Consult AI Doctor
          </button>
        </div>
      </div>
    </motion.div>
  );

  // --- DOCTOR PAGE: PATIENT INFO RECORDS ---
  const DoctorDashboard = () => {
    const dummyPatients = [
      { name: "Khushali Singala", date: "12 Mar 2026", time: "10:00 AM", day: "Thursday", issue: "Routine Checkup" },
      { name: "Ruben Wadmane", date: "12 Mar 2026", time: "11:30 AM", day: "Thursday", issue: "Fever & Cold" },
      { name: "Atharva Deokar", date: "13 Mar 2026", time: "09:00 AM", day: "Friday", issue: "Sprained Ankle" }
    ];

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40 px-6 pb-20 max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl font-serif italic font-black text-[#8B0000] uppercase tracking-tighter">Patients</h2>
            <p className="text-stone-400 font-black text-[10px] uppercase tracking-[0.3em] mt-2 italic">Live Appointment Stream</p>
          </div>
          <div className="bg-white p-4 rounded-full shadow-lg text-[#8B0000]"><Search size={22} /></div>
        </div>

        <div className="grid gap-6">
          {dummyPatients.map((patient, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ x: 10 }}
              className="bg-white p-8 rounded-[3.5rem] shadow-xl border-l-[12px] border-[#8B0000] flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div className="flex items-center gap-6 flex-1">
                <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center font-serif font-black text-[#8B0000] text-xl italic">{patient.name[0]}</div>
                <div>
                  <h4 className="text-xl font-black text-[#2D2926] uppercase tracking-tight">{patient.name}</h4>
                  <p className="text-stone-400 text-[10px] font-bold uppercase">{patient.issue}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-10">
                <div className="text-center md:text-right">
                  <div className="flex items-center gap-2 text-[#8B0000] font-black text-[10px] uppercase mb-1">
                    <Calendar size={14} /> {patient.day}
                  </div>
                  <p className="text-sm font-bold text-stone-600">{patient.date}</p>
                </div>
                <div className="text-center md:text-right border-l border-stone-100 pl-10">
                  <div className="flex items-center gap-2 text-[#8B0000] font-black text-[10px] uppercase mb-1">
                    <Clock size={14} /> Time
                  </div>
                  <p className="text-sm font-bold text-stone-600">{patient.time}</p>
                </div>
                <ChevronRight className="text-stone-200 hidden md:block" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const Homepage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 md:pt-60 bg-[#F5F1EA] min-h-screen">
      <div className="container mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center pb-24">
        <div className="space-y-12 text-center lg:text-left order-2 lg:order-1">
          <h1 className="text-[40px] md:text-[90px] font-serif font-black leading-[1] md:leading-[0.85] tracking-tighter text-[#2D2926]">
            Take care of your <br/>
            <span className="text-[#8B0000] italic font-medium underline decoration-2 underline-offset-8">health & happiness</span>
          </h1>
          <button onClick={() => setView('auth')} className="w-full sm:w-auto bg-[#8B0000] text-white px-12 py-6 rounded-full font-black uppercase tracking-widest text-[12px] shadow-2xl flex items-center justify-center gap-4 mx-auto lg:mx-0">
            Access Your Portal <ArrowRight size={20} />
          </button>
        </div>
        <div className="relative h-[350px] md:h-[650px] order-1 lg:order-2 rounded-[3rem] md:rounded-[7rem] bg-white shadow-xl overflow-hidden p-4 md:p-6">
          <img src="https://cdn.pixabay.com/photo/2025/05/29/08/25/doctor-9628974_1280.jpg" className="w-full h-full object-cover rounded-[2rem] md:rounded-[5rem]" alt="Care" />
        </div>
      </div>
    </motion.div>
  );

  const AuthView = () => (
    <motion.div {...slideIn} className="min-h-screen bg-[#F5F1EA] flex items-center justify-center pt-48 px-6 pb-20">
      {authStep === 'choice' ? (
        <div className="max-w-2xl w-full text-center">
          <h2 className="text-6xl font-serif italic font-black mb-16 text-[#8B0000] tracking-tighter uppercase">Identify</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div onClick={() => setAuthStep('pForm')} className="bg-white p-16 rounded-[4rem] shadow-xl cursor-pointer hover:border-[#8B0000] border-2 border-transparent transition-all group active:scale-95">
              <User className="text-[#8B0000] w-12 h-12 mx-auto mb-6" />
              <p className="font-black uppercase tracking-[0.4em] text-xs text-stone-800">Patient</p>
            </div>
            <div onClick={() => setAuthStep('dForm')} className="bg-white p-16 rounded-[4rem] shadow-xl cursor-pointer hover:border-[#8B0000] border-2 border-transparent transition-all group active:scale-95">
              <HeartPulse className="text-[#8B0000] w-12 h-12 mx-auto mb-6" />
              <p className="font-black uppercase tracking-[0.4em] text-xs text-stone-800">Doctor</p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`max-w-lg w-full p-8 md:p-14 rounded-[4.5rem] shadow-2xl transition-all ${authStep === 'pForm' ? 'bg-white border-b-[16px] border-[#8B0000]' : 'bg-[#8B0000] text-[#F5F1EA]'}`}>
           <h2 className="text-3xl font-serif italic font-black mb-8 tracking-tighter uppercase text-center">
             {authStep === 'pForm' ? 'Registration' : 'Medical Portal'}
           </h2>
           <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full p-5 bg-stone-100 rounded-3xl text-black border-none outline-none focus:ring-2 ring-[#8B0000]" />
              {authStep === 'pForm' ? (
                <>
                  <div className="relative cursor-pointer" onClick={() => dateInputRef.current?.showPicker()}>
                    <input ref={dateInputRef} type="date" className="w-full p-5 bg-stone-100 rounded-3xl text-stone-600 font-bold uppercase text-[10px] border-none outline-none cursor-pointer" />
                    <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={18} />
                  </div>
                  <select className="w-full p-5 bg-stone-100 rounded-3xl text-stone-600 font-bold uppercase text-[10px] border-none outline-none"><option>MALE</option><option>FEMALE</option><option>OTHER</option></select>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Degree" className="p-5 bg-white/10 text-white placeholder-white/50 rounded-3xl border border-white/20 outline-none text-xs font-bold" />
                    <input type="text" placeholder="Specialization" className="p-5 bg-white/10 text-white placeholder-white/50 rounded-3xl border border-white/20 outline-none text-xs font-bold" />
                  </div>
                  <input type="text" placeholder="Clinic Name" className="w-full p-5 bg-white/10 text-white placeholder-white/50 rounded-3xl border border-white/20 outline-none text-xs font-bold" />
                </>
              )}
              <button onClick={() => finalizeLogin(authStep === 'pForm' ? 'Patient' : 'Doctor')} className={`w-full py-6 rounded-3xl font-black uppercase text-[11px] tracking-[0.25em] shadow-xl mt-4 active:scale-95 transition-all ${authStep === 'pForm' ? 'bg-[#8B0000] text-white' : 'bg-white text-[#8B0000]'}`}>
                Access Arogya
              </button>
           </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen font-sans selection:bg-[#8B0000] selection:text-white bg-[#F5F1EA]">
      <Navigation />
      {showGPSAlert && <GPSAlert />}
      <AnimatePresence mode="wait">
        {view === 'home' && <Homepage key="h" />}
        {view === 'auth' && <AuthView key="a" />}
        {view === 'patientDashboard' && <PatientDashboard key="pd" />}
        {view === 'doctorDashboard' && <DoctorDashboard key="dd" />}
      </AnimatePresence>
    </div>
  );
}