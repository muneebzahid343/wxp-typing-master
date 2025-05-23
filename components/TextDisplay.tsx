
import React from 'react';
import { TestStatus } from '../types';

interface TextDisplayProps {
  passage: string;
  typedText: string;
  status: TestStatus;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({ passage, typedText, status }) => {
  return (
    <div
      className="text-2xl md:text-3xl leading-relaxed font-mono p-4 bg-slate-900/50 rounded-lg border border-dark-accent min-h-[150px] md:min-h-[200px] overflow-y-auto"
      style={{ filter: status !== TestStatus.Running ? 'blur(2px)' : 'none' }}
    >
      {passage.split('').map((char, index) => {
        let charClass = 'text-slate-500'; // Untyped

        if (index < typedText.length) { // Typed character
          if (typedText[index] === char) {
            charClass = 'text-emerald-400'; // Correct
          } else {
            charClass = 'text-red-500 bg-red-800/60 rounded-[2px]'; // Incorrect
            if (char === ' ') { // Visually represent incorrect space
              return <span key={index} className={`px-[0.1em] ${charClass}`}>_</span>;
            }
          }
        } else if (index === typedText.length && status === TestStatus.Running) { // Current character
          charClass = 'text-yellow-400 animate-pulse-fast bg-slate-700/80 rounded-[2px] px-[0.1em]';
          if (char === ' ') {
             return <span key={index} className={charClass}>_</span>; // Make space cursor visible
          }
        }
        
        return <span key={index} className={charClass}>{char}</span>;
      })}
    </div>
  );
};
