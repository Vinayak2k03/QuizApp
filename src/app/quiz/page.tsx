"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import Timer from "@/components/Timer";
import Question from "@/components/Question";
import QuestionOverview from "@/components/QuestionOverview";
import { QuizData } from "@/types/quiz";

import { PreviousIcon, NextIcon, CheckmarkIcon } from "@/components/icons";

export default function QuizPage() {
  const {
    state,
    questions,
    setQuestions,
    setCurrentQuestion,
    submitQuiz,
    userEmail,
  } = useQuiz();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const fetchInProgress = useRef(false);

  useEffect(() => {
    if (!userEmail) {
      router.push("/");
      return;
    }

    if (questions.length === 0 && !fetchInProgress.current) {
      const fetchQuestions = async () => {
        if (fetchInProgress.current) return;
        fetchInProgress.current = true;

        try {
          const response = await fetch("https://opentdb.com/api.php?amount=15");

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: QuizData = await response.json();

          if (data.response_code === 0) {
            const processedQuestions = data.results.map((q) => ({
              ...q,
              category: q.category
                .replace(/Entertainment:|Science:/, "")
                .trim(),
            }));
            setQuestions(processedQuestions);
            setIsLoading(false);
          } else {
            throw new Error("Failed to fetch questions");
          }
        } catch (error) {
          console.error("Error fetching questions:", error);
          if (questions.length === 0) {
            alert("Failed to load quiz questions. Please try again.");
            router.push("/");
          }
        } finally {
          fetchInProgress.current = false;
        }
      };

      fetchQuestions();
    } else if (questions.length > 0) {
      setIsLoading(false);
    }
  }, [userEmail, setQuestions, router, questions.length]);

  useEffect(() => {
    if (state.isSubmitted) {
      router.push("/results");
    }
  }, [state.isSubmitted, router]);

  const handleNavigation = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? Math.max(0, state.currentQuestion - 1)
        : Math.min(questions.length - 1, state.currentQuestion + 1);
    setCurrentQuestion(newIndex);
  };

  const handleSubmit = () => {
    if (confirm("Are you sure you want to submit the quiz?")) {
      submitQuiz();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-48 bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-800 rounded-lg animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Overview Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 h-[400px]">
                <div className="h-6 w-40 bg-gray-700 rounded-lg animate-pulse mb-4"></div>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(15)].map((_, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 rounded-lg bg-gray-700 animate-pulse"
                      style={{ animationDelay: `${index * 50}ms` }}
                    ></div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Main Question Area Skeleton */}
            <div className="lg:col-span-3 space-y-6">
              {/* Question Skeleton */}
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                <div className="mb-4 flex justify-between items-center">
                  <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-700 rounded-full animate-pulse"></div>
                </div>

                <div className="h-6 w-full bg-gray-700 rounded animate-pulse mb-4"></div>
                <div className="h-6 w-11/12 bg-gray-700 rounded animate-pulse mb-8"></div>

                <div className="space-y-3">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="w-full p-4 rounded-lg border-2 border-gray-700 bg-gray-900 animate-pulse"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="h-6 w-full bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Controls Skeleton */}
              <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
                <div className="h-10 w-28 bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-10 w-28 bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Quiz Challenge</h1>
          <Timer />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Overview */}
          <div className="lg:col-span-1 animate-fadeIn">
            <QuestionOverview />
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3 space-y-6 animate-fadeIn">
            <Question />

            {/* Navigation Controls */}
            <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
              <button
                onClick={() => handleNavigation("prev")}
                disabled={state.currentQuestion === 0}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  <PreviousIcon className="w-4 h-4 mr-1" />
                  Previous
                </div>
              </button>

              <span className="text-gray-300">
                {state.currentQuestion + 1} of {questions.length}
              </span>

              {state.currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <div className="flex items-center">
                    Submit Quiz
                    <CheckmarkIcon className="w-4 h-4 ml-1" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => handleNavigation("next")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <div className="flex items-center">
                    Next
                    <NextIcon className="w-4 h-4 ml-1" />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
