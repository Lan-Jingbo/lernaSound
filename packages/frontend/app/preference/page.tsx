"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@mui/material";
import { usePreferences } from "@/context/PreferencesContext";
import BackButton from "@/components/BackButton";

const features = [
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

const PreferencesPage = () => {
  const { selectedFeatures, toggleFeature } = usePreferences();
  return (
    <div className="w-full min-h-screen flex flex-col items-start border justify-center p-8 md:p-36">
      <div className="mb-8">
        <BackButton />
      </div>

      <div className="text-left w-full mb-8 md:mb-16 font-extrabold text-3xl md:text-4xl">
        Select your preferred features to facilitate mindful eating
      </div>
      <div className="grid grid-cols-4 gap-4 w-full">
        {features.map((feature, index) => {
          return (
            <div
              key={index}
              className={`flex flex-col items-center cursor-pointer p-4 ${
                selectedFeatures.includes(feature.name)
                  ? "border-4 border-blue-500"
                  : "border-4 border-transparent"
              }`}
              onClick={() => toggleFeature(feature.name)}
            >
              <Image
                src={feature.img}
                alt={feature.name}
                width={200}
                height={200}
              />
              <p className="mt-2 text-center">{feature.name}</p>
            </div>
          );
        })}
      </div>
      <Link href="/player" className="mt-8 md:mt-16">
        <Button
          variant="contained"
          color="primary"
          size="large"
          className="bg-blue-500 hover:bg-blue-700 transition duration-300"
        >
          Let's get started
        </Button>
      </Link>
    </div>
  );
};

export default PreferencesPage;
