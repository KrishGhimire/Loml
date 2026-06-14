export interface Song {
  id: string;
  title: string;
  artist: string;
  comment: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  synthTheme?: string; // e.g. "warm", "lively", "dreamy", "classic"
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
  emoji: string;
  isUserAdded?: boolean;
}

export interface Flower {
  id: string;
  name: string;
  meaning: string;
  language: string;
  description: string;
  emoji: string;
  color: string; // Tailwind class
  bloomPercent: number;
}

export interface LoveCoupon {
  id: string;
  title: string;
  description: string;
  emoji: string;
  code: string;
  isRedeemed: boolean;
  redeemedDate?: string;
}

export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  emoji: string;
  highlightColor: string;
}
