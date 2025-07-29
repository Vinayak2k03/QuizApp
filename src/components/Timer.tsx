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

  const timeColor = state.timeRemaining <= 300 ? 'text-red-600' : 'text-gray-800';

  return (
    <div className={`text-2xl font-bold ${timeColor} bg-white px-4 py-2 rounded-lg shadow`}>
      Time Remaining: {formatTime(state.timeRemaining)}
    </div>
  );
};

export default Timer;