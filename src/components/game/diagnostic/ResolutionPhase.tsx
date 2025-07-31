import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import React from 'react';
import { ResolutionOption } from '../../../types/game';
import { useSound } from '../../../hooks/useSound';  

interface ResolutionPhaseProps {
  question: string;
  options: ResolutionOption[];
  selectedOption?: string[];
  onSelectOption: (optionId: string) => void;
  enabled: boolean;
  showResult: boolean;
}

const ResolutionPhase: React.FC<ResolutionPhaseProps> = ({
  question,
  options,
  selectedOption,
  onSelectOption,
  enabled,
  showResult
}) => {
  
  const { playSuccess, playError } = useSound();

  // Handle option selection
  const handleOptionSelect = (optionId: string, isCorrect: boolean) => {
    if (isCorrect) {
      playSuccess(); 
    } else {
      playError();
    }
    onSelectOption(optionId);  
  };

  return (
    <div className="bg-gray-50 p-2 md:p-6 rounded-3xl border-4 border-gray-200 mt-10 shadow-xl">
      <h3 className="text-lg font-medium text-black mb-3">Resolution</h3>
      
      <p className="text-sm md:text-lg text-black/50 mb-3 md:mb-6">{question}</p>
      
      <div className="grid gap-4">
        {options.map((option) => {
          const isSelected = selectedOption?.includes(option.id);
          const showResultForOption = selectedOption?.includes(option.id);
          
          return (
            <motion.button
              key={option.id}
              onClick={() => !showResult && handleOptionSelect(option.id, option.isCorrect)}
              disabled={enabled}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              className={`p-4 rounded-2xl border transition-all duration-300 text-sm md:text-lg ${
                showResultForOption
                  ? option.isCorrect
                    ? 'text-sm md:text-lg bg-emerald-900/20 border-emerald-500/30'
                    : isSelected
                      ? 'bg-red-50 border-red-300'
                      : 'bg-yellow-400/40 hover:bg-yellow-400 border border-yellow-200'
                  : 'bg-yellow-400/40 hover:bg-yellow-400 border border-yellow-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-black">{option.text}</span>
                
                {showResultForOption && (option.isCorrect || isSelected) && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    {option.isCorrect ? (
                      <>
                        {playSuccess()} &&
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </>
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ResolutionPhase;
