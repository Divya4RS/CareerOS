"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const userEmail =
      localStorage.getItem("user_email") || "";

    setEmail(userEmail);

    fetch(
      `https://careeros-production-9e5d.up.railway.app/history/${userEmail}`
    )
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history || []);
      })
      .catch((err) => {
        console.error(err);
      });

  }, []);

  const averageScore =
    history.length > 0
      ? Math.round(
          history.reduce(
            (sum, item) =>
              sum + item.ats_score,
            0
          ) / history.length
        )
      : 0;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");

    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-400 mt-2">
            Welcome, {email}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 px-5 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>

      </div>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-green-400">
            Reports
          </h3>

          <p className="text-4xl font-bold">
            {history.length}
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-blue-400">
            Avg ATS Score
          </h3>

          <p className="text-4xl font-bold">
            {averageScore}%
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-purple-400">
            User
          </h3>

          <p>{email}</p>
        </div>

      </div>

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-4">
          Quick Actions
        </h2>

        <div className="flex gap-4">

          <a
            href="/upload"
            className="bg-blue-600 px-6 py-3 rounded-lg"
          >
            ATS Analyzer
          </a>

        </div>

      </div>

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-4">
          Your Resume History
        </h2>

        {history.length === 0 ? (
          <div className="bg-gray-900 p-4 rounded-lg">
            No reports found.
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 p-4 rounded-lg mb-4"
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

    </main>
  );
}