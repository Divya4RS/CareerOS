"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import jsPDF from "jspdf";

type JobMatch = {
  title?: string;
  score?: number;
};

type HistoryItem = {
  id?: string | number;
  filename?: string;
  ats_score?: number;
};

function getScoreLabel(score: number) {
  if (score >= 85) return "Excellent Match";
  if (score >= 70) return "Strong Match";
  if (score >= 50) return "Moderate Match";
  return "Needs Improvement";
}

function getScoreTone(score: number) {
  if (score >= 85) return "text-emerald-400";
  if (score >= 70) return "text-cyan-400";
  if (score >= 50) return "text-amber-400";
  return "text-rose-400";
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        ) : null}
      </div>
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export default function UploadPage() {
  const [score, setScore] = useState<number | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [rewrittenText, setRewrittenText] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [roadmap, setRoadmap] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const summaryTone = useMemo(() => {
    if (score === null) return "text-slate-300";
    return getScoreTone(score);
  }, [score]);

  const gaugeDashOffset = useMemo(() => {
    const circumference = 2 * Math.PI * 78;
    const pct = score ?? 0;
    return circumference - (circumference * pct) / 100;
  }, [score]);

  const uploadResume = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!jobDescription.trim()) {
      alert("Please paste a Job Description first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiBase = "https://careeros-production-9e5d.up.railway.app";

      const uploadRes = await fetch(`${apiBase}/upload-resume`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      const atsRes = await fetch(`${apiBase}/ats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: uploadData.text,
          job_description: jobDescription,
        }),
      });
      const atsData = await atsRes.json();

      setScore(atsData.score || 0);
      setFound(atsData.matched || []);
      setMissing(atsData.missing || []);
      setSuggestions(atsData.suggestions || []);

      const interviewRes = await fetch(`${apiBase}/interview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: atsData.matched || [],
        }),
      });
      const interviewData = await interviewRes.json();
      setQuestions(interviewData.questions || []);

      const jobRes = await fetch(`${apiBase}/job-match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: atsData.matched || [],
        }),
      });
      const jobData = await jobRes.json();
      setJobMatches(jobData.jobs || []);

      const roadmapRes = await fetch(`${apiBase}/roadmap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          missing_skills: atsData.missing || [],
        }),
      });
      const roadmapData = await roadmapRes.json();
      setRoadmap(roadmapData.roadmap || []);

      const rewriteRes = await fetch(`${apiBase}/rewrite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: uploadData.text,
        }),
      });
      const rewriteData = await rewriteRes.json();
      setRewrittenText(
        rewriteData.rewritten_text || rewriteData.rewritten || ""
      );

      const coverRes = await fetch(`${apiBase}/cover-letter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Divya",
          role: "AI Engineer",
        }),
      });
      const coverData = await coverRes.json();
      setCoverLetter(coverData.cover_letter || "");

      await fetch(`${apiBase}/save-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          ats_score: atsData.score || 0,
          user_email: localStorage.getItem("user_email"),
        }),
      });

      const email = localStorage.getItem("user_email");
      if (email) {
        const historyRes = await fetch(`${apiBase}/history/${email}`);
        const historyData = await historyRes.json();
        setHistory(historyData.history || []);
      }
    } catch (error) {
      console.error(error);
      alert("Error analyzing resume.");
    }

    setLoading(false);
  };

  const downloadCoverLetter = () => {
    if (!coverLetter.trim()) return;

    const blob = new Blob([coverLetter], {
      type: "text/plain;charset=utf-8",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover_letter.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadResumePDF = () => {
    if (!rewrittenText.trim()) return;

    const doc = new jsPDF();
    doc.setFontSize(14);

    const lines = doc.splitTextToSize(rewrittenText, 180);
    doc.text(lines, 10, 10);
    doc.save("Improved_Resume.pdf");
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[280px] flex-col border-r border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:flex">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
              CareerOS
            </p>
            <h1 className="mt-2 text-2xl font-bold">AI Career Studio</h1>
            <p className="mt-2 text-sm text-slate-400">
              Resume intelligence, ATS analysis, and interview prep in one place.
            </p>
          </div>

          <nav className="space-y-2 text-sm">
            {[
              "Dashboard",
              "ATS Analyzer",
              "Job Matches",
              "Career Roadmap",
              "Interview Prep",
              "Cover Letter",
              "History",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 hover:bg-white/10"
              >
                {item}
              </div>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
              Pro Tip
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Add a strong job description to get richer ATS, interview, and roadmap results.
            </p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
                  AI-Powered Career Development Platform
                </p>
                <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                  CareerOS Dashboard
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-400">
                  Upload a resume, compare it to a job description, and get ATS score, rewrite suggestions,
                  interview prep, job matches, and a career roadmap.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Status</p>
                <p className="mt-1 text-sm font-medium text-emerald-400">
                  {loading ? "Analyzing..." : "Ready for upload"}
                </p>
              </div>
            </div>
          </header>

          <div className="space-y-8 p-5 sm:p-8">
            <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-[0_20px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                    Smart Upload
                  </p>
                  <h3 className="mt-3 text-3xl font-bold leading-tight">
                    Turn your resume into a live career profile.
                  </h3>
                  <p className={`mt-3 max-w-2xl text-sm ${summaryTone}`}>
                    Paste a real job description, upload your PDF, and get an AI career dashboard with scores,
                    gaps, suggestions, questions, roadmap, and more.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <StatCard label="Overall Score" value={`${score ?? "—"}`} />
                  <StatCard
                    label="Match Quality"
                    value={score !== null ? getScoreLabel(score) : "Upload a resume"}
                  />
                </div>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <label className="mb-3 block text-sm font-medium text-slate-300">
                    Job Description
                  </label>
                  <textarea
                    placeholder="Paste Job Description Here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  />
                </div>

                <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-black/20 p-4">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-300">
                      Resume PDF
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={uploadResume}
                      className="w-full cursor-pointer rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-4 text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-cyan-400"
                    />
                  </div>

                  <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-500/10 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
                      Pipeline
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      Resume → ATS → Rewrite → Jobs → Roadmap → Interview Prep → History
                    </p>
                  </div>
                </div>
              </div>

              {loading && (
                <div className="mt-5 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
                  Analyzing resume... this can take a few seconds.
                </div>
              )}
            </section>

            {score !== null && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      Skills Found
                    </p>
                    <p className="mt-3 text-4xl font-bold text-emerald-400">{found.length}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      Missing Skills
                    </p>
                    <p className="mt-3 text-4xl font-bold text-rose-400">{missing.length}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      ATS Score
                    </p>
                    <p className="mt-3 text-4xl font-bold text-cyan-300">{score}%</p>
                  </div>
                </div>

                <SectionCard
                  title="ATS Overview"
                  subtitle="Score ring, match quality, and skill status."
                >
                  <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="flex items-center justify-center">
                      <div className="relative h-52 w-52">
                        <svg className="h-52 w-52 -rotate-90">
                          <circle
                            cx="104"
                            cy="104"
                            r="78"
                            stroke="rgba(255,255,255,0.10)"
                            strokeWidth="14"
                            fill="none"
                          />
                          <circle
                            cx="104"
                            cy="104"
                            r="78"
                            stroke="url(#careerGradient)"
                            strokeWidth="14"
                            fill="none"
                            strokeDasharray={2 * Math.PI * 78}
                            strokeDashoffset={gaugeDashOffset}
                            strokeLinecap="round"
                            className="transition-all duration-700"
                          />
                          <defs>
                            <linearGradient id="careerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#22d3ee" />
                              <stop offset="50%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-black text-white">{score}%</span>
                          <span className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-400">
                            ATS Score
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center gap-4">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-400">Match Quality</p>
                          <p className={`text-sm font-semibold ${getScoreTone(score)}`}>
                            {getScoreLabel(score)}
                          </p>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">
                          {score >= 85
                            ? "Your resume is highly aligned with this job description."
                            : score >= 70
                            ? "Your resume is a strong match, with a few improvements left."
                            : score >= 50
                            ? "You have a moderate match. Focus on the missing skills."
                            : "This role needs more alignment. Use the roadmap and rewrite suggestions."}
                        </p>
                      </div>

                      <div className="h-4 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-700"
                          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                        />
                      </div>

                      <p className="text-sm text-slate-400">
                        {found.length} matched skills • {missing.length} missing skills
                      </p>
                    </div>
                  </div>
                </SectionCard>

                <div className="grid gap-6 xl:grid-cols-2">
                  <SectionCard
                    title="Matched Skills"
                    subtitle="Skills detected in both the resume and job description."
                  >
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {found.length > 0 ? (
                        found.map((skill) => (
                          <div
                            key={skill}
                            className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-300"
                          >
                            <p className="font-medium">{skill}</p>
                            <div className="mt-2 h-2 rounded-full bg-emerald-400/20">
                              <div className="h-2 w-[90%] rounded-full bg-emerald-400" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400">No matched skills found.</p>
                      )}
                    </div>
                  </SectionCard>

                  <SectionCard
                    title="Missing Skills"
                    subtitle="The biggest gaps between your resume and the target role."
                  >
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {missing.length > 0 ? (
                        missing.map((skill) => (
                          <div
                            key={skill}
                            className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-300"
                          >
                            <p className="font-medium">{skill}</p>
                            <div className="mt-2 h-2 rounded-full bg-rose-400/20">
                              <div className="h-2 w-[35%] rounded-full bg-rose-400" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400">No missing skills detected.</p>
                      )}
                    </div>
                  </SectionCard>
                </div>

                <SectionCard
                  title="AI Insights"
                  subtitle="Quick recruiter-style feedback from the analysis."
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                      <p className="text-sm font-semibold text-emerald-300">Strength</p>
                      <p className="mt-2 text-sm text-slate-200">
                        {found.length > 0
                          ? `Strong alignment in ${found.slice(0, 3).join(", ")}.`
                          : "No strong alignment detected yet."}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
                      <p className="text-sm font-semibold text-amber-300">Improve</p>
                      <p className="mt-2 text-sm text-slate-200">
                        {missing.length > 0
                          ? `Add ${missing.slice(0, 3).join(", ")} to improve ATS compatibility.`
                          : "Your resume is well matched. Focus on stronger project outcomes."}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
                      <p className="text-sm font-semibold text-cyan-300">Next Move</p>
                      <p className="mt-2 text-sm text-slate-200">
                        Use the rewrite and interview sections to prepare a better application.
                      </p>
                    </div>
                  </div>
                </SectionCard>

                <div className="grid gap-6 xl:grid-cols-2">
                  <SectionCard
                    title="Suggestions"
                    subtitle="Actionable improvements based on the analysis."
                  >
                    {suggestions.length > 0 ? (
                      <ul className="space-y-3">
                        {suggestions.map((item, index) => (
                          <li
                            key={index}
                            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300"
                          >
                            • {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400">No suggestions available yet.</p>
                    )}
                  </SectionCard>

                  <SectionCard
                    title="Recommended Jobs"
                    subtitle="Roles aligned with your current skill profile."
                  >
                    {jobMatches.length > 0 ? (
                      <div className="space-y-3">
                        {jobMatches.map((job, index) => (
                          <div
                            key={index}
                            className="rounded-2xl border border-white/10 bg-black/20 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold text-white">
                                {job.title || "Untitled Role"}
                              </p>
                              <p className="text-sm font-medium text-emerald-400">
                                {job.score ?? 0}%
                              </p>
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                                style={{ width: `${Math.min(100, job.score || 0)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No job matches yet.</p>
                    )}
                  </SectionCard>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <SectionCard
                    title="Career Roadmap"
                    subtitle="Short learning plan for missing skills."
                  >
                    {roadmap.length === 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
                        No missing skills detected.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {roadmap.map((step, index) => (
                          <div
                            key={index}
                            className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-semibold text-cyan-300">
                              {index + 1}
                            </div>
                            <p className="text-sm text-slate-300">{step}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </SectionCard>

                  <SectionCard
                    title="Interview Questions"
                    subtitle="Practice questions generated from your matched skills."
                  >
                    {questions.length > 0 ? (
                      <ul className="space-y-3">
                        {questions.map((q, index) => (
                          <li
                            key={index}
                            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300"
                          >
                            🎤 {q}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400">No interview questions generated yet.</p>
                    )}
                  </SectionCard>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <SectionCard
                    title="AI Improved Resume"
                    subtitle="Refined summary and phrasing for stronger applications."
                  >
                    <div className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-slate-200">
                      {rewrittenText || "No rewritten resume generated yet."}
                    </div>

                    {rewrittenText.trim() && (
                      <button
                        onClick={downloadResumePDF}
                        className="mt-4 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-black hover:bg-cyan-400"
                      >
                        Download Resume PDF
                      </button>
                    )}
                  </SectionCard>

                  <SectionCard
                    title="Cover Letter"
                    subtitle="Generate and save a tailored cover letter."
                  >
                    <div className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-slate-200">
                      {coverLetter || "No cover letter generated yet."}
                    </div>

                    {coverLetter.trim() && (
                      <button
                        onClick={downloadCoverLetter}
                        className="mt-4 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black hover:bg-emerald-400"
                      >
                        Download Cover Letter
                      </button>
                    )}
                  </SectionCard>
                </div>

                <SectionCard
                  title="Resume History"
                  subtitle="Track previous uploads and scores over time."
                >
                  {history.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
                      No reports found.
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {history.map((item) => (
                        <div
                          key={item.id ?? item.filename}
                          className="rounded-2xl border border-white/10 bg-black/20 p-4"
                        >
                          <p className="text-sm text-slate-400">Filename</p>
                          <p className="mt-1 font-medium text-white">{item.filename}</p>
                          <p className="mt-4 text-sm text-slate-400">ATS Score</p>
                          <p className="mt-1 text-2xl font-bold text-cyan-300">
                            {item.ats_score}%
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}