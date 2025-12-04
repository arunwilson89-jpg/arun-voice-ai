import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  isActive: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyserRef, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!isActive) {
        // Idle animation: simple slow pulse line
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      if (!analyserRef.current) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2; // Scaling down
        
        // Gradient color based on height
        const r = barHeight + 25 * (i / bufferLength);
        const g = 250 * (i / bufferLength);
        const b = 50;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        // Center the visualization vertically
        const y = (canvas.height - barHeight) / 2;
        
        ctx.fillRect(x, y, barWidth, barHeight);

        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, analyserRef]);

  return (
    <canvas 
      ref={canvasRef} 
      width={300} 
      height={100} 
      className="w-full h-24 rounded-lg bg-black/20 backdrop-blur-sm"
    />
  );
};
