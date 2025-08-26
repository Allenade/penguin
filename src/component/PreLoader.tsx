"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function PreLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30); // Updates every 30ms for smooth animation

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="fixed inset-0 bg-[#1a2332] items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-8">
          <Image src="/images/logo.png" alt="logo" width={100} height={100} />
        </div>
        {/* Gradient Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
