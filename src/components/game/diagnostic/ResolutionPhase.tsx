import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import React from 'react';
import { ResolutionOption } from '../../../types/game';

interface ResolutionPhaseProps {
  question: string;
  options: ResolutionOption[];
  selectedOption?: string[];
  onSelectOption: (optionId: string) => void;
  enabled: boolean;
}

const ResolutionPhase: React.FC<ResolutionPhaseProps> = ({
  question,
  options,
  selectedOption,
  onSelectOption,
  enabled
}) => {
  return (
    <>
      <h3 className="text-xl font-semibold text-yellow-900 mb-6">
        Resolution
      </h3>
      
      <p className="text-lg text-yellow-900 mb-6">{question}</p>
      
      <div className="grid gap-4">
        {options.map((option) => {
          const isSelected = selectedOption?.includes(option.id);
          const showResult = selectedOption?.includes(option.id);
          
          return (
            <motion.button
              key={option.id}
              onClick={() => !showResult && onSelectOption(option.id)}
              disabled={enabled}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                showResult
                  ? option.isCorrect
                  ? 'bg-yellow-200/80 border-green-500/30 shadow'
                  : isSelected
                    ? 'bg-yellow-200/80 border-orange-500/30 shadow'
                    : 'bg-yellow-100/80 border-yellow-500/30 shadow'
                : 'bg-yellow-100/80 hover:bg-yellow-200/80 border-yellow-500/30 hover:border-yellow-600/40 shadow'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-yellow-900 font-medium">{option.text}</span>
                {showResult && (option.isCorrect || isSelected) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {option.isCorrect
                      ? <CheckCircle className="w-5 h-5 text-green-600" />
                      : <XCircle className="w-5 h-5 text-red-600" />
                    }
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </>
  );
};

export default ResolutionPhase;