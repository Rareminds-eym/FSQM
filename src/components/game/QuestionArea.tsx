import React from 'react';
import { Question } from '../../types/game';

interface QuestionAreaProps {
  question: Question;
  onAnswer: (answer: string) => void;
  totalQuestions: number;
  currentQuestion: number;
}

const QuestionArea: React.FC<QuestionAreaProps> = ({
  question,
  onAnswer,
  totalQuestions,
  currentQuestion,
}) => {
  if (!question) return null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
      <div className="mb-6">
        <div className="text-slate-400 mb-2">
          Question {currentQuestion} of {totalQuestions}
        </div>
        <h2 className="text-xl font-medium text-white mb-4">
          {question.text}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            className="w-full text-left p-4 rounded-lg border border-slate-600
              hover:border-blue-500 hover:bg-slate-700/50
              transition-all duration-300 text-slate-300 hover:text-white"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionArea;