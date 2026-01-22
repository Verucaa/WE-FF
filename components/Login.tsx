import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { fetchSettings, defaultSettings } from '../services/storageService';
import RGBText from './RGBText';
import AdsterraBanner from './AdsterraBanner';
import { KeyRound, Lock, Youtube, Send as TelegramIcon, ShieldAlert, Loader2, LogIn, Shield, Disc } from 'lucide-react';

interface LoginProps {
  onUserLogin: () => void;
  onAdminLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onUserLogin, onAdminLogin }) => {
  const [keyInput, setKeyInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchSettings();
      setSettings(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput === settings.accessKey) {
      onUserLogin();
    } else {
      setError('Invalid Access Key');
      setTimeout(() => setError(''), 2000);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === settings.adminEmail || (email === 'najmi@gmail.com' && password === 'najmi')) {
       if(password === 'najmi') {
           onAdminLogin();
           return;
       }
    }
    setError('Invalid Credentials');
    setTimeout(() => setError(''), 2000);
  };

  const openKeyLink = () => {
    window.open(settings.getKeyUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  if (settings.maintenanceMode && !isAdminMode) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-6">
         <ShieldAlert size={80} className="text-purple-600 mb-6 animate-pulse" />
         <h1 className="text-4xl font-bold text-white mb-2">MAINTENANCE</h1>
         <p className="text-slate-400">System is currently being updated.</p>
         <button onClick={() => setIsAdminMode(true)} className="mt-12 text-slate-700 hover:text-white text-xs uppercase tracking-widest transition">Admin Login</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1016] flex items-center justify-center p-4 font-sans">
      
      {/* Background gradients for atmosphere */}
      <div className="fixed top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {!isAdminMode ? (
          /* USER LOGIN CARD - Matches Screenshot */
          <div className="bg-[#13151b] rounded-3xl p-6 shadow-2xl border-t-2 border-purple-600/50">
            
            {/* Header Icon */}
            <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-2xl shadow-lg shadow-purple-500/20">
                    <Shield className="text-white fill-white" size={32} />
                </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                    NAJMI FF EXPERIMENT
                </h1>
                <p className="text-slate-400 text-sm">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-6">
                
                {/* Input Section */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        {/* Fake Toggle Switch Icon for visual match */}
                        <div className="w-8 h-4 bg-purple-600 rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <label className="text-purple-300 font-bold text-sm">Access Key Password</label>
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute inset-0 bg-purple-600 rounded-lg blur opacity-20 group-focus-within:opacity-40 transition"></div>
                        <div className="relative flex items-center bg-white rounded-lg overflow-hidden border-2 border-transparent focus-within:border-purple-500 transition">
                            <div className="pl-3 text-slate-800">
                                <Lock size={20} />
                            </div>
                            <input 
                                type="text"
                                value={keyInput}
                                onChange={(e) => setKeyInput(e.target.value)}
                                className="w-full py-3 px-3 text-black font-semibold outline-none placeholder:text-slate-400"
                                placeholder="Enter Key..."
                            />
                        </div>
                    </div>
                </div>

                {/* Get Password Button */}
                <button 
                    type="button"
                    onClick={openKeyLink}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center gap-2 shadow-lg shadow-red-900/20 transition transform active:scale-95"
                >
                    <div className="w-4 h-2 bg-white rounded-sm"></div> {/* Mock Icon */}
                    GET PASSWORD
                </button>

                {/* Divider Line */}
                <div className="h-px bg-slate-800 my-4"></div>

                {/* Social Buttons Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <a href={settings.socialLinks.discord || "#"} target="_blank" rel="noreferrer" className="bg-[#5865F2] hover:bg-[#4752c4] rounded-lg p-3 flex flex-col items-center justify-center gap-1 text-white shadow-lg transition transform hover:-translate-y-1">
                        <Disc size={20} />
                        <span className="text-[10px] font-bold">DISCORD</span>
                    </a>
                    <a href={settings.socialLinks.telegram || "#"} target="_blank" rel="noreferrer" className="bg-[#0088cc] hover:bg-[#0077b5] rounded-lg p-3 flex flex-col items-center justify-center gap-1 text-white shadow-lg transition transform hover:-translate-y-1">
                        <TelegramIcon size={20} />
                        <span className="text-[10px] font-bold">TELEGRAM</span>
                    </a>
                    <a href={settings.socialLinks.youtube || "#"} target="_blank" rel="noreferrer" className="bg-[#ff0000] hover:bg-[#cc0000] rounded-lg p-3 flex flex-col items-center justify-center gap-1 text-white shadow-lg transition transform hover:-translate-y-1">
                        <Youtube size={20} />
                        <span className="text-[10px] font-bold">YOUTUBE</span>
                    </a>
                </div>

                {/* Login Button */}
                <button 
                    type="submit"
                    className="w-full bg-[#00c875] hover:bg-[#00b065] text-white font-bold py-4 rounded-lg text-lg shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition transform active:scale-95"
                >
                    <LogIn size={24} />
                    LOGIN DASHBOARD
                </button>

            </form>

             {/* Error Toast */}
             {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-center text-sm font-bold">
                    {error}
                </div>
             )}

            {/* ADSTERRA BANNER ADS */}
            <AdsterraBanner />

            {/* Admin Access Link */}
            <div className="mt-6 text-center">
                <button 
                    onClick={() => setIsAdminMode(true)}
                    className="text-slate-600 text-xs font-bold uppercase tracking-widest hover:text-slate-400 transition"
                >
                    ADMIN ACCESS
                </button>
            </div>

          </div>
        ) : (
          /* ADMIN LOGIN FORM (Kept consistent with dark theme but distinct) */
          <div className="bg-[#13151b] rounded-3xl p-8 shadow-2xl border border-slate-800">
             <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">ADMIN PANEL</h2>
                <p className="text-slate-500 text-xs uppercase tracking-widest">Restricted Area</p>
             </div>

             <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                    <label className="text-slate-400 text-xs font-bold uppercase ml-1">Email</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none transition"
                        placeholder="admin@example.com"
                    />
                </div>
                <div>
                    <label className="text-slate-400 text-xs font-bold uppercase ml-1">Password</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none transition"
                        placeholder="••••••••"
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition"
                >
                    AUTHENTICATE
                </button>
             </form>

             <div className="mt-6 text-center">
                <button 
                    onClick={() => setIsAdminMode(false)}
                    className="text-slate-500 text-xs hover:text-white transition"
                >
                    &larr; Back to User Login
                </button>
             </div>
             
             {error && (
                <div className="mt-4 text-red-500 text-center text-sm">
                    {error}
                </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;