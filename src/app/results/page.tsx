"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import { decodeHtmlEntities } from "@/utils/quiz";
import { formatTime } from "@/utils/quiz";
import { RefreshIcon } from "@/components/icons";

export default function ResultsPage() {
  const { state, questions, userEmail, resetQuiz } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    if (!userEmail || !state.isSubmitted) {
      router.push("/");
    }
  }, [userEmail, state.isSubmitted, router]);

  if (!state.isSubmitted || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-300">Loading results...</p>
        </div>
      </div>
    );
  }

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (state.answers[index] === question.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-blue-400";
    if (percentage >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const handleTakeAnotherQuiz = () => {
    resetQuiz();
    router.push("/");
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);
  const timeSpent = 30 * 60 - state.timeRemaining; // 30 minutes in seconds minus remaining time

  return (
    <div className="min-h-screen bg-gray-900 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-700 animate-fadeIn">
          <h1 className="text-3xl font-bold text-center mb-6 text-white">
            Quiz Results
          </h1>

          <div className="flex flex-col md:flex-row justify-around items-center gap-6">
            <div className="text-center">
              <div
                className={`text-6xl font-bold mb-2 ${getScoreColor(
                  percentage
                )}`}
              >
                {score}/{questions.length}
              </div>
              <div className="text-xl text-gray-400">{percentage}% Correct</div>
            </div>

            <div className="h-24 w-[1px] bg-gray-700 hidden md:block"></div>

            <div className="text-center">
              <div className="text-2xl font-mono font-bold mb-2 text-gray-300">
                {formatTime(timeSpent)}
              </div>
              <div className="text-xl text-gray-400">Time Spent</div>
            </div>

            <div className="h-24 w-[1px] bg-gray-700 hidden md:block"></div>

            <div className="text-center">
              <div className="text-xl font-medium mb-2 text-gray-300 break-all">
                {userEmail}
              </div>
              <div className="text-xl text-gray-400">Email</div>
            </div>
          </div>
        </div>

        {/* Question Results */}
        <div className="space-y-6 animate-slideIn">
          <h2 className="text-2xl font-bold text-white mb-4">
            Question Details
          </h2>

          {questions.map((question, index) => {
            const userAnswer = state.answers[index];
            const isCorrect = userAnswer === question.correct_answer;

            return (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-white">
                    Question {index + 1}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      isCorrect
                        ? "bg-green-900 text-green-300"
                        : "bg-red-900 text-red-300"
                    }`}
                  >
                    {isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>

                <h3 className="text-lg font-medium mb-4 text-gray-300">
                  {decodeHtmlEntities(question.question)}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-400 mb-2">
                      Your Answer:
                    </h4>
                    <p
                      className={`p-3 rounded-lg ${
                        userAnswer
                          ? isCorrect
                            ? "bg-green-900 text-green-300 border border-green-700"
                            : "bg-red-900 text-red-300 border border-red-700"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {userAnswer
                        ? decodeHtmlEntities(userAnswer)
                        : "No answer provided"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-400 mb-2">
                      Correct Answer:
                    </h4>
                    <p className="p-3 rounded-lg bg-green-900 text-green-300 border border-green-700">
                      {decodeHtmlEntities(question.correct_answer)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-10 mb-8 animate-fadeIn">
          <button
            onClick={handleTakeAnotherQuiz}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <RefreshIcon className="w-5 h-5 mr-2" />
            Take Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
