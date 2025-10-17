import React from 'react';
import { AlertTriangle, Code, Shield, CheckCircle, BookOpen, Globe, ChevronRight } from 'lucide-react';

const ScenarioQuestion = ({ scenario, selectedAnswer, onAnswerSelect, showExplanation, isCorrect }) => {
  return (
    <div className="space-y-6">
      {/* Scenario Header */}
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-l-4 border-orange-500 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{scenario.title}</h3>
            <p className="text-sm text-orange-300">
              Scenario-Based Question • {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Context */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h4 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Scenario Context
        </h4>
        <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
          {scenario.context}
        </div>
      </div>

      {/* Diagram (if present) */}
      {scenario.diagram && (
        <div className="bg-slate-900 rounded-lg p-5 border border-slate-700 overflow-x-auto">
          <pre className="text-cyan-400 text-xs font-mono leading-relaxed">
            {scenario.diagram}
          </pre>
        </div>
      )}

      {/* Code Snippet (if present) */}
      {scenario.codeSnippet && (
        <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
            <Code className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-300 font-mono">
              {scenario.codeSnippet.language}
            </span>
          </div>
          <div className="p-5 overflow-x-auto">
            <pre className="text-sm text-slate-200 font-mono leading-relaxed">
              <code>{scenario.codeSnippet.code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Question */}
      <div className="bg-slate-800 rounded-lg p-5 border-2 border-cyan-500/50">
        <h4 className="text-white font-bold text-lg mb-4">{scenario.question}</h4>
        
        {/* Options */}
        <div className="space-y-3">
          {scenario.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === scenario.correct;
            
            let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all ';
            
            if (!showExplanation) {
              // Before answer is submitted
              buttonClass += isSelected
                ? 'border-cyan-500 bg-cyan-500/20 text-white'
                : 'border-slate-600 bg-slate-700 text-slate-200 hover:border-slate-500';
            } else {
              // After answer is submitted
              if (isCorrectAnswer) {
                buttonClass += 'border-green-500 bg-green-500/20 text-white';
              } else if (isSelected && !isCorrect) {
                buttonClass += 'border-red-500 bg-red-500/20 text-white';
              } else {
                buttonClass += 'border-slate-600 bg-slate-700/50 text-slate-400';
              }
            }

            return (
              <button
                key={index}
                onClick={() => !showExplanation && onAnswerSelect(index)}
                disabled={showExplanation}
                className={buttonClass}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-600 text-white flex items-center justify-center text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 text-sm leading-relaxed">{option}</span>
                  {showExplanation && isCorrectAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation (shown after answer) */}
      {showExplanation && (
        <div className={`rounded-lg p-5 border-2 ${
          isCorrect 
            ? 'bg-green-500/10 border-green-500' 
            : 'bg-red-500/10 border-red-500'
        }`}>
          <h4 className={`font-bold text-lg mb-3 ${
            isCorrect ? 'text-green-400' : 'text-red-400'
          }`}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </h4>
          
          <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line mb-4">
            {scenario.explanation}
          </div>

          {/* Learning Points */}
          {scenario.learningPoints && scenario.learningPoints.length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-4 mt-4">
              <h5 className="text-cyan-400 font-bold mb-2 text-sm">Key Learning Points:</h5>
              <ul className="space-y-2">
                {scenario.learningPoints.map((point, idx) => (
                  <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-cyan-400 flex-shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScenarioQuestion;
