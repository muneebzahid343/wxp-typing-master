
import React from 'react';

interface ControlButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  icon,
  className = ''
}) => {
  const baseStyle = "px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 shadow-md hover:shadow-lg flex items-center justify-center";
  
  const primaryStyle = "bg-brand-primary text-dark-bg hover:bg-opacity-80 focus:ring-brand-primary";
  const secondaryStyle = "bg-dark-accent text-text-light hover:bg-opacity-80 focus:ring-dark-accent";
  
  const disabledStyle = "opacity-50 cursor-not-allowed";

  const currentStyle = variant === 'primary' ? primaryStyle : secondaryStyle;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${currentStyle} ${disabled ? disabledStyle : ''} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
