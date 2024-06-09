"use client";
import React, { useEffect, useRef, useState } from "react";
import { useVideo } from "@/context/VideoContext";
import { useFaceMesh } from "@/hooks/useFaceMesh";
import { drawOnCanvas } from "@/utils/testing";
import {
  ChewingFrequencyProvider,
  useChewingFrequency,
} from "@/context/ChewingFrequencyContext";
import useSignalProcessing from "@/hooks/useSignalProcessing";
import { avgFrequency } from "@/utils/avgFrequency";

const ChewingTesting: React.FC = () => {
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

  // 设置咀嚼频率值的逻辑
  useEffect(() => {
    const calculateChewingFrequency = () => {
      setChewingFrequency(avgFrequency(signalProcessingData.filteredPeaks, 5));
    };
    // 执行计算咀嚼频率的逻辑
    calculateChewingFrequency();
  }, [animate]);

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

  // 切换最大化和最小化
  const toggleMaximize = () => {
    setMaximized(!maximized);
  };

  return (
    // <ChewingFrequencyProvider>
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
    // </ChewingFrequencyProvider>
  );
};

export default ChewingTesting;
