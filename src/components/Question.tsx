'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { decodeHtmlEntities, getChoicesForQuestion } from '@/utils/quiz';

const Question: React.FC = () => {
  const { state, questions, setAnswer } = useQuiz();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const currentQuestion = questions[state.currentQuestion];

  const choices = useMemo(() => {
    if (!currentQuestion) return [];
    return getChoicesForQuestion(currentQuestion);
  }, [currentQuestion?.question]);

  useEffect(() => {
    if (currentQuestion) {
      setSelectedAnswer(state.answers[state.currentQuestion] || '');
    }
  }, [currentQuestion, state.currentQuestion, state.answers]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setAnswer(state.currentQuestion, answer);
  };

  if (!currentQuestion) {
    return <div className="text-gray-300">Loading question...</div>;
  }

  // Format category for better display
  const displayCategory = currentQuestion.category
    .replace(/Entertainment:/, '')
    .replace(/Science:/, '')
    .trim();

  const getDifficultyStyle = () => {
    switch (currentQuestion.difficulty) {
      case 'easy':
        return 'bg-green-900 text-green-300';
      case 'medium':
        return 'bg-yellow-900 text-yellow-300';
      case 'hard':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-blue-900 text-blue-300';
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 animate-slideIn">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-400">
          Category: {displayCategory}
        </span>
        <span className={`text-sm px-3 py-1 rounded-full ${getDifficultyStyle()}`}>
          {currentQuestion.difficulty.toUpperCase()}
        </span>
      </div>
      
      <h2 className="text-xl font-semibold mb-6 text-white">
        {decodeHtmlEntities(currentQuestion.question)}
      </h2>

      <div className="space-y-3">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(choice)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all transform hover:scale-[1.01] ${
              selectedAnswer === choice
                ? 'border-blue-500 bg-gray-700 text-white'
                : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600'
            }`}
          >
            <span className="font-medium mr-3 text-blue-400">
              {String.fromCharCode(65 + index)}.
            </span>
            {decodeHtmlEntities(choice)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;