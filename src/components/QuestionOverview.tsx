'use client';

import React from 'react';
import { useQuiz } from '@/context/QuizContext';

const QuestionOverview: React.FC = () => {
  const { state, questions, setCurrentQuestion } = useQuiz();

  const getQuestionStatus = (index: number) => {
    const isVisited = state.visitedQuestions.has(index);
    const isAnswered = state.answers[index] !== undefined;
    const isCurrent = state.currentQuestion === index;

    if (isCurrent) return 'bg-blue-600 text-white ring-2 ring-blue-400';
    if (isAnswered) return 'bg-green-600 text-white';
    if (isVisited) return 'bg-yellow-600 text-white';
    return 'bg-gray-700 text-gray-300';
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-white">Question Overview</h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`w-10 h-10 rounded-lg font-medium transition-all hover:scale-105 ${getQuestionStatus(index)}`}
            title={`Question ${index + 1}${state.answers[index] ? ' (Answered)' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="mt-6 text-sm border-t border-gray-700 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span className="text-gray-300">Current</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-green-600 rounded"></div>
          <span className="text-gray-300">Answered</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-yellow-600 rounded"></div>
          <span className="text-gray-300">Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-700 rounded"></div>
          <span className="text-gray-300">Not Visited</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionOverview;