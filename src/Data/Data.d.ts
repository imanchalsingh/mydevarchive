// src/Data/Data.d.ts
declare module "../Data/Data.js" {
  export interface DataItem {
    id: number;
    name: string;
    issuer?: string;
    company?: string;
    category?: string;
    type?: string;
    role?: string;
    event?: string;
    year?: string;
    duration?: string;
    mode?: string;
    status?: string;
    image: string;
    color?: string;
    date?: string;
  }

  export const courseCertificates: DataItem[];
  export const badges: DataItem[];
  export const contributionBadges: DataItem[];
  export const contributionCertificates: DataItem[];
  export const offerLetters: DataItem[];
}