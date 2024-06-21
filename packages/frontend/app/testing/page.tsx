"use client";
import React, { useState, useEffect, useRef } from "react";
import ChewingTesting from "@/components/ChewingTesting";
import { VideoProvider } from "@/context/VideoContext";
import EyeJawDistanceChart from "@/components/EyeJawDistanceChart";
import Resizer from "@/components/Resizer";

const TestingPage = () => {
  const [topHeight, setTopHeight] = useState((2 / 3) * window.innerHeight);
  const [bottomHeight, setBottomHeight] = useState((1 / 3) * window.innerHeight);
  const [gazeX, setGazeX] = useState<number | null>(null);
  const [gazeY, setGazeY] = useState<number | null>(null);
  const [chewingFrequency, setChewingFrequency] = useState(0);
  const [gazeStart, setGazeStart] = useState<number | null>(null);
  const [isGazing, setIsGazing] = useState(false);
  const [isGazingAndNotChewing, setIsGazingAndNotChewing] = useState(false);

  const previousXRef = useRef(0);
  const previousYRef = useRef(0);

  const handleResize = (clientY: number) => {
    const newTopHeight = clientY;
    const newBottomHeight = window.innerHeight - clientY;
    setTopHeight(newTopHeight);
    setBottomHeight(newBottomHeight);
  };

  const handleFrequencyUpdate = (frequency) => {
    setChewingFrequency(frequency);
  };

  useEffect(() => {
    // Load webgazer script
    const script = document.createElement('script');
    script.src = 'https://webgazer.cs.brown.edu/webgazer.js';
    script.async = true;
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).webgazer) {
        const webgazer = (window as any).webgazer;
        webgazer.showPredictionPoints(false); // Hide the red dots
        webgazer.setGazeListener((data: any) => {
          if (data == null) {
            setGazeX(null);
            setGazeY(null);
            setGazeStart(null);
            return;
          }

          const x = data.x;
          const y = data.y;

          const threshold = 20; // Adjust threshold value as needed (in pixels)
          const isWithinRange = Math.abs(x - previousXRef.current) <= threshold && Math.abs(y - previousYRef.current) <= threshold;

          setIsGazing(isWithinRange);

          // Update previous coordinates
          previousXRef.current = x;
          previousYRef.current = y;

          if (isWithinRange) {
            if (gazeStart === null) {
              setGazeStart(Date.now());
            } else if (Date.now() - gazeStart > 10000) {
              setIsGazingAndNotChewing(chewingFrequency < 10);
            }
          } else {
            setGazeStart(null);
            setIsGazingAndNotChewing(false);
          }

          setGazeX(data.x);
          setGazeY(data.y);
        }).begin();
      }
    };
    document.body.appendChild(script);
  }, [gazeStart, chewingFrequency]);

  return (
    <VideoProvider>
      <div className="w-full min-h-screen flex flex-col">
        <div style={{ height: `${topHeight}px` }} className="relative">
          <ChewingTesting onFrequencyUpdate={handleFrequencyUpdate} />
        </div>
        <Resizer onResize={handleResize} />
        <div style={{ height: `${bottomHeight}px` }} className="relative">
          <EyeJawDistanceChart />
        </div>
        {(gazeX !== null && gazeY !== null) && (
          <div className="absolute top-0 left-0 w-full text-center z-40">
            <p>Gaze coordinates: X: {gazeX.toFixed(2)}, Y: {gazeY.toFixed(2)}</p>
          </div>
        )}
        {isGazingAndNotChewing && (
          <div className="absolute top-0 left-0 w-full text-center text-red-600 z-40">
            <p>The person has been gazing at the screen and chewing frequency is less than 10 for more than 10 seconds</p>
          </div>
        )}
      </div>
    </VideoProvider>
  );
};

export default TestingPage;
