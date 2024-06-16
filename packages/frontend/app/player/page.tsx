"use client";
import { useVideoLink } from "@/context/VideoLinkContext";
import React, { useEffect, useRef, useState } from "react";
import YouTubePlayer from "@/components/YouTubePlayer";
import BackButton from "@/components/BackButton";
import DanmakuComp from "@/components/Danmaku";

const hexToRgb = (hex: string): [number, number, number] => {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const avatarList = [
  {
    name: "Eating Avatar",
    img: "/avatar-01.png",
  },
  {
    name: "Live Feed",
    img: "/avatar-02.png",
  },
  {
    name: "Food Hue",
    img: "/avatar-03.png",
  },
  {
    name: "Sound Amplifier",
    img: "/avatar-04.png",
  },
];

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

  const initialBorderColor = "#00FF00"; // 假设初始颜色为绿色
  const [borderColor, setBorderColor] = useState("#00FF00"); // 初始化为绿色
  const totalDuration = 10000; // 假设总时长 todo 修改为用户自定义的颜色

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() % totalDuration;
      const progress = elapsed / totalDuration;
      const [r, g, b] = hexToRgb(initialBorderColor);
      const hsl = rgbToHsl(r, g, b);
      const newSaturation = Math.max(0, hsl.s - progress * hsl.s);
      const newLightness = Math.min(100, hsl.l + progress * (100 - hsl.l));
      const newColor = hslToHex(hsl.h, newSaturation, newLightness);
      setBorderColor(newColor);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const [selectedAvatar, setSelectedAvatar] = useState<string>("");

  const handleAvatarClick = () => {
    const randomIndex = Math.floor(Math.random() * avatarList.length);
    setSelectedAvatar(avatarList[randomIndex].img);
  };

  // 在组件加载时，随机选择一个 avatar 图片链接作为默认展示
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * avatarList.length);
    setSelectedAvatar(avatarList[randomIndex].img);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
      <div className="absolute top-4 left-4 text-white">
        <BackButton fontSize={48} />
      </div>
      {/* todo 展示用户选择的avatar 在左下角 默认随机展示 */}
      <div className="absolute bottom-[50px] left-4">
        <img
          src={selectedAvatar}
          alt="Avatar"
          className="w-36 h-36 cursor-pointer"
          onClick={handleAvatarClick}
        />
      </div>

      <div className="w-full h-full flex flex-col items-center justify-center">
        {videoId ? (
          <div className="w-full h-full flex items-center justify-center">
            <YouTubePlayer videoId={videoId} />
            <DanmakuComp />
          </div>
        ) : (
          <div className="text-white">
            No video link provided or invalid video ID.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerPage;
