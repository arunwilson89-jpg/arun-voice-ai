import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';
import { base64ToUint8Array, createPcmBlob } from '../utils/audio';
import { ConnectionState } from '../types';

export const useLiveSession = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [isTalking, setIsTalking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for audio handling to avoid re-renders
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourceNodesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sessionRef = useRef<Promise<any> | null>(null); // Keeping session as a promise reference
  const analyserRef = useRef<AnalyserNode | null>(null);

  const cleanup = useCallback(() => {
    // Stop input
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      inputSourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }

    // Stop output
    sourceNodesRef.current.forEach(node => {
      try { node.stop(); } catch (e) { /* ignore */ }
    });
    sourceNodesRef.current.clear();
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setConnectionState('disconnected');
    setIsTalking(false);
    analyserRef.current = null;
  }, []);

  const connect = useCallback(async () => {
    try {
      setConnectionState('connecting');
      setError(null);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Setup Input Audio (Mic)
      // 16kHz required for Gemini Input
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      // Setup Output Audio (Speaker)
      // 24kHz for Gemini Output
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Analyser for visualization
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.connect(audioContextRef.current.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputSource = inputAudioContextRef.current.createMediaStreamSource(stream);
      inputSourceRef.current = inputSource;

      // Use ScriptProcessor for capturing raw PCM (AudioWorklet is better but more complex for single file structure)
      const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.0-flash-exp',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } // Charon is deep/professional
          }
        },
        callbacks: {
          onopen: () => {
            setConnectionState('connected');
            console.log("Session connected");
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle audio output
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              setIsTalking(true);
              const ctx = audioContextRef.current;
              
              // Ensure we don't schedule in the past
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

              const bytes = base64ToUint8Array(audioData);
              
              // Custom decoding for raw PCM 24kHz from Gemini
              const dataInt16 = new Int16Array(bytes.buffer);
              const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < dataInt16.length; i++) {
                channelData[i] = dataInt16[i] / 32768.0;
              }

              const source = ctx.createBufferSource();
              source.buffer = buffer;
              
              // Connect to analyser for viz, then destination
              if (analyserRef.current) {
                source.connect(analyserRef.current);
              } else {
                source.connect(ctx.destination);
              }

              source.addEventListener('ended', () => {
                sourceNodesRef.current.delete(source);
                if (sourceNodesRef.current.size === 0) {
                  setIsTalking(false);
                }
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourceNodesRef.current.add(source);
            }

            // Handle interruption
            if (message.serverContent?.interrupted) {
              console.log("Interrupted");
              sourceNodesRef.current.forEach(node => {
                try { node.stop(); } catch(e) {}
              });
              sourceNodesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsTalking(false);
            }
          },
          onclose: () => {
            console.log("Session closed");
            cleanup();
          },
          onerror: (e) => {
            console.error(e);
            setError("Connection error occurred.");
            cleanup();
          }
        }
      });

      sessionRef.current = sessionPromise;

      // Start processing input audio
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmBlob = createPcmBlob(inputData);
        
        // Only send if session is ready
        sessionPromise.then(session => {
          session.sendRealtimeInput({ media: pcmBlob });
        });
      };

      inputSource.connect(processor);
      processor.connect(inputAudioContextRef.current.destination);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to access microphone or connect.");
      setConnectionState('error');
      cleanup();
    }
  }, [cleanup]);

  const disconnect = useCallback(() => {
    if (sessionRef.current) {
       sessionRef.current.then(session => {
         session.close();
       }).catch(e => console.error("Error closing session", e));
    }
    cleanup();
  }, [cleanup]);

  return {
    connectionState,
    isTalking,
    error,
    connect,
    disconnect,
    analyserRef
  };
};