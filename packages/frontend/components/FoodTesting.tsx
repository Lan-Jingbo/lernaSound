"use client";
import React, { useEffect, useRef } from "react";
import { useVideo } from "@/context/VideoContext";

const FoodTesting: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // our canvas
  const { videoRef } = useVideo();

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
      // todo draw food hue testing
      // drawOnCanvas(ctx, eyePoint, namedKeypoints);
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
  }, [videoRef]);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
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

export default FoodTesting;
