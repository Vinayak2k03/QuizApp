import { Question } from "@/types/quiz";

/**
 * Implementing shuffle algorithm for unbiased randomization
 * Creates a new array to avoid mutating the original
 */
export const shuffleArray=<T>(array:T[]):T[]=>{
    const shuffled=[...array];
    for(let i=shuffled.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];
    }
    return shuffled;
};

/**
 * Uses DOM textarea to safely decode HTML entities
 * Browsers handle complex entities better than regex replacements
 */
export const decodeHtmlEntities=(text:string):string=>{
    const textarea=document.createElement("textarea");
    textarea.innerHTML=text;
    return textarea.value;
}

/**
 * Formats time with leading zeros for consistent display
 */
export const formatTime=(seconds:number):string=>{
    const minutes=Math.floor(seconds/60);
    const remainingSeconds=seconds%60;
    return `${minutes.toString().padStart(2,"0")}:${remainingSeconds.toString().padStart(2,"0")}`;
}

/**
 * Ensures the correct answer is randomly positioned among incorrect ones
 */
export const getChoicesForQuestion=(question:Question):string[]=>{
    const choices=[...question.incorrect_answers,question.correct_answer];
    return shuffleArray(choices);
}