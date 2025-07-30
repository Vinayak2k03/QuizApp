"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import Timer from "@/components/Timer";
import Question from "@/components/Question";
import QuestionOverview from "@/components/QuestionOverview";
import { QuizData } from "@/types/quiz";

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
            setQuestions(data.results);
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
          setIsLoading(false);
          fetchInProgress.current = false;
        }
      };

      fetchQuestions();
    } else {
      setIsLoading(false);
    }
  }, [userEmail, setQuestions, router]);

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quiz Challenge</h1>
          <Timer />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Overview */}
          <div className="lg:col-span-1">
            <QuestionOverview />
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3 space-y-6">
            <Question />

            {/* Navigation Controls */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => handleNavigation("prev")}
                disabled={state.currentQuestion === 0}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>

              <span className="text-gray-600">
                {state.currentQuestion + 1} of {questions.length}
              </span>

              {state.currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => handleNavigation("next")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
