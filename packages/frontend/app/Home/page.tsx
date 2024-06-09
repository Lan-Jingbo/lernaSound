"use client";
import { Button, TextField } from "@mui/material";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useState } from "react";

const HomePage = () => {
  const webTitle = "Video Chewing";
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");

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

  useEffect(() => {
    // 检查本地存储中是否有用户名
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem("username", username);
    // 在这里你可以添加逻辑将用户名传给后端接口
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen text-center bg-white">
      <div className="bg-white p-8 border shadow-lg rounded-lg animate-fade-in w-1/2">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to {title}
        </h1>
        {/* 输入你的ID */}

        <div>
          <TextField
            label="Enter your username"
            variant="outlined"
            value={username}
            onChange={handleChange}
            className="mb-4"
          />
        </div>

        <Link
          href="/start"
          onClick={() => {
            handleLogin();
          }}
        >
          <Button variant="contained" color="primary" size="large">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
