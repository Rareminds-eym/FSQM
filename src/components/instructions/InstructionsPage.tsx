// import { Award, Battery, Brain, Home, Shield, Target, Zap } from 'lucide-react';
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import AnimatedTitle from '../ui/AnimatedTitle';
// import CircuitLines from '../ui/animations/CircuitLines';

// const InstructionsPage: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="flex-1 p-4 md:p-8 relative bg-yelloww overflow-hidden">
//       <CircuitLines />
      
//       <div className="max-w-4xl mx-auto relative z-10">
//         {/* Home Button */}
//         <div className="absolute left-0 top-0">
//           <button
//             onClick={() => navigate('/')}
//             className="group bg-gradient-to-b from-red-200 to-red-300 rounded-full shadow-lg p-4 text-black font-semibold  hover:scale-105 active:scale-95 
//               transform hover:-translate-y-1 hover:translate-x-1 border-2 border-red-100
//               transition-all duration-300"
//           >
//             <Home className="w-5 h-5 text-red-700 group-hover:text-blue-400 transition-colors duration-300" />
//           </button>
//         </div>

//         <div className="space-y-12 pt-16">
//           {/* Title */}
//           <div className="text-center space-y-4 mt-10">
//             <AnimatedTitle 
//               text="HOW TO PLAY" 
//               className="text-center"
//             />
//             <p className="text-black text-sm md:text-lg">
//               Master the art of Food Safety and Quality Management through interactive scenarios
//             </p>
//           </div>

//           {/* Instructions Sections */}
//           <div className="grid gap-4 md:gap-8">
//             <InstructionCard
//               icon={Target}
//               title="Objective"
//               description="Diagnose and resolve food safety issues by analyzing incidents, asking relevant questions, and selecting the correct resolution."
//             />

//             <InstructionCard
//               icon={Brain}
//               title="Diagnostic Process"
//               description="Each level presents a unique food safety scenario. Examine the situation, gather clues, and systematically investigate the problem through targeted questions."
//             />

//             <InstructionCard
//               icon={Battery}
//               title="Question Selection"
//               description="Choose questions carefully - some are relevant to the food safety investigation while others may be misleading. Your accuracy affects your final score."
//             />

//             <InstructionCard
//               icon={Shield}
//               title="Resolution"
//               description="After gathering sufficient information, select the most appropriate solution from the available options to resolve the food safety issue."
//             />

//             <InstructionCard
//               icon={Award}
//               title="Progress"
//               description="Complete levels to unlock new, more challenging food safety scenarios. Each successful investigation improves your expertise and unlocks advanced cases."
//             />

//             <InstructionCard
//               icon={Zap}
//               title="Tips"
//               description="Pay attention to clues, use hints when stuck, and learn from incorrect investigations to improve your food safety management skills."
//             />
//           </div>

//           {/* Start Button */}
//           <div className="text-center">
//             <button
//               onClick={() => navigate('/levels')}
//               className="px-8 py-3 bg-gradient-to-b from-yellow-200/85 to-yellow-300 rounded-full  shadow-lg p-4 
//               border-2 border-yellow-100 backdrop-blur-sm  hover:border-yellow-500/50
//               transform hover:-translate-y-1 transition-all duration-300"
//             >
//               Start Investigating
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const InstructionCard: React.FC<{
//   icon: React.FC<any>;
//   title: string;
//   description: string;
// }> = ({ icon: Icon, title, description }) => (
//   <div className=" backdrop-blur-sm p-3 md:p-6  
//     bg-gradient-to-b from-yellow-200  to-yellow-300 rounded-3xl border-2 border-yellow-500
//     transform hover:-translate-y-1 transition-all duration-300">

//     <div className="flex items-start gap-4">

//       <div className="p-1 bg-gradient-to-b from-yellow-200 via-transparent to-yellow-300 rounded-full">
//         <Icon className="w-8 h-8 md:w-10 md:h-10 shadow-lg  text-black/60 rounded-3xl bg-gradient-to-b from-yellow-100 via-transparent to-yellow-300 p-2 group-hover:text-blue-400
//             transition-colors duration-300" />
//       </div>

//       <div>
//         <h3 className="text-lg md:text-xl font-semibold text-slate-600 mb-2">{title}</h3>
//         <p className="text-sm md:text-xl text-slate-500">{description}</p>
//       </div>
//     </div>
//   </div>
// );

// export default InstructionsPage;

import { Award, Battery, Brain, Home, Shield, Target, Zap, Clock, Users, Trophy } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedTitle from '../ui/AnimatedTitle';
import CircuitLines from '../ui/animations/CircuitLines';

// Commented out original content - replaced with Safebite 2.0 instructions
/*
Original FSQM Instructions:
- Objective: Diagnose and resolve food safety issues
- Diagnostic Process: Examine situations and investigate problems
- Question Selection: Choose relevant questions carefully
- Resolution: Select appropriate solutions
- Progress: Complete levels to unlock new scenarios
- Tips: Pay attention to clues and learn from mistakes
*/

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
              text="Welcome to Level 2 of the Hackathon 🎉" 
              className="text-center"
            />
            <p className="text-black text-sm md:text-lg">
              Solution & Innovation Stage — read carefully and submit on time.
            </p>
          </div>

          {/* Hackathon Level 2 Info */}
          <div className="text-center bg-gradient-to-b from-red-200 to-red-300 rounded-3xl p-6 border-2 border-red-100">
            <h2 className="text-2xl font-bold text-black mb-4">🏆 Hackathon Level 2</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
              <div>
                <div className="font-semibold">Eligibility</div>
                <div>Only shortlisted teams that cleared Level 1</div>
              </div>
              <div>
                <div className="font-semibold">Team Size</div>
                <div>1 (solo) to 4 members</div>
              </div>
              <div>
                <div className="font-semibold">Time</div>
                <div>⏰ 3 hours from start</div>
              </div>
            </div>
          </div>

          {/* Instructions Sections */}
          <div className="grid gap-4 md:gap-8">
            <InstructionCard
              icon={Target}
              title="Scenario"
              description="Choose ONE scenario from the hackathon problem statements and stick to it."
            />

            <InstructionCard
              icon={Award}
              title="Submission"
              description="One PDF per person uploaded on the portal before the deadline. Max size: 2 MB. No late submissions."
            />

            <InstructionCard
              icon={Brain}
              title="Innovation PDF — Sections"
              description={`1) Problem Statement & Context
2) Root Cause / Risk Analysis (FSQM or GMP)
3) Solution Concept & Workflow
4) Implementation Plan (roles, timeline, resources)
5) Feasibility (cost, people, process, technology)
6) Impact at Scale & Compliance`}
            />

            <InstructionCard
              icon={Shield}
              title="Important Notes"
              description="Uploads are final (no edits). Plagiarism or copying leads to disqualification. Keep work original, practical, and relevant to Food Safety & Quality Managment"
            />
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={() => navigate('/levels')}
              className="px-8 py-3 bg-gradient-to-b from-yellow-200/85 to-yellow-300 rounded-full  shadow-lg p-4 
              border-2 border-yellow-100 backdrop-blur-sm  hover:border-yellow-500/50
              transform hover:-translate-y-1 transition-all duration-300 text-lg font-semibold"
            >
              🚀 Start Level 2
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
        <div className="text-sm md:text-xl text-slate-500">
          {description.includes('\n') ? (
            <div className="space-y-1">
              {description.split('\n').map((line, index) => (
                <div key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>{description}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default InstructionsPage;