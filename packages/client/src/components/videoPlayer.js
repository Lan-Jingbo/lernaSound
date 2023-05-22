import React, { useEffect, useRef, useState } from "react";
import useVideoRef from "../hooks/useVideoRef";
import { useFaceMesh } from "../hooks/useFaceMesh";
import { drawOnCanvas } from "../utils/utilities";
import "../App.css";
import { useControlPanel } from "./ControlPanel";

const VideoPlayer = ({ width, height }) => {
  const videoRef = useVideoRef();
  const { setNewItem } = useControlPanel();
  const { euclideanDistance, eyePoint, namedKeypoints } = useFaceMesh(videoRef);


  const canvasRef = useRef(null); // our canvas

  useEffect(() => {
    if (euclideanDistance !== undefined && euclideanDistance) {
      setNewItem(euclideanDistance);
      // Get canvas context
      // const ctx = canvasRef.current.getContext("2d");

      // Get Video Properties

      // const videoWidth = width; 
      // //videoRef.current.video.videoWidth;
      // const videoHeight = height; 
      // //videoRef.current.video.videoHeight;

      // // Set video width
      videoRef.current.width = videoRef.current.videoWidth;
      videoRef.current.height = videoRef.current.videoHeight;

      // // Set canvas width
      canvasRef.current.width = videoRef.current.width;
      canvasRef.current.height = videoRef.current.height;

      // const face = await net.estimateFaces(video);

      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");

      requestAnimationFrame(() => {
        if (canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          drawOnCanvas(ctx, eyePoint, namedKeypoints);
        }
        // drawMesh(face, ctx, setNewItem)
      }
      );
    }
  }, [euclideanDistance])

  return (<div className="App-header" >

    <div style={{ display: "grid" }}>
      <video ref={videoRef}
        className="webcam"
        width={width}
        height={height}
      />

      <canvas
        width={width}
        height={height}
        ref={canvasRef}
        className="canvas"
      />
    </div>
  </div>
  )
};

export default VideoPlayer;