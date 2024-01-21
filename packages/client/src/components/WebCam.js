import React, { useRef, useEffect, useState, useCallback } from "react";
import "../App.css";

import * as facemesh from "@tensorflow-models/face-landmarks-detection";

import Webcam from "react-webcam";
import { drawMesh } from "../utils/utilities";
import { useControlPanel } from "./ControlPanel";
import VideoPlayer from "./videoPlayer";

export default function WebCam({ width, height }) {
  const { setNewItem } = useControlPanel();

  const [detector, setDetector] = useState(null);
  const [video, setVideo] = useState(null);

  const UPDATE_MS = 20;

  const webcamRef = useRef(null); // our webcam
  const canvasRef = useRef(null); // our canvas
  const effectRan = useRef(); // our effect


  const runFacemesh = useCallback(async () => {
    const detect = async (net) => {
      if (
        // check if webcam works, and we receive data
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        // Get Video Properties
        const video = webcamRef.current.video;


        // const videoWidth = width; 
        // //webcamRef.current.video.videoWidth;
        // const videoHeight = height; 
        // //webcamRef.current.video.videoHeight;

        // // Set video width
        webcamRef.current.video.width = webcamRef.current.video.videoWidth;
        webcamRef.current.video.height = webcamRef.current.video.videoHeight;

        // // Set canvas width
        canvasRef.current.width = webcamRef.current.video.width;
        canvasRef.current.height = webcamRef.current.video.height;

        const face = await net.estimateFaces(video);

        // Get canvas context
        const ctx = canvasRef.current.getContext("2d");

        requestAnimationFrame(() => {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          drawMesh(face, ctx, setNewItem)
        }
        );
      }
    };
    const detectorConfig = {
      runtime: 'mediapipe', // or 'tfjs'
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
    }


    const detector = await facemesh.createDetector(facemesh.SupportedModels.MediaPipeFaceMesh, detectorConfig);
    await detector.initialize();
    setDetector(detector);

    setInterval(() => {
      detect(detector);
    }, UPDATE_MS);
  }, []);

  useEffect(() => {
    if (effectRan.current === false) {
      runFacemesh()
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  return (
    <div className="App-header">
      <div style={{ display: "grid" }}>
        <Webcam
          height={height}
          width={width}
          ref={webcamRef}
          className="webcam"
        />

        <canvas
          width={width}
          height={height}
          ref={canvasRef}
          className="canvas"
        />
      </div>

      <VideoPlayer webcamRef={webcamRef}></VideoPlayer>
    </div>
  );
}