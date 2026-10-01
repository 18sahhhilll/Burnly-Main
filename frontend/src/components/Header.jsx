import React from 'react';
import { Flame, Layers, BarChart2, User, LogOut, Plus, Trash2, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVenture } from '../context/VentureContext';

export const Header = ({
  scenarios = [],
  activeScenarioId,
  onSelectScenario,
  onOpenCreateModal,
  onOpenDeleteModal,
  onOpenAuth,
}) => {
  const { user, logout } = useAuth();
  const { ventures, activeVentureId, setActiveVentureId } = useVenture();
  const currentScenario = scenarios.find((s) => (s.id || s._id) === activeScenarioId);

  return (
    <header className="bg-[#151D2A] border-b border-[#222E42] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-900/30">
              <Flame className="w-5 h-5 text-white fill-white/20" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">Burnly</span>
              <span className="text-[10px] uppercase font-mono text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/40 ml-2">
                Platform
              </span>
            </div>
          </div>
        </div>

        {/* Selectors & User Auth */}
        <div className="flex items-center gap-3">
          {/* Active Venture Selector */}
          <div className="flex items-center gap-1.5 bg-[#1A2436] px-2.5 py-1 rounded-lg border border-[#222E42]">
            <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <select
              value={activeVentureId || ''}
              onChange={(e) => setActiveVentureId(e.target.value)}
              className="bg-transparent text-xs text-white rounded font-medium focus:outline-none max-w-[120px] sm:max-w-[160px] truncate"
            >
              {ventures.map((v) => (
                <option key={v._id || v.id} value={v._id || v.id} className="bg-[#151D2A] text-white">
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Active Scenario Selector dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={activeScenarioId || ''}
              onChange={(e) => onSelectScenario(e.target.value)}
              className="bg-[#1A2436] border border-[#222E42] text-xs text-white rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-blue-500 max-w-[120px] sm:max-w-[160px] truncate"
            >
              {scenarios.map((s) => (
                <option key={s.id || s._id} value={s.id || s._id} className="bg-[#151D2A] text-white">
                  {s.title}
                </option>
              ))}
            </select>

            <button
              onClick={onOpenCreateModal}
              title="Create New Scenario"
              className="p-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-800/60 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium px-2.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New</span>
            </button>

            <button
              onClick={() => currentScenario && onOpenDeleteModal(currentScenario)}
              title="Delete Active Scenario"
              className="p-1.5 bg-[#1A2436] hover:bg-red-950/50 text-gray-400 hover:text-red-400 border border-[#222E42] hover:border-red-900/60 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Auth state */}
          {user ? (
            <div className="flex items-center gap-2 border-l border-[#222E42] pl-3 ml-1">
              <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800 text-blue-300 flex items-center justify-center font-bold uppercase text-xs">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
              </div>
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to permanently delete your account, venture profile, scenarios, and stored intelligence reports? This action cannot be undone.')) {
                    try {
                      const { deleteAccount } = useAuth();
                      if (deleteAccount) await deleteAccount();
                    } catch (err) {
                      alert(err.message || 'Failed to delete account');
                    }
                  }
                }}
                title="Delete Account and Data"
                className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/30 transition-colors cursor-pointer text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={logout}
                title="Logout"
                className="text-gray-400 hover:text-gray-200 p-1.5 rounded-lg hover:bg-[#1A2436] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              Sign In / Save
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
