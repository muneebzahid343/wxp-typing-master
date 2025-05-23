
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 text-center">
      <h1 className="text-5xl font-orbitron font-bold">
        <span className="text-brand-primary">WXP</span>
        <span className="text-text-light"> Typing Master</span>
      </h1>
      <p className="text-text-dim mt-2 text-lg">Test and Improve Your Typing Speed</p>
    </header>
  );
};
