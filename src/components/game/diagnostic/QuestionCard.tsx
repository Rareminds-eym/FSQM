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
      className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
        isAnswered
          ? question.isRelevant
          ? 'bg-yellow-200/80 border border-yellow-600/30 shadow'
          : 'bg-yellow-200/80 border border-orange-400/30 shadow'
        : 'bg-yellow-100/80 hover:bg-yellow-200/80 border border-yellow-500/30 hover:border-yellow-600/40 shadow'
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
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </motion.div>
            ) : (
              <HelpCircle className="w-5 h-5 text-yellow-800" />
            )}
          </AnimatePresence>
        </div>
        <div>
          <p className="text-yellow-900 font-medium">{question.text}</p>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2"
            >
              <p className={`text-sm font-medium ${
                question.isRelevant ? 'text-green-700' : 'text-red-700'
              }`}>
                Answer: {question.answer}
              </p>
              {!question.isRelevant && question.explanation && (
                <p className="text-sm text-orange-800/90 mt-1">
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