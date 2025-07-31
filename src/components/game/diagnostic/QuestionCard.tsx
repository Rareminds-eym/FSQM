import React from 'react';
import { DiagnosticQuestion } from '../../../types/game';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSound } from '../../../hooks/useSound';

interface QuestionCardProps {
  question: DiagnosticQuestion;
  isAnswered: boolean;
  onSelect: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isAnswered,
  onSelect,
}) => {
  const { playClick } = useSound();

  const handleClick = () => {
    if (!isAnswered) {
      playClick();
      onSelect();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isAnswered}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`w-full text-left p-2 md:p-4 border-2 rounded-2xl transition-all duration-300  ${
        isAnswered
          ? question.isRelevant
            ? 'bg-green-50   border-emerald-300'
            : 'bg-red-50  border-red-300'
          : 'bg-yellow-400/40 hover:bg-yellow-400  border border-yellow-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <AnimatePresence mode="wait">
            {isAnswered ? (
              <motion.div
                key="answered"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                {question.isRelevant ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </motion.div>
            ) : (
              <HelpCircle className="w-5 h-5 text-black" />
            )}
          </AnimatePresence>
        </div>

        <div>
          <p className="text-black text-sm md:text-lg">{question.text}</p>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2"
            >
              <p className={`text-sm font-medium ${
                question.isRelevant ? 'text-emerald-400' : 'text-red-400'
              }`}>
                Answer: {question.answer}
              </p>
              {!question.isRelevant && question.explanation && (
                <p className="text-sm text-red-300 mt-1">
                  Note: {question.explanation}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default QuestionCard;