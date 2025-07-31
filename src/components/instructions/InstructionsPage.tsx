import { Award, Battery, Brain, Home, Shield, Target, Zap } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedTitle from '../ui/AnimatedTitle';
import CircuitLines from '../ui/animations/CircuitLines';

const InstructionsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-4 md:p-8 relative bg-yelloww overflow-hidden">
      <CircuitLines />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Home Button */}
        <div className="absolute left-0 top-0">
          <button
            onClick={() => navigate('/')}
            className="group bg-gradient-to-b from-red-200 to-red-300 rounded-full shadow-lg p-4 text-black font-semibold  hover:scale-105 active:scale-95 
              transform hover:-translate-y-1 hover:translate-x-1 border-2 border-red-100
              transition-all duration-300"
          >
            <Home className="w-5 h-5 text-red-700 group-hover:text-blue-400 transition-colors duration-300" />
          </button>
        </div>

        <div className="space-y-12 pt-16">
          {/* Title */}
          <div className="text-center space-y-4 mt-10">
            <AnimatedTitle 
              text="HOW TO PLAY" 
              className="text-center"
            />
            <p className="text-black text-sm md:text-lg">
              Master the art of Food Safety and Quality Management through interactive scenarios
            </p>
          </div>

          {/* Instructions Sections */}
          <div className="grid gap-4 md:gap-8">
            <InstructionCard
              icon={Target}
              title="Objective"
              description="Diagnose and resolve EV battery issues by analyzing symptoms, asking relevant questions, and selecting the correct resolution."
            />

            <InstructionCard
              icon={Brain}
              title="Diagnostic Process"
              description="Each level presents a unique battery issue. Examine the symptoms, gather clues, and systematically investigate the problem through targeted questions."
            />

            <InstructionCard
              icon={Battery}
              title="Question Selection"
              description="Choose questions carefully - some are relevant to the diagnosis while others may be misleading. Your accuracy affects your final score."
            />

            <InstructionCard
              icon={Shield}
              title="Resolution"
              description="After gathering sufficient information, select the most appropriate solution from the available options to resolve the battery issue."
            />

            <InstructionCard
              icon={Award}
              title="Progress"
              description="Complete levels to unlock new, more challenging scenarios. Each successful diagnosis improves your expertise and unlocks advanced cases."
            />

            <InstructionCard
              icon={Zap}
              title="Tips"
              description="Pay attention to clues, use hints when stuck, and learn from incorrect diagnoses to improve your troubleshooting skills."
            />
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={() => navigate('/levels')}
              className="px-8 py-3 bg-gradient-to-b from-yellow-200/85 to-yellow-300 rounded-full  shadow-lg p-4 
              border-2 border-yellow-100 backdrop-blur-sm  hover:border-yellow-500/50
              transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Diagnosing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InstructionCard: React.FC<{
  icon: React.FC<any>;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <div className=" backdrop-blur-sm p-3 md:p-6  
    bg-gradient-to-b from-yellow-200  to-yellow-300 rounded-3xl border-2 border-yellow-500
    transform hover:-translate-y-1 transition-all duration-300">

    <div className="flex items-start gap-4">

      <div className="p-1 bg-gradient-to-b from-yellow-200 via-transparent to-yellow-300 rounded-full">
        <Icon className="w-8 h-8 md:w-10 md:h-10 shadow-lg  text-black/60 rounded-3xl bg-gradient-to-b from-yellow-100 via-transparent to-yellow-300 p-2 group-hover:text-blue-400
            transition-colors duration-300" />
      </div>

      <div>
        <h3 className="text-lg md:text-xl font-semibold text-slate-600 mb-2">{title}</h3>
        <p className="text-sm md:text-xl text-slate-500">{description}</p>
      </div>
    </div>
  </div>
);

export default InstructionsPage;