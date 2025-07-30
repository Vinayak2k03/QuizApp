'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { decodeHtmlEntities, getChoicesForQuestion } from '@/utils/quiz';

const Question: React.FC = () => {
  // Access quiz state and functions from the context
  const { state, questions, setAnswer } = useQuiz();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  // Get the current question based on the current question index
  const currentQuestion = questions[state.currentQuestion];

  // useMemo ensures choices are only regenerated when the question changes
  // This prevents unnecessary re-shuffling of choices when component re-renders
  const choices = useMemo(() => {
    if (!currentQuestion) return [];
    return getChoicesForQuestion(currentQuestion);
  }, [currentQuestion?.question]);

  // Sync the selected answer with the global state when navigating between questions
  useEffect(() => {
    if (currentQuestion) {
      setSelectedAnswer(state.answers[state.currentQuestion] || '');
    }
  }, [currentQuestion, state.currentQuestion, state.answers]);

  // Update both local state and global state when an answer is selected
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setAnswer(state.currentQuestion, answer);
  };

  if (!currentQuestion) {
    return <div className="text-gray-300">Loading question...</div>;
  }

  // Clean up and decode the category text
  // OpenTDB API returns categories with prefixes like "Entertainment:" and HTML entities
  const displayCategory = decodeHtmlEntities(
    currentQuestion.category
      .replace(/Entertainment:/, '')
      .replace(/Science:/, '')
      .trim()
  );

  // Change difficulty badge color based on question difficulty
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
        {/* Map over choices array to render answer buttons */}
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
            {/* Convert index to letter (0 -> A, 1 -> B, etc.) */}
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