"use client";
import { useVideoLink } from "@/context/VideoLinkContext";
import React, { useEffect, useState } from "react";
import YouTubePlayer from "@/components/YouTubePlayer";

const PlayerPage: React.FC = () => {
  const { videoLink } = useVideoLink();

  // 提取 YouTube 视频 ID https://www.youtube.com/watch?v=lAmXfsZvTFo&ab_channel=GhibliRelaxingSoul
  const getYouTubeVideoId = (url: string) => {
    if (videoLink) {
      const urlParams = new URLSearchParams(new URL(url).search);
      return urlParams.get("v");
    }
    return "";
  };

  // 提取 YouTube 视频 ID
  const videoId = getYouTubeVideoId(videoLink);

  const [borderColor, setBorderColor] = useState("#000000"); // 初始化边框颜色

  useEffect(() => {
    const interval = setInterval(() => {
      const hue = (Date.now() / totalDuration) * 360;
      const saturation = Math.max(0, 100 - (Date.now() / totalDuration) * 100); // 逐渐降低饱和度
      const lightness = Math.max(0, 50 - (Date.now() / totalDuration) * 50); // 逐渐降低亮度
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      setBorderColor(color);
    }, 500); // 加快颜色变化速度

    return () => clearInterval(interval);
  }, []);

  const totalDuration = 10000; // 假设总时长

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
      <div className="w-full h-full flex flex-col items-center justify-center">
        {videoId ? (
          <div className="w-full h-full flex items-center justify-center">
            <YouTubePlayer videoId={videoId} borderColor={borderColor} />
          </div>
        ) : (
          <p className="text-white">
            No video link provided or invalid video ID.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlayerPage;
