import React, { useState, useEffect } from 'react';
import { AppSettings, Emote, Server, UsageStats } from '../types';
import { 
  fetchSettings, saveSettings, 
  fetchServers, saveServers, 
  fetchEmotes, saveEmotes, 
  fetchStats,
  defaultSettings
} from '../services/storageService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Save, Plus, Trash2, LayoutDashboard, Database, Smile, Settings, LogOut, Loader2, Link as LinkIcon, Layers } from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'servers' | 'emotes' | 'analytics'>('general');
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [servers, setServers] = useState<Server[]>([]);
  const [emotes, setEmotes] = useState<Emote[]>([]);
  const [stats, setStats] = useState<UsageStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Local state for forms
  const [newServer, setNewServer] = useState<Partial<Server>>({ name: '', apiUrl: '', order: 0 });
  const [newEmote, setNewEmote] = useState<Partial<Emote>>({ category: '', imageUrl: '', emoteId: '' });

  const loadData = async () => {
    setLoading(true);
    const [s, srv, emt, sts] = await Promise.all([
      fetchSettings(),
      fetchServers(),
      fetchEmotes(),
      fetchStats()
    ]);
    setSettings(s);
    setServers(srv);
    setEmotes(emt);
    setStats(sts);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async () => {
    await saveSettings(settings);
    alert('Settings Saved to Database');
  };

  const handleAddServer = async () => {
    if (!newServer.name || !newServer.apiUrl) return;
    const server: Server = {
      id: Date.now().toString(),
      name: newServer.name,
      apiUrl: newServer.apiUrl,
      order: newServer.order || servers.length + 1,
    };
    const updated = [...servers, server];
    setServers(updated);
    await saveServers(updated);
    setNewServer({ name: '', apiUrl: '', order: 0 });
  };

  const handleDeleteServer = async (id: string) => {
    const updated = servers.filter(s => s.id !== id);
    setServers(updated);
    await saveServers(updated);
  };

  const handleAddEmote = async () => {
    // If emoteId is missing, try to generate it from the URL or alert
    let finalEmoteId = newEmote.emoteId;
    if (!finalEmoteId && newEmote.imageUrl) {
        // Simple extraction: last part of URL, remove extension
        try {
            const urlParts = newEmote.imageUrl.split('/');
            const filename = urlParts[urlParts.length - 1];
            finalEmoteId = filename.split('.')[0];
        } catch (e) {
            finalEmoteId = `emote_${Date.now()}`;
        }
    }

    if (!newEmote.imageUrl || !newEmote.category) {
        alert("Please provide Image URL and Category");
        return;
    }
    if(!finalEmoteId) {
        alert("Could not generate Emote ID. Please enter one.");
        return;
    }

    const emote: Emote = {
      id: Date.now().toString(),
      category: newEmote.category,
      imageUrl: newEmote.imageUrl,
      emoteId: finalEmoteId,
    };
    const updated = [...emotes, emote];
    setEmotes(updated);
    await saveEmotes(updated);
    setNewEmote({ category: '', imageUrl: '', emoteId: '' });
  };

  const handleDeleteEmote = async (id: string) => {
    const updated = emotes.filter(e => e.id !== id);
    setEmotes(updated);
    await saveEmotes(updated);
  };

  const renderSidebar = () => (
    <div className="w-full md:w-64 bg-slate-900 p-4 border-r border-slate-800 flex flex-col gap-2">
      <div className="mb-6 p-2">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        <p className="text-xs text-slate-500">Najmi Emote Tool</p>
      </div>
      
      <button onClick={() => setActiveTab('general')} className={`flex items-center gap-2 p-3 rounded text-left ${activeTab === 'general' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
        <Settings size={18} /> General Settings
      </button>
      <button onClick={() => setActiveTab('servers')} className={`flex items-center gap-2 p-3 rounded text-left ${activeTab === 'servers' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
        <Database size={18} /> Server Management
      </button>
      <button onClick={() => setActiveTab('emotes')} className={`flex items-center gap-2 p-3 rounded text-left ${activeTab === 'emotes' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
        <Smile size={18} /> Emotes
      </button>
      <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-2 p-3 rounded text-left ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
        <LayoutDashboard size={18} /> Analytics
      </button>

      <div className="mt-auto">
        <button onClick={onLogout} className="w-full flex items-center gap-2 p-3 rounded text-left text-red-400 hover:bg-red-900/20 border border-red-900/20">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Loader2 className="animate-spin mr-2" /> Loading Admin Data...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-200">
      {renderSidebar()}
      
      <div className="flex-1 p-6 overflow-y-auto max-h-screen">
        
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-bold border-b border-slate-700 pb-2">General Configuration</h2>
            
            <div className="bg-slate-900 p-6 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">User Access Key</label>
                <input 
                  type="text" 
                  value={settings.accessKey} 
                  onChange={e => setSettings({...settings, accessKey: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">"Get Access Key" URL (YouTube Video)</label>
                <input 
                  type="text" 
                  value={settings.getKeyUrl} 
                  onChange={e => setSettings({...settings, getKeyUrl: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2"
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  checked={settings.maintenanceMode}
                  onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})}
                  id="maint"
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="maint" className="font-semibold text-red-400">Enable Maintenance Mode</label>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-lg space-y-4">
              <h3 className="font-bold text-lg">Social Media Links</h3>
              <div>
                <label className="block text-xs text-slate-500 uppercase">Telegram</label>
                <input 
                  type="text" 
                  value={settings.socialLinks.telegram} 
                  onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, telegram: e.target.value}})}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase">YouTube</label>
                <input 
                  type="text" 
                  value={settings.socialLinks.youtube} 
                  onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, youtube: e.target.value}})}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2"
                />
              </div>
            </div>

            <button onClick={handleSaveSettings} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold flex items-center gap-2">
              <Save size={18} /> Save Changes
            </button>
          </div>
        )}

        {/* Servers */}
        {activeTab === 'servers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-slate-700 pb-2">Server Management</h2>
            
            <div className="bg-slate-900 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="text-xs">Server Name</label>
                <input type="text" value={newServer.name} onChange={e => setNewServer({...newServer, name: e.target.value})} className="w-full bg-slate-950 p-2 border border-slate-700 rounded" placeholder="e.g. INDIA" />
              </div>
              <div className="flex-[2] w-full">
                <label className="text-xs">API URL</label>
                <input type="text" value={newServer.apiUrl} onChange={e => setNewServer({...newServer, apiUrl: e.target.value})} className="w-full bg-slate-950 p-2 border border-slate-700 rounded" placeholder="https://..." />
              </div>
              <div className="w-24">
                <label className="text-xs">Order</label>
                <input type="number" value={newServer.order} onChange={e => setNewServer({...newServer, order: parseInt(e.target.value)})} className="w-full bg-slate-950 p-2 border border-slate-700 rounded" />
              </div>
              <button onClick={handleAddServer} className="bg-blue-600 p-2 rounded text-white hover:bg-blue-500"><Plus size={20}/></button>
            </div>

            <div className="grid gap-4">
              {servers.map(server => (
                <div key={server.id} className="bg-slate-800 p-4 rounded flex justify-between items-center border border-slate-700">
                  <div>
                    <h3 className="font-bold text-lg">{server.name} <span className="text-xs text-slate-500 ml-2">Order: {server.order}</span></h3>
                    <code className="text-xs text-blue-400">{server.apiUrl}</code>
                  </div>
                  <button onClick={() => handleDeleteServer(server.id)} className="text-red-400 hover:text-red-300"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emotes */}
        {activeTab === 'emotes' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-slate-700 pb-2">Emote Management</h2>
            
            {/* Add Emote Form - Simplified */}
            <div className="bg-slate-900 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-[2] w-full">
                <label className="text-xs flex items-center gap-1"><LinkIcon size={12}/> Emote Image URL</label>
                <input 
                  type="text" 
                  value={newEmote.imageUrl} 
                  onChange={e => setNewEmote({...newEmote, imageUrl: e.target.value})} 
                  className="w-full bg-slate-950 p-2 border border-slate-700 rounded" 
                  placeholder="https://example.com/emote.png" 
                />
              </div>
              <div className="flex-1 w-full">
                <label className="text-xs flex items-center gap-1"><Layers size={12}/> Category</label>
                <input 
                  type="text" 
                  value={newEmote.category} 
                  onChange={e => setNewEmote({...newEmote, category: e.target.value})} 
                  className="w-full bg-slate-950 p-2 border border-slate-700 rounded" 
                  placeholder="e.g. Funny" 
                />
              </div>
              
              {/* Hidden/Optional Emote ID for manual override */}
              <div className="flex-1 w-full opacity-50 hover:opacity-100 transition">
                <label className="text-xs">API ID (Optional)</label>
                <input 
                    type="text"
                    value={newEmote.emoteId}
                    onChange={e => setNewEmote({...newEmote, emoteId: e.target.value})}
                    placeholder="Auto-generated"
                    className="w-full bg-slate-950 p-2 border border-slate-700 rounded"
                />
              </div>

              <button onClick={handleAddEmote} className="bg-blue-600 p-2 rounded text-white hover:bg-blue-500 h-[42px] px-6 font-bold flex items-center gap-2">
                 <Plus size={20}/> ADD
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {emotes.map(emote => (
                <div key={emote.id} className="bg-slate-800 p-3 rounded border border-slate-700 relative group">
                  <div className="relative aspect-square mb-2 rounded overflow-hidden bg-slate-900">
                      <img src={emote.imageUrl} alt={emote.emoteId} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center text-[10px] p-1 truncate text-slate-300">
                          {emote.category}
                      </div>
                  </div>
                  <p className="font-bold text-xs truncate text-blue-300">ID: {emote.emoteId}</p>
                  
                  <button onClick={() => handleDeleteEmote(emote.id)} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition shadow-lg">
                    <Trash2 size={14}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-slate-700 pb-2">Usage Analytics (Last 7 Days)</h2>
            <div className="h-80 w-full bg-slate-900 p-4 rounded-lg border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} 
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <p className="text-slate-400">Total Requests (7 Days)</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.reduce((acc, curr) => acc + curr.count, 0)}</p>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <p className="text-slate-400">Today's Requests</p>
                    <p className="text-3xl font-bold text-green-400">{stats[stats.length-1]?.count || 0}</p>
                </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
