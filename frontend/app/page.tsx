"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    fetch("https://careeros-production-9e5d.up.railway.app/health")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
      })
      .catch(() => {
        setStatus("Backend Offline");
      });
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <h1 className="text-6xl font-bold mb-4">
        CareerOS
      </h1>

      <p className="text-xl text-gray-400 mb-6">
        Your AI Career Operating System
      </p>

      <div className="mb-8">
        Backend Status:
        <span className="ml-2 text-green-400 font-bold">
          {status}
        </span>
      </div>

      <div className="flex gap-4">

        <a
          href="/signup"
          className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700"
        >
          Sign Up
        </a>

        <a
          href="/login"
          className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Login
        </a>

        <a
          href="/upload"
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          ATS Analyzer
        </a>

      </div>

    </main>
  );
}