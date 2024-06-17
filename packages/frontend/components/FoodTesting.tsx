"use client";
import React, { useEffect, useRef, useState } from "react";
import { useVideo } from "@/context/VideoContext";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const FoodTesting: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { videoRef } = useVideo();
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
      console.log("Model loaded");
    };

    loadModel();
  }, []);

  useEffect(() => {
    if (!videoRef.current || !model) return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const handleMetadataLoaded = () => {
      if (videoRef.current && canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      }
    };

    const detectFood = async () => {
      if (videoRef.current && canvasRef.current && model) {
        console.log(videoRef.current.width, videoRef.current.height);
        const predictions = await model.detect(videoRef.current);

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        let foodDetected = false;
        console.log(predictions, "ddd");
        predictions.forEach((prediction: cocoSsd.DetectedObject) => {
          // if (prediction.class === "bowl" && prediction.score > 0.5) {
          if (prediction.score > 0.5) {
            foodDetected = true;
            const [x, y, width, height] = prediction.bbox;
            ctx.strokeStyle = "green";
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);

            const imageData = ctx.getImageData(x, y, width, height);
            analyzeColors(imageData);
          }
        });

        const message = document.getElementById("message");
        if (message) {
          if (!foodDetected) {
            message.textContent =
              "No food detected. Please place the food in the center of the camera view.";
          } else {
            message.textContent = "";
          }
        }
      }

      requestAnimationFrame(detectFood);
    };

    const analyzeColors = (imageData: ImageData) => {
      const colorCounts: { [key: string]: number } = {};
      const totalPixels = imageData.data.length / 4;

      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const color = `rgb(${r},${g},${b})`;

        if (colorCounts[color]) {
          colorCounts[color]++;
        } else {
          colorCounts[color] = 1;
        }
      }

      const sortedColors = Object.entries(colorCounts).sort(
        (a, b) => b[1] - a[1]
      );
      const dominantColor = sortedColors[0][0];
      const dominantColorPercentage = (
        (sortedColors[0][1] / totalPixels) *
        100
      ).toFixed(2);

      const message = document.getElementById("message");
      if (message) {
        message.textContent = `Dominant color: ${dominantColor} (${dominantColorPercentage}% of the food)`;
      }
    };

    videoRef.current.addEventListener("loadedmetadata", handleMetadataLoaded);

    const animationId = requestAnimationFrame(detectFood);

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener(
          "loadedmetadata",
          handleMetadataLoaded
        );
      }
      cancelAnimationFrame(animationId);
    };
  }, [videoRef, canvasRef, model]);

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
      <div
        id="message"
        className="absolute bottom-10 left-0 w-full text-center text-red-600 z-30"
      ></div>
    </div>
  );
};

export default FoodTesting;
