"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    fetch("https://careeros-production-9e5d.up.railway.app/health")
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("Offline"));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-3xl font-bold text-blue-400">
          CareerOS
        </h1>

        <div className="flex gap-4">
          <a
            href="/login"
            className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800"
          >
            Login
          </a>

          <a
            href="/signup"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-20">

        <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
          Your AI Career
          <span className="text-blue-400"> Operating System</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-3xl mb-8">
          Analyze resumes, improve ATS scores, prepare for interviews,
          generate career roadmaps and match jobs using AI.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">

          <a
            href="/upload"
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
          >
            Analyze Resume
          </a>

          <a
            href="/signup"
            className="px-8 py-4 rounded-xl border border-gray-700 hover:bg-gray-800 text-lg font-semibold"
          >
            Create Account
          </a>

        </div>

        <div className="mt-8 text-sm text-gray-400">
          Backend Status:
          <span className="ml-2 text-green-400 font-bold">
            {status}
          </span>
        </div>

      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto mt-24 px-6 pb-20">

        <h2 className="text-4xl font-bold text-center mb-12">
          Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500 transition">
            <h3 className="text-xl font-bold mb-3">
              ATS Analyzer
            </h3>
            <p className="text-gray-400">
              Check resume ATS compatibility and improve hiring chances.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500 transition">
            <h3 className="text-xl font-bold mb-3">
              Resume Rewriter
            </h3>
            <p className="text-gray-400">
              AI-powered resume improvement suggestions.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500 transition">
            <h3 className="text-xl font-bold mb-3">
              Interview Prep
            </h3>
            <p className="text-gray-400">
              Generate interview questions based on your resume.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500 transition">
            <h3 className="text-xl font-bold mb-3">
              Career Roadmap
            </h3>
            <p className="text-gray-400">
              Build personalized learning paths for your dream role.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}