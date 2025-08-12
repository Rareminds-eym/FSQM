import React, { useState } from 'react';
import { useDeviceLayout } from './hooks/useOrientation';
import {
  ChevronRight, CheckCircle, Target, Trophy
} from 'lucide-react';
import { Question } from './HackathonData';

interface Level2CardProps {
  question: Question;
  onAnswer: (answer: { solution: string }) => void;
  onNext: () => void;
  currentAnswer?: { solution?: string };
  level1Answers?: { violation?: string; rootCause?: string };
  session_id?: string | null;
  email?: string | null;
}

const Level2Card: React.FC<Level2CardProps> = ({
  question,
  onAnswer,
  onNext,
  currentAnswer,
  level1Answers
}) => {
  const [selectedSolution, setSelectedSolution] = useState(currentAnswer?.solution || '');
  const { isMobile, isHorizontal } = useDeviceLayout();
  const isMobileHorizontal = isMobile && isHorizontal;
  const [showCaseBrief, setShowCaseBrief] = useState(false);

  // Clear dropbox when question changes
  React.useEffect(() => {
    setSelectedSolution(currentAnswer?.solution || '');
  }, [question]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [innovationAnswer, setInnovationAnswer] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  type InnovationType = 'whatif' | 'challenge' | 'borrow';
  const [innovationType, setInnovationType] = useState<InnovationType>('whatif');

  // Map of violation/root cause to base process name
  const processMap: { [key: string]: string } = {
    'Documentation Practices': 'Documentation Practices',
    'Temperature Control': 'Temperature Control',
    'Dispensing & Material Handling': 'Dispensing & Material Handling',
    'Gowning SOP Violation': 'Gowning SOP Violation',
    'SOP Review & Documentation': 'SOP Review & Documentation',
    'Water System Monitoring': 'Water System Monitoring',
    'Artwork Management': 'Artwork Management',
    'Ineffective CAPA Management': 'Ineffective CAPA Management',
    'Personnel Training': 'Personnel Training',
    'Cleaning Validation': 'Cleaning Validation',
    'Line Clearance': 'Line Clearance',
    'Calibration': 'Calibration',
    'Equipment Maintenance': 'Equipment Maintenance',
    'Labeling and Packaging': 'Labeling and Packaging',
    'Material Management': 'Material Management',
    'Deviation Management': 'Deviation Management',
    'Process Compliance': 'Process Compliance',
    'Facility Maintenance': 'Facility Maintenance',
    'Cross Contamination': 'Cross Contamination',
    'Material Segregation': 'Material Segregation',
  };

  // Use the innovation question from the question object if available
  const innovationQuestion =
    innovationType === 'whatif'
      ? question.innovationWhatIf || ''
      : innovationType === 'challenge'
      ? question.innovationChallenge || ''
      : question.innovationBorrow || '';
  // Handler for innovation answer change
  const handleInnovationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInnovationAnswer(e.target.value);
  };

  // Handler for file attachment
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const canProceed = selectedSolution;

  // Props for question index and total (for button label)
  // If not provided, fallback to 0 and 5
  const questionIndex = (question as any).index ?? 0;
  const totalQuestions = (question as any).total ?? 5;
  const isLastQuestion = questionIndex === totalQuestions - 1;

  const handleSolutionSelect = (solution: string) => {
    setSelectedSolution(solution);
    onAnswer({ solution });
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const solution = e.dataTransfer.getData('text/plain');
    const droppedType = e.dataTransfer.getData('application/type');
    
    // Only accept solution drops
    if (solution && droppedType === 'solution') {
      handleSolutionSelect(solution);
    }
    
    setIsDragOver(false);
    setDraggedItem(null);
  };

  const handleDragStart = (e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('text/plain', item);
    e.dataTransfer.setData('application/type', 'solution');
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setIsDragOver(false);
  };

  return (
  <div className="flex flex-col bg-gray-800 overflow-hidden relative" style={{ height: 'calc(100vh - 80px)' }}>
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
    <div className="absolute inset-0 bg-scan-lines opacity-20"></div>
      {/* Case Brief */}
      {!isMobileHorizontal && (
        <div className="relative z-10 pixel-border bg-gradient-to-r from-cyan-600 to-blue-600 p-4 m-2 mb-0">
          <h3 className="text-cyan-100 font-black pixel-text mb-2">MISSION BRIEFING</h3>
          <p className="text-cyan-50 text-sm font-bold">{question.caseFile} Analyze the problem scenario and deploy the best solution. Attempt the innovative challenge after deploying your solution.</p>
        </div>
      )}
      {isMobileHorizontal && (
        <div className="flex justify-end p-2">
          <button
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-3 py-1 rounded-lg text-xs"
            onClick={() => setShowCaseBrief(true)}
          >
            Show Brief
          </button>
        </div>
      )}
      {isMobileHorizontal && showCaseBrief && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowCaseBrief(false)}>
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-cyan-500/20 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">CASE BRIEF</h3>
                <div className="bg-cyan-500/20 px-3 py-1 rounded-full">
                  <span className="text-cyan-300 font-bold text-sm">ACTIVE</span>
                </div>
              </div>
              <button
                onClick={() => setShowCaseBrief(false)}
                className="text-slate-400 hover:text-white transition-colors duration-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-cyan-500/20">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 animate-pulse flex-shrink-0"></div>
                <p className="text-gray-200 text-sm leading-relaxed">{question.caseFile}</p>
              </div>
            </div>
          </div>
        </div>
      )}

  {/* Main Content */}
    <div className="relative z-10 flex-1 flex p-2 space-x-3">
      {/* INTEL REPORT FROM L1 */}
      <div className="w-1/3 flex-shrink-0">
        <div className="pixel-border-thick bg-gray-800 p-4 h-full overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
          <div className="absolute inset-0 bg-scan-lines opacity-20"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center space-x-2 mb-3 flex-shrink-0">
              <div className="w-6 h-6 bg-blue-500 pixel-border flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-900" />
              </div>
              <div>
                <h2 className="text-sm font-black text-blue-300 pixel-text">INTEL REPORT FROM L1</h2>
                <div className="text-xs text-gray-400 font-bold">VIOLATION & ROOT CAUSE</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                <div className="p-2 rounded border border-blue-500/50 bg-blue-500/20">
                  <h4 className="text-blue-300 font-bold text-xs mb-1">VIOLATION:</h4>
                  <p className="text-white text-xs">{level1Answers?.violation || 'Not identified'}</p>
                </div>
                <div className="p-2 rounded border border-blue-500/50 bg-blue-500/20">
                  <h4 className="text-blue-300 font-bold text-xs mb-1">ROOT CAUSE:</h4>
                  <p className="text-white text-xs">{level1Answers?.rootCause || 'Not identified'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DEPLOYMENT ZONE */}
      <div className="flex-1 animate-slideIn" style={{ animationDelay: '0ms' }}>
        <div className="pixel-border-thick bg-gradient-to-br from-blue-500 to-blue-700 h-full relative overflow-hidden transition-all duration-300 rounded-lg flex flex-col">
          <div className="relative z-10 p-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-300 pixel-border flex items-center justify-center">
                  <Trophy className="w-3 h-3 text-blue-900" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white pixel-text">DEPLOYMENT ZONE</h3>
                  <div className="text-white/80 text-xs">Drop Solution Here</div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-3 pb-3 flex-1 min-h-0 overflow-y-auto relative z-10">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`h-full flex items-center justify-center border-2 border-dashed rounded-lg transition-all ${
                isDragOver
                  ? 'border-blue-400 bg-blue-500/20 scale-105'
                  : selectedSolution
                  ? 'border-blue-500/50 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-700/50'
              }`}
            >
              {selectedSolution ? (
                <div className="h-full flex flex-col w-full">
                  <div className="text-center py-2 border-b border-blue-300/30">
                    <div className="w-8 h-8 bg-blue-300 pixel-border mx-auto mb-1 flex items-center justify-center animate-pulse">
                      <CheckCircle className="w-5 h-5 text-blue-900" />
                    </div>
                    <p className="text-blue-100 font-black pixel-text text-xs">SOLUTION DEPLOYED!</p>
                  </div>
                  <div className="flex-1 p-3 flex items-center justify-center">
                    <div className="w-full">
                      <div className="pixel-border-thick bg-gradient-to-r from-blue-400 to-blue-600 p-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-pixel-pattern opacity-20"></div>
                        <div className="relative z-10 text-center">
                          <div className="w-6 h-6 bg-blue-200 pixel-border mx-auto mb-2 flex items-center justify-center">
                            <Trophy className="w-4 h-4 text-blue-900" />
                          </div>
                          <p className="text-white text-xs font-black pixel-text leading-tight">{selectedSolution}</p>
                        </div>
                        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-200 rounded-full animate-ping"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-white/20 mx-auto mb-3 flex items-center justify-center rounded-full">
                    <Trophy className="w-8 h-8 text-white/60" />
                  </div>
                  <p className="text-white/80 font-bold text-sm">DROP ZONE</p>
                  <p className="text-white/60 text-xs">Drag solution here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SOLUTION ARSENAL */}
      <div className="w-1/3 flex-shrink-0">
        <div className="pixel-border-thick bg-gray-800 p-4 h-full overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
          <div className="absolute inset-0 bg-scan-lines opacity-20"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center space-x-2 mb-3 flex-shrink-0">
              <div className="w-6 h-6 bg-blue-500 pixel-border flex items-center justify-center">
                <Trophy className="w-4 h-4 text-blue-900" />
              </div>
              <div>
                <h2 className="text-sm font-black text-blue-300 pixel-text">SOLUTION ARSENAL</h2>
                <div className="text-xs text-gray-400 font-bold">SOLUTIONS: {question.solutionOptions.length}</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {question.solutionOptions.map((option, index) => (
                  <div
                    key={option}
                    draggable
                    onDragStart={(e) => handleDragStart(e, option)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleSolutionSelect(option)}
                    className={`animate-slideIn p-2 rounded pixel-border cursor-grab transition-all ${
                      selectedSolution === option
                        ? 'border-blue-400 bg-blue-500/20'
                        : 'border-slate-600 bg-slate-700/50 hover:border-blue-500/50'
                    } ${draggedItem === option ? 'opacity-50' : ''}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-white text-sm font-bold pixel-text">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Innovation Section */}
    <div className="w-full pixel-border-thick bg-gray-800 p-4 border border-blue-500/20 mt-2 relative z-10">
      <h3 className="text-blue-400 font-bold pixel-text mb-2">INNOVATION ZONE</h3>
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
        <label className="text-slate-300 text-sm font-medium mb-1 md:mb-0">Select question type:</label>
        <select
          className="rounded border border-slate-600 bg-slate-700/50 text-white px-2 py-1 focus:outline-none focus:border-blue-400"
          value={innovationType}
          onChange={e => setInnovationType(e.target.value as InnovationType)}
        >
          <option value="whatif">What if (process redesign)</option>
          <option value="challenge">Challenge the Process (remove a key step)</option>
          <option value="borrow">Borrow from Another Industry</option>
        </select>
      </div>
      <p className="text-white mb-2 pixel-text">{innovationQuestion}</p>
      <textarea
        className="w-full p-2 rounded border border-slate-600 bg-slate-700/50 text-white mb-2 resize-none focus:outline-none focus:border-blue-400 pixel-text"
        rows={3}
        placeholder="Type your innovative solution here..."
        value={innovationAnswer}
        onChange={handleInnovationChange}
      />
      <div className="flex items-center space-x-3">
        <label className="text-slate-300 text-sm font-medium">
          Attach document:
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.zip,.rar,.7z,.tar,.gz"
            className="ml-2 text-white file:bg-blue-600 file:text-white file:rounded file:px-2 file:py-1 file:border-none file:cursor-pointer"
            onChange={handleFileChange}
          />
        </label>
        {attachedFile && (
          <span className="text-emerald-300 text-xs pixel-text">{attachedFile.name}</span>
        )}
      </div>
    </div>
    {/* Bottom Action Bar */}
    <div className="absolute bottom-4 right-4 z-20">
      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`flex items-center space-x-2 px-4 py-3 pixel-border font-black pixel-text transition-all shadow-lg ${
          canProceed
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white transform hover:scale-105 animate-pulse'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
        }`}
      >
        <span className="text-sm">{isLastQuestion ? 'Complete Mission' : 'Next Question'}</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
  );
};

export { Level2Card };
export default Level2Card;
