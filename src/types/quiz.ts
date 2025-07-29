export interface Question{
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export interface QuizData{
    response_code: number;
    results: Question[];
}

export interface UserAnswer{
    questionIndex: number;
    answer: string;
}

export interface QuizState{
    currentQuestion:number;
    answers: {[key:number]:string};
    visitedQuestions: Set<number>;
    timeRemaining: number;
    isSubmitted: boolean;
}

