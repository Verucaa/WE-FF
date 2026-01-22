import React, { useState, useEffect } from 'react';
import { Server, Emote, AppSettings } from '../types';
import { fetchServers, fetchEmotes, fetchSettings, incrementDailyStat, defaultSettings } from '../services/storageService';
import RGBText from './RGBText';
import AdsterraBanner from './AdsterraBanner';
import { LogOut, Radio, Send, Users, Youtube, Send as TelegramIcon, Loader2 } from 'lucide-react';

interface UserPanelProps {
  onLogout: () => void;
}

const UserPanel: React.FC<UserPanelProps> = ({ onLogout }) => {
  const [servers, setServers] = useState<Server[]>([]);
  const [emotes, setEmotes] = useState<Emote[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [teamCode, setTeamCode] = useState('');
  const [uids, setUids] = useState<{ [key: string]: string }>({
    uid1: '', uid2: '', uid3: '', uid4: '', uid5: '', uid6: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      const [loadedServers, loadedEmotes, loadedSettings] = await Promise.all([
        fetchServers(),
        fetchEmotes(),
        fetchSettings()
      ]);
      
      setServers(loadedServers);
      if (loadedServers.length > 0) setSelectedServerId(loadedServers[0].id);
      setEmotes(loadedEmotes);
      setSettings(loadedSettings);
      setLoading(false);
    };
    initData();
  }, []);

  const handleUidChange = (key: string, value: string) => {
    setUids(prev => ({ ...prev, [key]: value }));
  };

  const handleSendEmote = async (emoteId: string) => {
    const server = servers.find(s => s.id === selectedServerId);

    if (!server) {
      setStatusMessage('Please select a server.');
      return;
    }
    if (!teamCode) {
      setStatusMessage('Please enter a Team Code first.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Sending...');

    // Construct URL
    const baseUrl = server.apiUrl.endsWith('/') ? server.apiUrl.slice(0, -1) : server.apiUrl;
    const queryParams = new URLSearchParams();
    queryParams.append('tc', teamCode);
    
    Object.keys(uids).forEach(key => {
      const val = uids[key as keyof typeof uids];
      if (val) queryParams.append(key, val);
    });
    
    queryParams.append('emote_id', emoteId);

    const fullUrl = `${baseUrl}/join?${queryParams.toString()}`;

    try {
      // Execute the request
      await fetch(fullUrl, { method: 'GET' });
      
      await incrementDailyStat();
      setStatusMessage(`Emote Sent!`);
      
      setTimeout(() => setStatusMessage(''), 2000);
      
    } catch (error) {
      console.error(error);
      setStatusMessage('Sent (Check Game)');
      await incrementDailyStat();
      setTimeout(() => setStatusMessage(''), 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
     return (
       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
         <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
         <p>Loading Emote Data...</p>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20 relative">
      {/* Header */}
      <header className="p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-lg shadow-black/50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <RGBText text="NAJMI FF EXPERIMENT" className="text-2xl md:text-3xl" />
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600/20 text-red-400 border border-red-600/50 rounded hover:bg-red-600/30 transition"
          >
            <LogOut size={16} /> <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-8">
        
        {/* Server Selection */}
        <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Radio className="text-green-500" /> Select Server
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {servers.map(server => (
              <button
                key={server.id}
                onClick={() => setSelectedServerId(server.id)}
                className={`p-4 rounded-lg border text-lg font-bold transition-all relative overflow-hidden ${
                  selectedServerId === server.id 
                    ? 'bg-green-600/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                 {selectedServerId === server.id && (
                   <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-bl-full shadow-lg"></span>
                 )}
                {server.name}
              </button>
            ))}
          </div>
        </section>

        {/* Inputs */}
        <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-6">
          
          {/* Team Code */}
          <div>
            <label className="block text-slate-400 mb-2 font-semibold">Team Code (TC)</label>
            <input 
              type="text" 
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              placeholder="Enter Team Code"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* UIDs Grid */}
          <div>
            <label className="block text-slate-400 mb-2 font-semibold flex items-center gap-2">
              <Users size={16} /> Target UIDs
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['uid1', 'uid2', 'uid3', 'uid4', 'uid5', 'uid6'].map((key) => (
                <div key={key} className="relative">
                  <span className="absolute left-3 top-3 text-slate-600 text-xs font-bold uppercase tracking-widest">{key}</span>
                  <input 
                    type="text"
                    value={uids[key as keyof typeof uids]}
                    onChange={(e) => handleUidChange(key, e.target.value)}
                    placeholder="UID (Optional)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 pt-7 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Status Message */}
         {statusMessage && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-slate-800 border border-green-500 text-green-400 font-bold shadow-2xl animate-bounce">
                {statusMessage}
            </div>
         )}

        {/* Emote Grid with Direct Send */}
        <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
            <span role="img" aria-label="emoji">🎭</span> Send Emotes
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {emotes.map(emote => (
              <div
                key={emote.id}
                className="group relative aspect-square rounded-xl border border-slate-700 bg-slate-800 overflow-hidden hover:border-blue-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              >
                <img 
                  src={emote.imageUrl} 
                  alt={emote.emoteId}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition duration-300"
                />
                
                {/* Category Label */}
                <div className="absolute top-0 left-0 right-0 bg-black/40 text-center text-[10px] text-slate-300 p-0.5">
                   {emote.category}
                </div>

                {/* Send Button Overlay */}
                <button
                    onClick={() => handleSendEmote(emote.emoteId)}
                    disabled={isProcessing}
                    className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                >
                    <div className="bg-blue-600 text-white rounded-full p-3 shadow-lg transform hover:scale-110 active:scale-95 transition">
                        <Send size={24} className={isProcessing ? "animate-pulse" : ""} />
                    </div>
                    <span className="mt-2 text-xs font-bold text-white tracking-wider bg-black/50 px-2 rounded">SEND</span>
                </button>

              </div>
            ))}
          </div>
        </section>

        {/* Ads Banner */}
        <AdsterraBanner />

        {/* Footer Socials */}
        <footer className="pt-8 border-t border-slate-800/50 flex flex-col items-center gap-4">
            <RGBText text="NAJMI EMOTE" className="text-xl" />
            <div className="flex gap-4">
              {settings.socialLinks.youtube && (
                <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="bg-red-600 p-2 rounded-full hover:scale-110 transition text-white">
                  <Youtube size={20} />
                </a>
              )}
              {settings.socialLinks.telegram && (
                <a href={settings.socialLinks.telegram} target="_blank" rel="noreferrer" className="bg-blue-500 p-2 rounded-full hover:scale-110 transition text-white">
                  <TelegramIcon size={20} />
                </a>
              )}
            </div>
        </footer>

      </main>
    </div>
  );
};

export default UserPanel;