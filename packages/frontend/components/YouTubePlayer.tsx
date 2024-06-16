"use client";
import React, { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";

interface BorderColor {
  color: string;
  percentage: string;
}

interface YouTubePlayerProps {
  videoId: string;
  borderColors?: BorderColor[];
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  borderColors = [
    { color: "rgba(255, 0, 0, 1)", percentage: "10%" },
    { color: "rgba(255, 127, 0, 1)", percentage: "20%" },
    { color: "rgba(255, 255, 0, 1)", percentage: "30%" },
    { color: "rgba(0, 255, 0, 1)", percentage: "40%" },
    { color: "rgba(0, 0, 255, 1)", percentage: "50%" },
    { color: "rgba(75, 0, 130, 1)", percentage: "60%" },
    { color: "rgba(139, 0, 255, 1)", percentage: "70%" },
  ],
}) => {
  const playerRef = useRef<any>(null);

  const targetPlaybackRateRef = useRef<number>(0.83);
  const [autoRateChange, setAutoRateChange] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      fs: 0,
      rel: 0, // 禁用推荐视频
      modestbranding: 1, // 隐藏YouTube logo
      enablejsapi: 1,
    },
  };

  useEffect(() => {
    const totalTime = 20 * 60 * 1000; // 20分钟
    const intervalTime = 1000; // 每秒更新一次
    const steps = totalTime / intervalTime;
    const opacityStep = 1 / steps;

    const interval = setInterval(() => {
      setOpacity((prevOpacity) => {
        if (prevOpacity > 0) {
          return prevOpacity - opacityStep;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
    startReducingPlaybackRate();

    const iframe = playerRef.current.getIframe();
    const playerContainer = iframe?.parentElement;

    if (playerContainer) {
      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            const controls = playerContainer.querySelector(
              ".ytp-right-controls"
            );
            console.log(playerContainer, "playerContainer");
            console.log(controls, "controlscontrols");
            if (controls) {
              addCustomButton(controls);
              observer.disconnect();
            }
          }
        }
      });

      observer.observe(playerContainer, { childList: true, subtree: true });
    }
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === 1) {
      startReducingPlaybackRate();
    }
  };

  const onPlaybackRateChange = () => {
    if (autoRateChange) return;
    const speed = playerRef.current.getPlaybackRate();
    targetPlaybackRateRef.current = speed * 0.83;
    startReducingPlaybackRate();
  };

  const startReducingPlaybackRate = () => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentRate = playerRef.current.getPlaybackRate();
        if (currentRate > targetPlaybackRateRef.current) {
          if (!autoRateChange) {
            setAutoRateChange(true);
          }
          playerRef.current.setPlaybackRate(
            Math.max(targetPlaybackRateRef.current, currentRate - 0.01)
          );
        } else {
          clearInterval(interval);
          setAutoRateChange(false);
        }
      }
    }, 1000);
  };

  const borderColor = `linear-gradient(45deg, ${borderColors
    .map((item) => `${item.color.slice(0, -2)}${opacity}) ${item.percentage}`)
    .join(", ")})`;

  const addCustomButton = (controls: Element) => {
    const customButton = document.createElement("button");
    customButton.innerText = "Custom Button";
    customButton.style.background = "#ff0000";
    customButton.style.color = "#ffffff";
    customButton.style.border = "none";
    customButton.style.padding = "5px 10px";
    customButton.style.marginLeft = "10px";
    customButton.style.cursor = "pointer";

    customButton.addEventListener("click", () => {
      alert("Custom button clicked!");
    });

    controls.insertBefore(customButton, controls.firstChild);
  };

  return (
    <div
      className="w-full h-full border-[16px] rounded"
      style={{ borderImage: `${borderColor} 1`, borderImageSlice: 1 }}
    >
      <YouTube
        videoId={videoId}
        opts={opts}
        className="w-full h-full"
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        onPlaybackRateChange={onPlaybackRateChange}
      />
    </div>
  );
};

export default YouTubePlayer;
