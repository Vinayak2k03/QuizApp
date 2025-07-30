'use client';

import React, { useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { formatTime } from '@/utils/quiz';
import { useRouter } from 'next/navigation';

const Timer: React.FC = () => {
  const { state, updateTimer, submitQuiz } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    if (state.isSubmitted) return;

    const timer = setInterval(() => {
      if (state.timeRemaining <= 1) {
        submitQuiz();
        router.push('/results');
        return;
      }
      updateTimer(state.timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [state.timeRemaining, state.isSubmitted, updateTimer, submitQuiz, router]);

  const getTimeColor = () => {
    if (state.timeRemaining <= 60) return 'text-red-500 animate-pulse';
    if (state.timeRemaining <= 300) return 'text-orange-400';
    return 'text-gray-200';
  };

  return (
    <div className="bg-gray-800 px-4 py-3 rounded-lg shadow border border-gray-700 flex items-center">
      <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className={`text-xl font-mono font-bold ${getTimeColor()}`}>
        {formatTime(state.timeRemaining)}
      </span>
    </div>
  );
};

export default Timer;