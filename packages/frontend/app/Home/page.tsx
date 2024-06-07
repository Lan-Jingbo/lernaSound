"use client";
import { Button } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const HomePage = () => {
  const webTitle = "Video Chewing";
  const [title, setTitle] = useState("");
  useEffect(() => {
    const timerId = setInterval(() => {
      setTitle((prevTitle) => {
        const len = prevTitle.length;
        if (len < webTitle.length) {
          return webTitle.slice(0, len + 1);
        } else {
          clearInterval(timerId);
          return prevTitle;
        }
      });
    }, 300);
    return () => clearInterval(timerId);
  }, []);
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center bg-white">
      <div className="bg-white p-8 border shadow-lg rounded-lg animate-fade-in w-1/2">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to {title}
        </h1>
        <Link href="/start">
          <Button variant="contained" color="primary" size="large">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
