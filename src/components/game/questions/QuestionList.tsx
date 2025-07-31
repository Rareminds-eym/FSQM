import React from 'react';
import { Question } from '../../../types/game';
import QuestionCard from './QuestionCard';

interface QuestionListProps {
  questions: Question[];
  answers: string[];
  onAnswer: (answer: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, answers, onAnswer }) => {
  return (
    <div className="space-y-4 mt-8">
      {questions.map((question, index) => (
        <QuestionCard
          key={index}
          question={question}
          isAnswered={index < answers.length}
          userAnswer={answers[index]}
          onAnswer={onAnswer}
        />
      ))}
    </div>
  );
}

export default QuestionList;