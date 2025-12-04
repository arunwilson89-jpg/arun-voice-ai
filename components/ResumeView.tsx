import React from 'react';
import { RESUME_DATA } from '../constants';

export const ResumeView: React.FC = () => {
  const { name, contact, summary, skills, experience, education, languages } = RESUME_DATA;

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden h-full flex flex-col max-w-4xl mx-auto border border-gray-200">
      {/* Header */}
      <div className="bg-slate-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        <div className="text-sm text-gray-300 flex flex-wrap gap-4">
          <span>{contact.address}</span>
          <span>•</span>
          <a href={`mailto:${contact.email}`} className="hover:text-white underline decoration-gray-500">{contact.email}</a>
          <span>•</span>
          <span>{contact.phone}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 overflow-y-auto resume-scroll flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-4">SUMMARY</h2>
              <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-4">EXPERIENCE</h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="relative pl-4 border-l-2 border-gray-200">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-800">{exp.role}</h3>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">{exp.period}</span>
                    </div>
                    <div className="text-slate-600 font-medium">{exp.company} - {exp.location}</div>
                  </div>
                ))}
              </div>
            </section>

             <section>
              <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-4">EDUCATION</h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800">{edu.institution}</h3>
                      <span className="text-xs text-slate-500">{edu.year}</span>
                    </div>
                    <div className="text-sm text-slate-600 italic">{edu.degree}</div>
                    {edu.details && <div className="text-xs text-slate-500">{edu.details}</div>}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-4">SKILLS</h2>
              <ul className="space-y-2">
                {skills.map((skill, index) => (
                  <li key={index} className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-md border border-slate-100">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-4">LANGUAGES</h2>
              <ul className="space-y-2">
                {languages.map((lang, index) => (
                  <li key={index} className="flex items-center justify-between text-sm text-slate-700">
                    <span>{lang}</span>
                    <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 w-3/4"></div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};
