'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { decodeHtmlEntities, getChoicesForQuestion } from '@/utils/quiz';

const Question: React.FC = () => {
  const { state, questions, setAnswer } = useQuiz();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const currentQuestion = questions[state.currentQuestion];

  const choices=useMemo(()=>{
    if(!currentQuestion) return [];
    return getChoicesForQuestion(currentQuestion);
  },[currentQuestion?.question]);

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
    return <div>Loading question...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <span className="text-sm text-gray-500">
          Question {state.currentQuestion + 1} of {questions.length}
        </span>
        <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {currentQuestion.difficulty}
        </span>
      </div>
      
      <h2 className="text-xl font-semibold mb-6">
        {decodeHtmlEntities(currentQuestion.question)}
      </h2>

      <div className="space-y-3">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(choice)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
              selectedAnswer === choice
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="font-medium mr-3">
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