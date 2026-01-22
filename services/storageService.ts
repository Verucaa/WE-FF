import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';
import { AppSettings, Emote, Server, UsageStats } from '../types';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4PKKRh3Ei7UyqzbnWWGJBixClClNYK1Y",
  authDomain: "we-ff-d2a00.firebaseapp.com",
  databaseURL: "https://we-ff-d2a00-default-rtdb.firebaseio.com",
  projectId: "we-ff-d2a00",
  storageBucket: "we-ff-d2a00.firebasestorage.app",
  messagingSenderId: "183808765379",
  appId: "1:183808765379:web:fec6c61e356570f32f6176",
  measurementId: "G-X2P946T14N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Default Data (Exported for Initial State in Components)
export const defaultSettings: AppSettings = {
  accessKey: '1234',
  getKeyUrl: 'https://youtube.com',
  maintenanceMode: false,
  socialLinks: {
    youtube: 'https://youtube.com/@najmi_ff_experiment?si=Za92yXnG7VuE5Iul',
    telegram: 'https://t.me/Verucaaa',
    instagram: '',
    discord: '',
  },
  adminEmail: 'pp4412542@gmail.com',
};

export const defaultServers: Server[] = [
  {
    id: '1',
    name: 'INDIA',
    apiUrl: 'https://najmi-emote-api-1.onrender.com',
    order: 1,
  },
];

export const defaultEmotes: Emote[] = [
  {
    id: '1',
    category: 'Funny',
    imageUrl: 'https://picsum.photos/id/1011/100/100',
    emoteId: 'lol_emote_id',
  },
  {
    id: '2',
    category: 'Greeting',
    imageUrl: 'https://picsum.photos/id/1025/100/100',
    emoteId: 'hello_emote_id',
  },
  {
    id: '3',
    category: 'Dance',
    imageUrl: 'https://picsum.photos/id/100/100/100',
    emoteId: 'dab_emote_id',
  },
];

// --- Async Data Functions (Firebase) ---

export const fetchSettings = async (): Promise<AppSettings> => {
  try {
    const snapshot = await get(ref(db, 'settings'));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    // Initialize defaults if not exists
    await set(ref(db, 'settings'), defaultSettings);
    return defaultSettings;
  } catch (error) {
    console.error("Firebase Error (fetchSettings):", error);
    return defaultSettings;
  }
};

export const saveSettings = async (settings: AppSettings) => {
  try {
    await set(ref(db, 'settings'), settings);
  } catch (error) {
    console.error("Firebase Error (saveSettings):", error);
  }
};

export const fetchServers = async (): Promise<Server[]> => {
  try {
    const snapshot = await get(ref(db, 'servers'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Handle array vs object storage
      const list = Array.isArray(data) ? data : Object.values(data);
      return list.sort((a: any, b: any) => a.order - b.order);
    }
    await set(ref(db, 'servers'), defaultServers);
    return defaultServers;
  } catch (error) {
    console.error("Firebase Error (fetchServers):", error);
    return defaultServers;
  }
};

export const saveServers = async (servers: Server[]) => {
  try {
    await set(ref(db, 'servers'), servers);
  } catch (error) {
    console.error("Firebase Error (saveServers):", error);
  }
};

export const fetchEmotes = async (): Promise<Emote[]> => {
  try {
    const snapshot = await get(ref(db, 'emotes'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Array.isArray(data) ? data : Object.values(data);
    }
    await set(ref(db, 'emotes'), defaultEmotes);
    return defaultEmotes;
  } catch (error) {
    console.error("Firebase Error (fetchEmotes):", error);
    return defaultEmotes;
  }
};

export const saveEmotes = async (emotes: Emote[]) => {
  try {
    await set(ref(db, 'emotes'), emotes);
  } catch (error) {
    console.error("Firebase Error (saveEmotes):", error);
  }
};

export const fetchStats = async (): Promise<UsageStats[]> => {
  try {
    const snapshot = await get(ref(db, 'stats'));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    // Initialize defaults
    const today = new Date();
    const stats = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      stats.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: Math.floor(Math.random() * 50),
      });
    }
    await set(ref(db, 'stats'), stats);
    return stats;
  } catch (error) {
    console.error("Firebase Error (fetchStats):", error);
    return [];
  }
};

export const incrementDailyStat = async () => {
  try {
    const stats = await fetchStats();
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existingIndex = stats.findIndex(s => s.date === todayStr);
    
    if (existingIndex >= 0) {
      stats[existingIndex].count += 1;
    } else {
      stats.push({ date: todayStr, count: 1 });
      if (stats.length > 7) stats.shift();
    }
    await set(ref(db, 'stats'), stats);
  } catch (error) {
    console.error("Firebase Error (incrementDailyStat):", error);
  }
};

// --- Local Storage for Session Only ---
const KEYS = { IS_ADMIN: 'najmi_is_admin' };

export const setAdminSession = (isActive: boolean) => {
  if (isActive) {
    localStorage.setItem(KEYS.IS_ADMIN, 'true');
  } else {
    localStorage.removeItem(KEYS.IS_ADMIN);
  }
};

export const isAdminSessionActive = (): boolean => {
  return localStorage.getItem(KEYS.IS_ADMIN) === 'true';
};
