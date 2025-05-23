
import React from 'react';
import { FaClock, FaKeyboard, FaBullseye, FaExclamationTriangle, FaTachometerAlt } from 'react-icons/fa';

interface StatsDisplayProps {
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  time: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass }) => (
  <div className={`bg-dark-card p-4 rounded-lg shadow-lg flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-200`}>
    <div className={`text-3xl mb-2 ${colorClass}`}>{icon}</div>
    <div className="text-3xl font-orbitron font-bold text-text-light">{value}</div>
    <div className="text-sm text-text-dim">{label}</div>
  </div>
);

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ wpm, cpm, accuracy, errors, time }) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard label="WPM" value={wpm} icon={<FaTachometerAlt />} colorClass="text-brand-primary" />
      <StatCard label="CPM" value={cpm} icon={<FaKeyboard />} colorClass="text-green-400" />
      <StatCard label="Accuracy" value={`${accuracy}%`} icon={<FaBullseye />} colorClass="text-blue-400" />
      <StatCard label="Errors" value={errors} icon={<FaExclamationTriangle />} colorClass="text-red-500" />
      <StatCard label="Time" value={formatTime(time)} icon={<FaClock />} colorClass="text-yellow-400" />
    </div>
  );
};
