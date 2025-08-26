"use client";
import MainContent from "@/component/MainContent";
import PreLoader from "@/component/PreLoader";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  });
  return <>{isLoading ? <PreLoader /> : <MainContent />}</>;
}
