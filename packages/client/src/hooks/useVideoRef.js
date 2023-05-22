import { useRef, useEffect } from "react";

const useVideoRef = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const offscreenVideo = document.createElement('video');
    offscreenVideo.height = 480;
    offscreenVideo.width = 640;
    offscreenVideo.autoplay = true;
    offscreenVideo.playsinline = true;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        offscreenVideo.srcObject = stream;
        offscreenVideo.play();
      });

    videoRef.current = offscreenVideo;
  }, []);

  return videoRef;
};

export default useVideoRef;