import React from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

export const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0E1420] text-[#E8EAF0] flex flex-col">
      {children}
    </div>
  );
};
