"use client";

import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const signup = async () => {
    try {
      const res = await fetch(
        "http://careeros-production-9e5d.up.railway.app/signup",
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
    } catch (error) {
      console.error(error);
      setMessage("Signup Failed");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">
        Create Account
      </h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        className="w-full p-3 mb-4 bg-gray-900 rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        className="w-full p-3 mb-4 bg-gray-900 rounded"
      />

      <button
        onClick={signup}
        className="bg-blue-600 px-6 py-3 rounded"
      >
        Sign Up
      </button>

      {message && (
        <p className="mt-4">
          {message}
        </p>
      )}
    </main>
  );
}