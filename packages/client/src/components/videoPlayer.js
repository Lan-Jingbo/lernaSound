import React, { useEffect, useRef, useState } from "react";
import useVideoRef from "../hooks/useVideoRef";
import { useFaceMesh } from "../hooks/useFaceMesh";
import { drawOnCanvas } from "../utils/utilities";
import "../App.css";
import { useControlPanel } from "./ControlPanel";

const VideoPlayer = ({ width, height }) => {
  const {videoRef, euclideanDistance, eyePoint, namedKeypoints } = useControlPanel();

  const localVideoRef = useRef(null);
  const canvasRef = useRef(null); // our canvas

  useEffect(() => {
    localVideoRef.current.srcObject = videoRef.current.srcObject;
    var isPlaying = localVideoRef.current.currentTime > 0 && !localVideoRef.current.paused && !localVideoRef.current.ended 
    && localVideoRef.current.readyState > localVideoRef.current.HAVE_CURRENT_DATA;

    if (!isPlaying) {
      const playPromise = localVideoRef.current.play()

      if (playPromise !== null) {
        playPromise.catch(() => { 
          console.log("Discarding runtime error!");
          /* discard runtime error */
         })
      }

    }
    // localVideoRef.current.play();
  }, [videoRef.current])

  useEffect(() => {
    if (euclideanDistance !== undefined && euclideanDistance) {

      // // Set video width
      localVideoRef.current.width = localVideoRef.current.videoWidth;
      localVideoRef.current.height = localVideoRef.current.videoHeight;

      // // Set canvas width
      canvasRef.current.width = localVideoRef.current.width;
      canvasRef.current.height = localVideoRef.current.height;

      // const face = await net.estimateFaces(video);

      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");

      requestAnimationFrame(() => {
        if (canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          drawOnCanvas(ctx, eyePoint, namedKeypoints);
        }
      }
      );
    }
  }, [euclideanDistance])

  return (<div className="App-header" >

    <div style={{ display: "grid" }}>
      <video ref={localVideoRef}
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