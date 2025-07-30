"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import Image from "next/image";
import { CheckCircleIcon, LoadingSpinnerIcon } from "@/components/icons";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUserEmail } = useQuiz();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setUserEmail(email);
    router.push("/quiz");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-[#1c1c1c] rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-700 animate-fadeIn">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Image
              src="/globe.svg"
              alt="Quiz logo"
              width={60}
              height={60}
              className="text-blue-500"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Quiz Challenge</h1>
          <p className="text-gray-400">
            Test your knowledge with 15 questions in 30 minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <LoadingSpinnerIcon className="h-4 w-4 -ml-1 mr-2 text-white" />
                Starting Quiz...
              </span>
            ) : (
              "Start Quiz"
            )}
          </button>
        </form>

        <div className="mt-8 space-y-2 bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="font-medium text-gray-300 mb-2">Quiz Features:</h3>
          <div className="flex items-center text-gray-400">
            <CheckCircleIcon className="w-4 h-4 mr-2 text-blue-400" />
            <p>15 questions total</p>
          </div>
          <div className="flex items-center text-gray-400">
            <svg
              className="w-4 h-4 mr-2 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p>30 minutes time limit</p>
          </div>
          <div className="flex items-center text-gray-400">
            <svg
              className="w-4 h-4 mr-2 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p>Navigate between questions freely</p>
          </div>
          <div className="flex items-center text-gray-400">
            <svg
              className="w-4 h-4 mr-2 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p>Quiz auto-submits when time expires</p>
          </div>
        </div>
      </div>
    </div>
  );
}
