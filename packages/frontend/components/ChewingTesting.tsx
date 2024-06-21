"use client";
import React, { useEffect, useRef, useState } from "react";
import { useVideo } from "@/context/VideoContext";
import { useFaceMesh } from "@/hooks/useFaceMesh";
import { drawOnCanvas } from "@/utils/testing";
import useSignalProcessing from "@/hooks/useSignalProcessing";
import { avgFrequency } from "@/utils/avgFrequency";

interface ChewingTestingProps {
  onFrequencyUpdate: (frequency: number | null) => void;
}

const ChewingTesting: React.FC<ChewingTestingProps> = ({ onFrequencyUpdate }) => {
  const [maximized, setMaximized] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // our canvas
  const { videoRef } = useVideo();
  const { eyePoint, namedKeypoints, animate, euclideanDistance } =
    useFaceMesh(videoRef);

  const [chewingFrequency, setChewingFrequency] = useState<number | null>(null);
  const [cutOffFrequency, setCutOffFrequency] = useState(0.5);
  const [itemsNo, setItemsNo] = useState(160);

  const signalProcessingData = useSignalProcessing(
    animate,
    eyePoint,
    euclideanDistance,
    cutOffFrequency,
    itemsNo
  );

  useEffect(() => {
    const calculateChewingFrequency = () => {
      const frequency = avgFrequency(signalProcessingData.filteredPeaks, 5);
      setChewingFrequency(frequency);
      onFrequencyUpdate(frequency); // Call the callback function with the updated frequency
    };

    calculateChewingFrequency();
  }, [animate, onFrequencyUpdate]);

  useEffect(() => {
    console.log(chewingFrequency);
  }, [chewingFrequency]);

  useEffect(() => {
    if (!videoRef.current) return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const handleMetadataLoaded = () => {
      if (videoRef.current && canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      }
    };

    const drawCanvas = () => {
      if (canvasRef.current && eyePoint && namedKeypoints && ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawOnCanvas(ctx, eyePoint, namedKeypoints);
      }
      requestAnimationFrame(drawCanvas);
    };

    videoRef.current.addEventListener("loadedmetadata", handleMetadataLoaded);

    const animationId = requestAnimationFrame(drawCanvas);

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener(
          "loadedmetadata",
          handleMetadataLoaded
        );
      }
      cancelAnimationFrame(animationId);
    };
  }, [eyePoint, namedKeypoints, videoRef]);

  const toggleMaximize = () => {
    setMaximized(!maximized);
  };

  return (
    <div
      onClick={toggleMaximize}
      className="relative w-full h-full flex justify-center items-center"
    >
      <video
        ref={videoRef}
        id="video"
        autoPlay={true}
        className="absolute top-0 left-0 w-full h-full object-contain z-10"
      />

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-contain z-20 pointer-events-none"
      />
    </div>
  );
};

export default ChewingTesting;
