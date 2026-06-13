"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const login = async () => {
    try {
      const res = await fetch(
        "http://careeros-production-9e5d.up.railway.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      setMessage(data.message);

      if (data.message === "Login successful") {
        localStorage.setItem(
          "user_email",
          data.email
        );

        localStorage.setItem(
          "token",
          data.token
        );

        window.location.href =
          "/dashboard";
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Unable to connect to backend"
      );
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="bg-gray-900 p-8 rounded-lg w-[400px]">

        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-black border border-gray-700 rounded"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 bg-black border border-gray-700 rounded"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 p-3 rounded hover:bg-blue-700"
        >
          Login
        </button>

        {message && (
          <p className="mt-4 text-green-400">
            {message}
          </p>
        )}

      </div>

    </main>
  );
}