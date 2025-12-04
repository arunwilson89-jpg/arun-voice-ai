import React, { useState } from 'react';
import { ResumeView } from './components/ResumeView';
import { AudioVisualizer } from './components/AudioVisualizer';
import { useLiveSession } from './hooks/useLiveSession';
import { RESUME_DATA } from './constants';

// Icons
const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
  </svg>
);

const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const App: React.FC = () => {
  const { connect, disconnect, connectionState, isTalking, error, analyserRef } = useLiveSession();
  const [hasStarted, setHasStarted] = useState(false);

  const handleToggleConnection = () => {
    if (connectionState === 'connected' || connectionState === 'connecting') {
      disconnect();
      setHasStarted(false);
    } else {
      connect();
      setHasStarted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8 flex flex-col items-center">
      
      {/* Top Controls / AI Interface */}
      <div className="w-full max-w-4xl mb-6 flex flex-col md:flex-row gap-4">
        
        {/* Left Card: AI Agent Status */}
        <div className="flex-1 bg-slate-900 text-white rounded-2xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
             <UserIcon />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${connectionState === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="uppercase text-xs font-bold tracking-wider text-slate-400">
                {connectionState === 'connected' ? 'Live Agent Active' : 'Agent Offline'}
              </span>
            </div>
            <h2 className="text-2xl font-bold">Ask about Arun's Resume</h2>
            <p className="text-slate-400 text-sm mt-1">
              "Tell me about his experience in Oman" or "Does he know Arabic?"
            </p>
          </div>

          <div className="mt-8">
            <AudioVisualizer analyserRef={analyserRef} isActive={connectionState === 'connected'} />
          </div>
          
          <div className="mt-4 flex items-center justify-between">
             <div className="text-xs text-slate-500 font-mono">
                {isTalking ? 'Agent Speaking...' : (connectionState === 'connected' ? 'Listening...' : 'Ready to connect')}
             </div>
             
             <button
              onClick={handleToggleConnection}
              disabled={connectionState === 'connecting'}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all transform active:scale-95 ${
                connectionState === 'connected' 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {connectionState === 'connecting' ? (
                <span>Connecting...</span>
              ) : connectionState === 'connected' ? (
                <>
                  <StopIcon /> <span>End Call</span>
                </>
              ) : (
                <>
                  <MicIcon /> <span>Start Interview</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Card: Quick Stats */}
        <div className="hidden md:flex w-64 bg-white rounded-2xl p-6 shadow-lg flex-col justify-center space-y-4">
           <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Experience</div>
              <div className="text-2xl font-bold text-slate-800">12+ Years</div>
           </div>
           <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Languages</div>
              <div className="text-2xl font-bold text-slate-800">{RESUME_DATA.languages.length}</div>
           </div>
           <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Current Status</div>
              <div className="text-lg font-bold text-indigo-600">MSc Student</div>
              <div className="text-xs text-gray-500">Paris, France</div>
           </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-4xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Main Resume View */}
      <div className="w-full max-w-4xl flex-1 min-h-0">
        <ResumeView />
      </div>

    </div>
  );
};

export default App;
