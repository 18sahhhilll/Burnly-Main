import React from 'react';
import {
  Building2,
  BarChart3,
  TrendingUp,
  Globe,
  Users2,
  MapPin,
  Presentation,
  ShieldAlert,
  Layers,
  Lock,
} from 'lucide-react';

export const ModuleNav = ({ activeTab, setActiveTab, onComingSoonNotice }) => {
  const navItems = [
    // 1. Profile
    { id: 'profile', label: 'Profile', category: 'profile', icon: Building2, comingSoon: false },

    // 2. Numbers (Deterministic Core)
    { id: 'simulator', label: 'Simulator', category: 'numbers', icon: BarChart3, comingSoon: false },
    { id: 'projections', label: 'Projections', category: 'numbers', icon: TrendingUp, comingSoon: false },
    { id: 'comparison', label: 'Compare', category: 'numbers', icon: Layers, comingSoon: false },

    // 3. Intelligence (Generative - Phase 3)
    { id: 'market', label: 'Market', category: 'intelligence', icon: Globe, comingSoon: false },
    { id: 'competitors', label: 'Competitors', category: 'intelligence', icon: Users2, comingSoon: false },
    { id: 'roadmap', label: 'Roadmap', category: 'intelligence', icon: MapPin, comingSoon: false },
    { id: 'pitch', label: 'Pitch Outline', category: 'intelligence', icon: Presentation, comingSoon: false },
    { id: 'risk', label: 'Risk Intelligence', category: 'intelligence', icon: ShieldAlert, comingSoon: false },
  ];

  const handleTabClick = (item) => {
    if (item.comingSoon) {
      if (onComingSoonNotice) {
        onComingSoonNotice(item.label);
      }
      return;
    }
    setActiveTab(item.id);
  };

  return (
    <div className="bg-[#151D2A] border-b border-[#222E42] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto py-2 scrollbar-none gap-2">
        {/* Navigation Grouping */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Profile Section */}
          <div className="flex items-center gap-1 border-r border-[#222E42] pr-2 mr-1">
            {navItems
              .filter((i) => i.category === 'profile')
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A2436]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                );
              })}
          </div>

          {/* Numbers Section */}
          <div className="flex items-center gap-1 border-r border-[#222E42] pr-2 mr-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 mr-1 hidden lg:inline">
              Numbers:
            </span>
            {navItems
              .filter((i) => i.category === 'numbers')
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A2436]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                    {item.label}
                  </button>
                );
              })}
          </div>

          {/* Intelligence Section */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 mr-1 hidden lg:inline">
              Intelligence:
            </span>
            {navItems
              .filter((i) => i.category === 'intelligence')
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap relative group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A2436]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-indigo-400" />
                    {item.label}
                    {item.comingSoon && (
                      <span className="ml-1 text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> Soon
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
