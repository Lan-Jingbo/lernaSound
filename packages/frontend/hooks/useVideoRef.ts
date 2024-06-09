import { useEffect, useRef } from "react";

const useVideoRef = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // const offscreenVideo = document.createElement("video");
    const offscreenVideo = document.getElementById("video");
    if (offscreenVideo instanceof HTMLVideoElement) {
      offscreenVideo.height = 480;
      offscreenVideo.width = 640;
      offscreenVideo.autoplay = true;
      offscreenVideo.playsInline = true;

      // navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      //   offscreenVideo.srcObject = stream;
      //   offscreenVideo.play();
      // });

      // videoRef.current = offscreenVideo;
    }
  }, []);

  return videoRef;
};

export default useVideoRef;