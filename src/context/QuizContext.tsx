'use client';

import { Question, QuizState } from "@/types/quiz";
import { createContext, ReactNode, useContext, useReducer, useState, useCallback } from "react";

// Define the shape of our context data
interface QuizContextType {
  state: QuizState;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionIndex: number, answer: string) => void;
  visitQuestion: (index: number) => void;
  updateTimer: (time: number) => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
}

interface Props {
  children: ReactNode;
}

// Create context with undefined default value
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Initial state for the quiz reducer
const initialState: QuizState = {
  currentQuestion: 0,
  answers: {},
  visitedQuestions: new Set<number>([0]), // Start with first question as visited
  timeRemaining: 30 * 60, // 30 minutes in seconds
  isSubmitted: false,
};

// Define action types for our reducer
type QuizAction =
  | { type: 'SET_CURRENT_QUESTION'; payload: number }
  | { type: 'SET_ANSWER'; payload: { questionIndex: number; answer: string } }
  | { type: 'VISIT_QUESTION'; payload: number }
  | { type: 'UPDATE_TIMER'; payload: number }
  | { type: 'SUBMIT_QUIZ' }
  | { type: 'RESET_QUIZ' };

// Reducer function to handle state updates in a predictable way
const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'SET_CURRENT_QUESTION':
      return {
        ...state,
        currentQuestion: action.payload,
      };
    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionIndex]: action.payload.answer,
        },
      };
    case 'VISIT_QUESTION':
      // Create a new Set from the existing one and add the new visited question
      const updatedVisited = new Set(state.visitedQuestions);
      updatedVisited.add(action.payload);
      return {
        ...state,
        visitedQuestions: updatedVisited,
      };
    case 'UPDATE_TIMER':
      return {
        ...state,
        timeRemaining: action.payload,
      };
    case 'SUBMIT_QUIZ':
      return {
        ...state,
        isSubmitted: true,
      };
    case 'RESET_QUIZ':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

// Provider component that wraps the app to provide quiz state
export const QuizProvider: React.FC<Props> = ({ children }) => {
  // Use reducer for complex state logic
  const [state, dispatch] = useReducer(quizReducer, initialState);
  // Simple state for questions and user email
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');

  // Wrap setQuestions in useCallback to prevent unnecessary re-renders
  // This helps prevent multiple API calls in useEffect dependencies
  const setQuestionsCallback = useCallback((newQuestions: Question[]) => {
    setQuestions(newQuestions);
  }, []);

  // Define helper functions for manipulating quiz state
  const setCurrentQuestion = (index: number) => {
    dispatch({ type: 'SET_CURRENT_QUESTION', payload: index });
    dispatch({ type: 'VISIT_QUESTION', payload: index });
  };

  const setAnswer = (questionIndex: number, answer: string) => {
    dispatch({
      type: 'SET_ANSWER',
      payload: { questionIndex, answer },
    });
  };

  const visitQuestion = (index: number) => {
    dispatch({ type: 'VISIT_QUESTION', payload: index });
  };

  const updateTimer = (time: number) => {
    dispatch({ type: 'UPDATE_TIMER', payload: time });
  };

  const submitQuiz = () => {
    dispatch({ type: 'SUBMIT_QUIZ' });
  };

  const resetQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
    setQuestions([]);
  };

  return (
    <QuizContext.Provider
      value={{
        state,
        questions,
        setQuestions: setQuestionsCallback,
        setCurrentQuestion,
        setAnswer,
        visitQuestion,
        updateTimer,
        submitQuiz,
        resetQuiz,
        userEmail,
        setUserEmail,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook to use the quiz context
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};