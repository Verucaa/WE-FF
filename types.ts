export interface Server {
  id: string;
  name: string;
  apiUrl: string;
  order: number;
}

export interface Emote {
  id: string;
  category: string;
  imageUrl: string; // URL to the emote icon/image
  emoteId: string; // The actual ID sent to the API
}

export interface AppSettings {
  accessKey: string;
  getKeyUrl: string; // URL for the youtube video to get key
  maintenanceMode: boolean;
  socialLinks: {
    youtube: string;
    telegram: string;
    instagram: string;
    discord: string;
  };
  adminEmail: string; // Stored here for simulation, usually backend
}

export interface UsageStats {
  date: string;
  count: number;
}