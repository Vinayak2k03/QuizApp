"use client";

import React, { useEffect } from "react";
import { useQuiz } from "@/context/QuizContext";
import { formatTime } from "@/utils/quiz";
import { useRouter } from "next/navigation";
import { TimerIcon } from "./icons";

const Timer: React.FC = () => {
  const { state, updateTimer, submitQuiz } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    // Don't run the timer if the quiz is already submitted
    if (state.isSubmitted) return;

    // Create an interval to update the timer every second
    const timer = setInterval(() => {
      // Auto-submit when timer reaches 0
      if (state.timeRemaining <= 1) {
        submitQuiz();
        router.push("/results");
        return;
      }
      // Decrement the timer
      updateTimer(state.timeRemaining - 1);
    }, 1000);

    // Clear the interval when the component unmounts or dependencies change
    return () => clearInterval(timer);
  }, [state.timeRemaining, state.isSubmitted, updateTimer, submitQuiz, router]);

  // Change color based on time remaining to provide visual cues
  const getTimeColor = () => {
    if (state.timeRemaining <= 60) return "text-red-500 animate-pulse"; // Last minute - urgent
    if (state.timeRemaining <= 300) return "text-orange-400"; // Last 5 minutes - warning
    return "text-gray-200"; // Normal time
  };

  return (
    <div className="bg-gray-800 px-4 py-3 rounded-lg shadow border border-gray-700 flex items-center">
      <TimerIcon className="w-5 h-5 mr-2 text-blue-400" />
      <span className={`text-xl font-mono font-bold ${getTimeColor()}`}>
        {formatTime(state.timeRemaining)}
      </span>
    </div>
  );
};

export default Timer;
