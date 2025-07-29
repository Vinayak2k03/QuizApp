'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import { decodeHtmlEntities } from '@/utils/quiz';

export default function ResultsPage() {
  const { state, questions, userEmail } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    if (!userEmail || !state.isSubmitted) {
      router.push('/');
    }
  }, [userEmail, state.isSubmitted, router]);

  if (!state.isSubmitted || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading results...</p>
        </div>
      </div>
    );
  }

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (state.answers[index] === question.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-center mb-4">Quiz Results</h1>
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {score}/{questions.length}
            </div>
            <div className="text-2xl text-gray-600 mb-4">
              {percentage}% Correct
            </div>
            <div className="text-lg text-gray-500">
              Email: {userEmail}
            </div>
          </div>
        </div>

        {/* Question Results */}
        <div className="space-y-4">
          {questions.map((question, index) => {
            const userAnswer = state.answers[index];
            const isCorrect = userAnswer === question.correct_answer;
            
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Question {index + 1}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                
                <p className="text-gray-800 mb-4">
                  {decodeHtmlEntities(question.question)}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Your Answer:</h4>
                    <p className={`p-3 rounded-lg ${
                      userAnswer ? (isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800') : 'bg-gray-50 text-gray-500'
                    }`}>
                      {userAnswer ? decodeHtmlEntities(userAnswer) : 'No answer provided'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Correct Answer:</h4>
                    <p className="p-3 rounded-lg bg-green-50 text-green-800">
                      {decodeHtmlEntities(question.correct_answer)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
}