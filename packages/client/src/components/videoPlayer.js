import React, { useEffect, useRef, useState } from "react";
import useVideoRef from "../hooks/useVideoRef";
import { useFaceMesh } from "../hooks/useFaceMesh";
import { drawOnCanvas } from "../utils/utilities";
import "../App.css";
import { useVideo } from "../context/Context";

const VideoPlayer = ({ width, height }) => {
  const {videoRef, eyePoint, namedKeypoints } = useVideo();
  const [videoUrl, setVideoUrl] = useState(''); // State to store video URL

  const localVideoRef = useRef(null);
  const canvasRef = useRef(null); // our canvas

  // Function to handle video URL input change
  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  // Function to load video from URL
  const loadVideo = () => {
    if (videoUrl) {
      localVideoRef.current.src = videoUrl;
      localVideoRef.current.load();
    }
  };

  useEffect(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      localVideoRef.current.srcObject = videoRef.current.srcObject;
    }

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
    if (eyePoint !== undefined && eyePoint) {

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
  }, [eyePoint?.x])

  return (
    <div className="App-header">
      <div style={{ marginBottom: "20px" }}>
        <input type="text" value={videoUrl} onChange={handleVideoUrlChange} placeholder="Enter video URL" />
        <button onClick={loadVideo}>Load Video</button>
      </div>

      <div style={{ display: "grid" }}>
        <video ref={localVideoRef}
          className="webcam"
          width={width}
          height={height}
          controls
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