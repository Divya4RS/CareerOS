"use client";

import { useEffect, useState } from "react";

const stats = [
  { label: "Resume Analysis", value: "AI-powered" },
  { label: "ATS Scoring", value: "Live" },
  { label: "Career Roadmap", value: "Personalized" },
  { label: "Interview Prep", value: "Instant" },
];

const features = [
  {
    title: "ATS Analyzer",
    description:
      "Check how well your resume matches a job description and uncover missing skills.",
  },
  {
    title: "Resume Rewriter",
    description:
      "Use Gemini-powered rewriting to improve your resume with stronger, ATS-friendly wording.",
  },
  {
    title: "Interview Prep",
    description:
      "Generate interview questions from your matched skills so you can practice smarter.",
  },
  {
    title: "Career Roadmap",
    description:
      "Turn missing skills into a clear learning plan for your target role.",
  },
];

const steps = [
  {
    step: "01",
    title: "Upload Resume",
    description: "Upload your resume PDF and paste a job description.",
  },
  {
    step: "02",
    title: "AI Analysis",
    description: "CareerOS extracts text and compares it against the role.",
  },
  {
    step: "03",
    title: "Get Insights",
    description: "See ATS score, gaps, rewrite, interview prep, and job matches.",
  },
  {
    step: "04",
    title: "Apply Better",
    description: "Use the improved resume and roadmap to apply with confidence.",
  },
];

export default function Home() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    fetch("https://careeros-production-9e5d.up.railway.app/health")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data?.status === "healthy" ? "Live" : "Offline");
      })
      .catch(() => setStatus("Offline"));
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute -top-24 left-[-8rem] h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] top-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl">
            <span className="text-lg font-black text-cyan-300">C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              CareerOS
            </h1>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              AI Career Platform
            </p>
          </div>
        </a>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="/login"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-xl transition hover:bg-white/10 hover:text-white sm:px-5"
          >
            Login
          </a>
          <a
            href="/signup"
            className="rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02] sm:px-5"
          >
            Get Started
          </a>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 lg:px-10 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Backend Status: <span className="font-semibold">{status}</span>
            </div>

            <h2 className="max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Your AI Career
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Operating System
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Analyze resumes, improve ATS score, generate interview questions,
              build a career roadmap, and rewrite resumes using AI — all in one
              platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/upload"
                className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]"
              >
                Analyze Resume
              </a>
              <a
                href="/signup"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-100 backdrop-blur-xl transition hover:bg-white/10"
              >
                Create Account
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-violet-500/20 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Live Dashboard Preview
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">
                    CareerOS Intelligence
                  </h3>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {status}
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    ATS Score
                  </p>
                  <div className="mt-4 flex items-end justify-between">
                    <p className="text-4xl font-black text-cyan-300">78%</p>
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                      Strong Match
                    </span>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-white/10">
                    <div className="h-3 w-[78%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Skill Gaps
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Docker</span>
                      <span className="text-rose-300">Missing</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>AWS</span>
                      <span className="text-rose-300">Missing</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Git</span>
                      <span className="text-rose-300">Missing</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  AI Rewrite
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Skilled in Python programming and Machine Learning methodologies,
                  with strong problem-solving ability and hands-on project
                  experience.
                </p>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Interview Prep
                  </p>
                  <p className="mt-3 text-sm text-slate-300">
                    12 generated questions
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Career Roadmap
                  </p>
                  <p className="mt-3 text-sm text-slate-300">
                    4 learning steps suggested
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
            Features
          </p>
          <h3 className="mt-3 text-3xl font-bold sm:text-4xl">
            Everything you need to improve your applications
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            CareerOS turns your resume into a structured career dashboard with
            AI-driven analysis and personalized guidance.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10"
            >
              <div className="mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 ring-1 ring-white/10" />
              <h4 className="text-xl font-semibold">{feature.title}</h4>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-violet-300/80">
              How It Works
            </p>
            <h3 className="mt-3 text-3xl font-bold sm:text-4xl">
              Simple flow, strong output
            </h3>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5"
              >
                <p className="text-sm font-semibold text-cyan-300">{item.step}</p>
                <h4 className="mt-3 text-lg font-semibold">{item.title}</h4>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-slate-400 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p>CareerOS © 2026</p>
          <p>Built with Next.js • FastAPI • PostgreSQL • Gemini AI</p>
        </div>
      </footer>
    </main>
  );
}