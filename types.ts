export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
  details?: string;
}

export interface ResumeData {
  name: string;
  contact: {
    address: string;
    email: string;
    phone: string;
  };
  summary: string;
  skills: string[];
  languages: string[];
  experience: Experience[];
  education: Education[];
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';
