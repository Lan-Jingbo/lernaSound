import React, { useEffect, useRef, useState } from "react";
import useVideoRef from "../hooks/useVideoRef";
import { useFaceMesh } from "../hooks/useFaceMesh";
import { drawOnCanvas } from "../utils/utilities";
import "../App.css";
import { useVideo } from "../context/Context";

const VideoPlayer = ({ width, height }) => {
  const { videoRef, eyePoint, namedKeypoints } = useVideo();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoId, setVideoId] = useState('');

  const localVideoRef = useRef(null);
  const canvasRef = useRef(null); // our canvas

  // Function to extract the YouTube video ID from the URL
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handler for form submission
  const handleYouTubeSubmit = (event) => {
    event.preventDefault();
    const id = getYouTubeId(youtubeUrl);
    setVideoId(id);
  };

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
      {/* YouTube input form */}
      <form onSubmit={handleYouTubeSubmit}>
        <input
          type="text"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="Enter YouTube URL"
        />
        <button type="submit">Load Video</button>
      </form>

      {/* Conditionally render the YouTube iframe or the local video and canvas */}
      {videoId ? (
        <iframe
          width={width}
          height={height}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          frameBorder="0"
          allowFullScreen
          title="Embedded YouTube Video"
        ></iframe>
      ) : (
        <div style={{ display: "grid" }}>
          <video
            ref={localVideoRef}
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
      )}
    </div>
  );
};

export default VideoPlayer;