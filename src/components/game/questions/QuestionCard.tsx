import React from 'react';
import { Question } from '../../../types/game';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  isAnswered: boolean;
  userAnswer?: string;
  onAnswer: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isAnswered,
  userAnswer,
  onAnswer,
}) => {
  const isCorrect = userAnswer === question.correctAnswer;

  return (
    <div className={`p-4 rounded-lg transition-all duration-300 ${
      isAnswered 
        ? isCorrect 
          ? 'bg-emerald-900/20 border border-emerald-500/30'
          : 'bg-red-900/20 border border-red-500/30'
        : 'bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-grow">
          <h3 className="text-lg font-medium text-white mb-3">
            {question.text}
          </h3>
          
          {!isAnswered ? (
            <div className="grid grid-cols-2 gap-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onAnswer(option)}
                  className="p-3 text-center rounded-md border border-slate-600
                    hover:border-blue-500 hover:bg-blue-500/20
                    transition-all duration-300 text-slate-300 hover:text-white"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className={`font-medium ${
                isCorrect ? 'text-emerald-400' : 'text-red-400'
              }`}>
                Your answer: {userAnswer}
              </span>
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
          )}
        </div>
      </div>
      
      {isAnswered && !isCorrect && (
        <div className="mt-4 p-3 bg-slate-800/50 rounded-md border border-slate-700/50">
          <p className="text-sm text-slate-400">
            <span className="text-emerald-400 font-medium">Correct Answer: </span>
            {question.correctAnswer}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            <span className="text-blue-400 font-medium">Hint: </span>
            {question.hint}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;