"use client";
import React, { useRef } from "react";
import YouTube from "react-youtube";

interface YouTubePlayerProps {
  videoId: string;
  borderColor?: string; // 添加一个可选的 borderColor 属性
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  borderColor = "#ffffff",
}) => {
  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      fs: 0,
    },
  };

  return (
    <div className="w-full h-full border-4 rounded " style={{ borderColor }}>
      <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
    </div>
  );
};

export default YouTubePlayer;
