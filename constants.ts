import { ResumeData } from './types';

export const RESUME_DATA: ResumeData = {
  name: "Arun Wilson Vadakkumcherry",
  contact: {
    address: "Paris, France, 16 rue de la marseillaise",
    email: "arunwilson.89@gmail.com",
    phone: "+33 758134484"
  },
  summary: "To pursue an international degree and build strong knowledge from reputed faculties, enabling me to acquire skills, talent, and expertise to be highly productive in a global business environment.",
  skills: [
    "Leadership & Team Collaboration",
    "Consumer Behavior Analysis",
    "International Negotiation",
    "Advertising & Campaign Management",
    "Customer Portfolio Management",
    "Business Development"
  ],
  languages: [
    "English",
    "Arabic",
    "Malayalam",
    "Hindi",
    "Tamil"
  ],
  experience: [
    {
      role: "Assistant Manager – Sales",
      company: "ESAF Bank",
      location: "Bangalore",
      period: "Aug 2024 – Aug 2025"
    },
    {
      role: "Branch Manager",
      company: "Hamdan Exchange LLC",
      location: "Oman",
      period: "Mar 2018 – Mar 2024"
    },
    {
      role: "Relationship Officer",
      company: "Abu Dhabi Commercial Bank",
      location: "UAE",
      period: "Mar 2015 – Jan 2018"
    },
    {
      role: "Business Development Executive",
      company: "Augur Printing People",
      location: "Kochi",
      period: "Jan 2012 – Dec 2014"
    }
  ],
  education: [
    {
      institution: "ESCE International Business School",
      degree: "MSc International Marketing",
      year: "2025 (Ongoing)",
      details: "Paris, France"
    },
    {
      institution: "University of Calicut",
      degree: "Bachelor of Commerce (B Com)",
      year: "2008 – 2011"
    },
    {
      institution: "Government of Kerala Board of Higher Secondary Examination",
      degree: "Higher Secondary Examination (12th)",
      year: "2006 – 2008"
    },
    {
      institution: "Government of Kerala General Education Department",
      degree: "Secondary School Education (10th)",
      year: "2004 – 2005"
    }
  ]
};

export const SYSTEM_INSTRUCTION = `You are the interactive voice assistant for Arun Wilson Vadakkumcherry's resume. 
Your goal is to answer questions from recruiters or interested parties about Arun's professional background, skills, and education.
You must speak in the first person (as if you are Arun or his direct representative) or third person, but keep it professional, polite, and enthusiastic.
Answer strictly based on the provided resume data. If asked about something not in the resume, politely state that the information is not available in the current document.
Keep answers concise and suitable for spoken conversation (avoid reading long lists unless asked).

Resume Data:
${JSON.stringify(RESUME_DATA)}
`;
