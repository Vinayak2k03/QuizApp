'use client';

import React from 'react';
import { useQuiz } from '@/context/QuizContext';

const QuestionOverview: React.FC = () => {
  const { state, questions, setCurrentQuestion } = useQuiz();

  const getQuestionStatus = (index: number) => {
    const isVisited = state.visitedQuestions.has(index);
    const isAnswered = state.answers[index] !== undefined;
    const isCurrent = state.currentQuestion === index;

    if (isCurrent) return 'bg-blue-500 text-white';
    if (isAnswered) return 'bg-green-500 text-white';
    if (isVisited) return 'bg-yellow-500 text-white';
    return 'bg-gray-200 text-gray-700';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Question Overview</h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`w-10 h-10 rounded-lg font-medium transition-colors ${getQuestionStatus(index)}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="mt-4 text-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span>Not Visited</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionOverview;