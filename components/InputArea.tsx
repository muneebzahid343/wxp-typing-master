
import React, { forwardRef } from 'react';

interface InputAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  passageLength: number;
}

export const InputArea = forwardRef<HTMLTextAreaElement, InputAreaProps>(
  ({ value, onChange, disabled, passageLength }, ref) => {
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
    };

    return (
      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onPaste={handlePaste}
          className="w-full h-28 p-4 bg-dark-card text-text-light border-2 border-dark-accent rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-none font-mono text-lg shadow-lg transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder={disabled ? "Test not active. Click Start or Restart." : "Start typing here..."}
          spellCheck="false"
          autoCapitalize="none"
          autoCorrect="off"
          maxLength={passageLength > 0 ? passageLength + 20 : 200} // Allow some overtyping
        />
         <div className="absolute bottom-2 right-3 text-xs text-text-dim">
          {value.length} / {passageLength > 0 ? passageLength : '?'}
        </div>
      </div>
    );
  }
);

InputArea.displayName = 'InputArea';
