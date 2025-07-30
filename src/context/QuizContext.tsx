'use client'

import { Question, QuizState } from "@/types/quiz";
import { createContext, ReactNode, useContext, useReducer, useState,useCallback} from "react";

interface QuizContextType{
    state:QuizState;
    questions:Question[];
    setQuestions:(questions:Question[])=>void;
    setCurrentQuestion:(index:number)=>void;
    setAnswer:(questionIndex:number,answer:string)=>void;
    visitQuestion:(index:number)=>void;
    updateTimer:(time:number)=>void;
    submitQuiz:()=>void;
    userEmail:string;
    setUserEmail:(email:string)=>void;
}

interface Props{
    children:ReactNode;
}

const QuizContext=createContext<QuizContextType|undefined>(undefined);

type QuizAction=
    | {type: 'SET_CURRENT_QUESTION',payload:number}
    | {type: 'SET_ANSWER',payload:{questionIndex:number,answer:string}}
    | {type: 'VISIT_QUESTION', payload:number}
    | {type: 'UPDATE_TIMER',payload:number}
    | {type: 'SUBMIT_QUIZ'};

const quizReducer=(state:QuizState,action:QuizAction):QuizState=>{
    switch(action.type){
        case 'SET_CURRENT_QUESTION':
            return {...state,currentQuestion:action.payload};
        case 'SET_ANSWER':
            return {
                ...state,
            answers: {...state.answers,[action.payload.questionIndex]:action.payload.answer}
        };
        case 'VISIT_QUESTION':
            return {
                ...state,
                visitedQuestions: new Set([...state.visitedQuestions,action.payload])
            };
        case 'UPDATE_TIMER':
            return {...state,timeRemaining:action.payload};
        case 'SUBMIT_QUIZ':
            return {...state,isSubmitted:true};
        default:
            return state;
    
    }
};

const initialState:QuizState={
    currentQuestion:0,
    answers:{},
    visitedQuestions: new Set(),
    timeRemaining: 30*60, // 30 minutes in seconds
    isSubmitted:false
}


export const QuizProvider: React.FC<{children:ReactNode}>=({children})=>{
    const [state,dispatch]=useReducer(quizReducer,initialState);
    const [questions,setQuestions]=useState<Question[]>([]);
    const [userEmail,setUserEmail]=useState<string>('');

    const setQuestionsCallback=useCallback((newQuestions:Question[])=>{
        setQuestions(newQuestions);
    },[]);

    const setCurrentQuestion=(index:number)=>{
        dispatch({type:'SET_CURRENT_QUESTION',payload:index});
        dispatch({type:'VISIT_QUESTION',payload:index});
    }

    const setAnswer=(questionIndex:number,answer:string)=>{
        dispatch({type:'SET_ANSWER',payload:{questionIndex,answer}});
    }

    const visitQuestion=(index:number)=>{
        dispatch({type:'VISIT_QUESTION',payload:index});
    }

    const updateTimer=(time:number)=>{
        dispatch({type:'UPDATE_TIMER',payload:time});
    }

    const submitQuiz=()=>{
        dispatch({type:'SUBMIT_QUIZ'});
    };

    return (
        <QuizContext.Provider
            value={{
                state,
                questions,
                setQuestions:setQuestionsCallback,
                setCurrentQuestion,
                setAnswer,
                visitQuestion,
                updateTimer,
                submitQuiz,
                userEmail,
                setUserEmail
            }}
        >
            {children}
        </QuizContext.Provider>
    )
}

export const useQuiz=()=>{
    const context=useContext(QuizContext);
    if(context===undefined){
        throw new Error('useQuiz must be usde within a QuizProvider');
    }
    return context;
}

