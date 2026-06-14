"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function UploadPage() {
  const [score, setScore] = useState<number | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [rewrittenText, setRewrittenText] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [jobMatches, setJobMatches] = useState<any[]>([]);
  const [roadmap, setRoadmap] = useState<string[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    }
  }, []);

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
      const uploadRes = await fetch(
        "https://careeros-production-9e5d.up.railway.app/upload-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      const atsRes = await fetch(
        "https://careeros-production-9e5d.up.railway.app/ats",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: uploadData.text,
            job_description: jobDescription,
          }),
        }
      );

      const atsData = await atsRes.json();

      setScore(atsData.score || 0);
      setFound(atsData.matched || []);
      setMissing(atsData.missing || []);
      setSuggestions(atsData.suggestions || []);

      const interviewRes = await fetch(
        "https://careeros-production-9e5d.up.railway.app/interview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skills: atsData.matched || [],
          }),
        }
      );

      const interviewData = await interviewRes.json();
      setQuestions(interviewData.questions || []);

      const jobRes = await fetch(
        "https://careeros-production-9e5d.up.railway.app/job-match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skills: atsData.matched || [],
          }),
        }
      );

      const jobData = await jobRes.json();
      setJobMatches(jobData.jobs || []);

      const roadmapRes = await fetch(
        "https://careeros-production-9e5d.up.railway.app/roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            missing_skills: atsData.missing || [],
          }),
        }
      );

      const roadmapData = await roadmapRes.json();
      setRoadmap(roadmapData.roadmap || []);

      const rewriteRes = await fetch(
        "https://careeros-production-9e5d.up.railway.app/rewrite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: uploadData.text,
          }),
        }
      );

      const rewriteData = await rewriteRes.json();

      setRewrittenText(
        rewriteData.rewritten_text ||
          rewriteData.rewritten ||
          ""
      );

      const coverRes = await fetch(
        "https://careeros-production-9e5d.up.railway.app/cover-letter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Divya",
            role: "AI Engineer",
          }),
        }
      );

      const coverData = await coverRes.json();
      setCoverLetter(coverData.cover_letter || "");

      await fetch(
        "https://careeros-production-9e5d.up.railway.app/save-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: file.name,
            ats_score: atsData.score || 0,
            user_email: localStorage.getItem("user_email"),
          }),
        }
      );

      const email = localStorage.getItem("user_email");

      const historyRes = await fetch(
        `https://careeros-production-9e5d.up.railway.app/history/${email}`
      );

      const historyData = await historyRes.json();
      setHistory(historyData.history || []);
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
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">
        CareerOS ATS Analyzer
      </h1>

      <textarea
        placeholder="Paste Job Description Here..."
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(e.target.value)
        }
        className="w-full h-40 p-4 bg-gray-900 border border-gray-700 rounded-lg mb-6"
      />

      <input
        type="file"
        accept=".pdf"
        onChange={uploadResume}
        className="mb-6"
      />

      {loading && (
        <p className="text-yellow-400">
          Analyzing Resume...
        </p>
      )}

      {score !== null && (
        <div className="mt-8 border border-gray-700 p-6 rounded-lg">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-green-400">
                Skills Found
              </h3>
              <p className="text-3xl font-bold">
                {found.length}
              </p>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-red-400">
                Missing Skills
              </h3>
              <p className="text-3xl font-bold">
                {missing.length}
              </p>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-blue-400">
                ATS Score
              </h3>
              <p className="text-3xl font-bold">
                {score}%
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-blue-400">
            ATS Score: {score}%
          </h2>

          <div className="w-full bg-gray-800 rounded-full h-6 mt-4">
            <div
              className="bg-green-500 h-6 rounded-full"
              style={{
                width: `${score}%`,
              }}
            />
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-green-400 mb-3">
              Matched Skills
            </h3>

            {found.map((skill) => (
              <span
                key={skill}
                className="inline-block bg-green-700 px-3 py-1 rounded-full mr-2 mb-2"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-red-400 mb-3">
              Missing Skills
            </h3>

            {missing.map((skill) => (
              <span
                key={skill}
                className="inline-block bg-red-700 px-3 py-1 rounded-full mr-2 mb-2"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-yellow-400">
              Suggestions
            </h3>

            <ul className="mt-3">
              {suggestions.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Recommended Jobs
            </h3>

            {jobMatches.map((job, index) => (
              <div
                key={index}
                className="bg-gray-900 p-4 rounded-lg mb-3"
              >
                <p className="font-bold text-lg">
                  {job.title}
                </p>

                <p className="text-green-400">
                  Match Score: {job.score}%
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-orange-400 mb-4">
              Career Roadmap
            </h3>

            {roadmap.length === 0 ? (
              <div className="bg-gray-900 p-4 rounded-lg">
                No missing skills detected.
              </div>
            ) : (
              roadmap.map((step, index) => (
                <div
                  key={index}
                  className="bg-gray-900 p-4 rounded-lg mb-3"
                >
                  {index + 1}. {step}
                </div>
              ))
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-purple-400">
              Interview Questions
            </h3>

            <ul className="mt-3">
              {questions.map((q, index) => (
                <li key={index}>🎤 {q}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-cyan-400">
              AI Improved Resume
            </h3>

            <div className="bg-gray-900 p-4 rounded-lg mt-3 whitespace-pre-wrap">
              {rewrittenText}
            </div>

            {rewrittenText.trim() && (
              <button
                onClick={downloadResumePDF}
                className="mt-4 bg-cyan-600 px-4 py-2 rounded-lg hover:bg-cyan-700"
              >
                Download Resume PDF
              </button>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-green-400">
              Cover Letter
            </h3>

            <div className="bg-gray-900 p-4 rounded-lg mt-3 whitespace-pre-wrap">
              {coverLetter}
            </div>

            {coverLetter.trim() && (
              <button
                onClick={downloadCoverLetter}
                className="mt-4 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Download Cover Letter
              </button>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-pink-400">
              Resume History
            </h3>

            {history.length === 0 ? (
              <div className="bg-gray-900 p-4 rounded-lg mt-3">
                No reports found.
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-900 p-4 rounded-lg mt-3"
                >
                  <p>
                    <strong>File:</strong>{" "}
                    {item.filename}
                  </p>

                  <p>
                    <strong>ATS Score:</strong>{" "}
                    {item.ats_score}%
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
}