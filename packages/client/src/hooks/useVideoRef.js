import { useRef, useEffect } from "react";

const useVideoRef = () => {
  const videoRef = useRef(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (!videoRef || hasPlayedRef.current) {
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        var isPlaying = video.currentTime > 0 && !video.paused && !video.ended
          && video.readyState > video.HAVE_CURRENT_DATA;

        if (!isPlaying) {
          video.play();
        }

        // Set the hasPlayedRef to true after playing.
        hasPlayedRef.current = true;
      });
  }, [videoRef]);

  return videoRef;
};

export default useVideoRef;