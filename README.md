# Interactive Quiz Application

An engaging quiz application built with Next.js and TypeScript that offers a smooth, responsive quiz-taking experience with a sleek dark theme UI.

## 📋 Brief Overview

This quiz application provides an interactive trivia experience where users can test their knowledge across various categories. The app features a modern dark theme interface, real-time timer, and comprehensive results tracking.

### Key Components Built:

- **Quiz Interface**: Interactive question display with multiple choice options
- **Timer Component**: Real-time countdown with visual warnings
- **Question Navigation**: Grid-based overview allowing free navigation between questions
- **Results Dashboard**: Question-by-Question review
- **State Management**: Context-based state handling for quiz flow

### Approach to the Problem:

- **API Integration**: Utilized Open Trivia Database API for dynamic question generation
- **Responsive Design**: Mobile-first approach with Tailwind CSS for consistent styling
- **Performance Optimization**: Implemented useMemo and useCallback for efficient rendering
- **Error Handling**: Robust error management with user-friendly feedback
- **State Persistence**: Context API for maintaining quiz state across components

## 🚀 Features

- **15 Trivia Questions** from various categories using the Open Trivia Database API
- **Modern Dark Theme UI** with smooth animations and transitions
- **Interactive Question Navigation** allowing users to move between questions freely
- **30-minute Time Limit** with automatic submission when time expires
- **Results Page** showing question-by-question breakdown
- **Responsive Design** that works well on both desktop and mobile devices

## 💻 Tech Stack

- **Next.js 14** 
- **TypeScript** 
- **Tailwind CSS**

## 🛠️ Setup and Installation Instructions

### Prerequisites
- Node.js 18.0 or later
- npm, yarn, pnpm, or bun package manager

### Installation Steps

1. **Clone the repository:**
```bash
git clone https://github.com/Vinayak2k03/QuizApp.git
cd quiz-app
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Run the development server:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

5. **Build for production:**
```bash
npm run build
npm start
```

## 🔧 Assumptions Made

- **Internet Connection**: The application assumes a stable internet connection for fetching questions from the Open Trivia Database API
- **API Availability**: Assumes the Open Trivia Database API is available and responsive

## 🚧 Challenges Faced and Solutions

### 1. API Rate Limiting (429 Errors)
**Challenge**: The Open Trivia DB API has rate limits that were causing "Too Many Requests" errors.

**Solution**: 
- Implemented a `fetchInProgress` ref to prevent duplicate API calls
- Added retry logic with exponential backoff
- Optimized useEffect dependencies to prevent unnecessary re-renders

### 2. HTML Entity Decoding
**Challenge**: Questions and categories from the API contained HTML entities like `&amp;`, `&quot;`, etc.

**Solution**: 
- Created a `decodeHtmlEntities` utility function using browser's native textarea element
- Applied decoding to questions, answers, and categories consistently

### 3. Option Shuffling Issues
**Challenge**: Answer options were getting re-shuffled when users selected them or navigated between questions.

**Solution**: 
- Implemented `useMemo` to ensure choices are only generated when the actual question changes
- Used Fisher-Yates shuffle algorithm for unbiased randomization
- Prevented re-computation on component re-renders

### 4. State Management Complexity
**Challenge**: Managing quiz state across multiple components while maintaining data consistency.

**Solution**: 
- Implemented React Context API with useReducer for predictable state updates
- Created specific action types for different state mutations
- Used `useCallback` to prevent unnecessary function re-creation

## 📄 Project Structure

```
/src
  /app
    /quiz         # Quiz page component
    /results      # Results page component
    page.tsx      # Home page with email entry
    layout.tsx    # Root layout component
  /components
    Question.tsx        # Individual question display
    Timer.tsx          # Countdown timer component
    QuestionOverview.tsx # Question navigation grid
    icons.tsx          # SVG icon components
  /context
    QuizContext.tsx    # Global state management
  /types
    quiz.ts           # TypeScript type definitions
  /utils
    quiz.ts           # Utility functions and helpers
```

## 🔜 Future Enhancements

- User accounts and quiz history tracking
- Customizable quiz settings (categories, difficulty, question count)
- Social sharing of results
- Offline mode with cached questions
- Accessibility improvements (ARIA labels, keyboard navigation)
- Dark/Light theme toggle

