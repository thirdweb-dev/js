export type FarcasterProfile = {
  fid?: number;
  bio?: string;
  pfp?: string;
  display?: string;
  username?: string;
  custodyAddress?: string;
  addresses?: string[];
};

export type LensProfile = {
  name?: string;
  bio?: string;
  picture?: string;
  coverPicture?: string;
};

export type EnsProfile = {
  name?: string;
  address?: string;
  avatar?: string;
  display?: string;
  description?: string;
  keywords?: string[];
  email?: string;
  mail?: string;
  notice?: string;
  location?: string;
  phone?: string;
  url?: string;
  twitter?: string;
  github?: string;
  discord?: string;
  telegram?: string;
};

export type SocialProfile = {
  type: "farcaster" | "lens" | "ens";
  name?: string;
  avatar?: string;
  bio?: string;
  metadata?: FarcasterProfile | LensProfile | EnsProfile;
};
