import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Flame,
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Layers,
  Globe,
  Users2,
  MapPin,
  Presentation,
  ShieldAlert,
  Building2,
  User,
  LogOut,
  Plus,
  Trash2,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useVenture } from '../context/VentureContext.jsx';
import { useScenario } from '../context/ScenarioContext.jsx';
import { Toast } from '../components/Toast.jsx';
import { CreateScenarioModal } from '../components/CreateScenarioModal.jsx';
import { DeleteScenarioModal } from '../components/DeleteScenarioModal.jsx';

const NAV_GROUPS = [
  {
    label: 'Workspace',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/simulator', label: 'Simulator', icon: BarChart3 },
      { to: '/projections', label: 'Projections', icon: TrendingUp },
      { to: '/compare', label: 'Compare', icon: Layers },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/market', label: 'Market', icon: Globe },
      { to: '/competitors', label: 'Competitors', icon: Users2 },
      { to: '/roadmap', label: 'Roadmap', icon: MapPin },
      { to: '/pitch-outline', label: 'Pitch Outline', icon: Presentation },
      { to: '/risk-intelligence', label: 'Risk Intelligence', icon: ShieldAlert },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/profile', label: 'Profile', icon: User },
    ],
  },
];

const NavItem = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
          : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A2436]'
      }`
    }
  >
    <Icon className="w-4 h-4 shrink-0" />
    <span>{label}</span>
  </NavLink>
);

const Sidebar = ({ onClose }) => (
  <aside className="flex flex-col h-full bg-[#0B1220] border-r border-[#222E42] w-60">
    {/* Brand */}
    <div className="flex items-center justify-between px-4 h-16 border-b border-[#222E42] shrink-0">
      <Link to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-900/30">
          <Flame className="w-4 h-4 text-white" />
        </div>
        <span className="text-base font-bold text-white tracking-tight">Burnly</span>
      </Link>
      {onClose && (
        <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>

    {/* Nav Groups */}
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 px-3 mb-2">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        </div>
      ))}
    </nav>

    {/* Footer */}
    <div className="px-4 py-3 border-t border-[#222E42] text-[10px] text-gray-600">
      © 2025 Burnly · Financial Simulator
    </div>
  </aside>
);

export const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { ventures, activeVentureId, setActiveVentureId } = useVenture();
  const {
    scenarios,
    activeScenarioId,
    setActiveScenarioId,
    handleCreateScenario,
    handleDeleteScenario,
    activeScenario,
  } = useScenario();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingScenario, setDeletingScenario] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const onCreateScenario = async (payload) => {
    const created = await handleCreateScenario(payload);
    if (created) showToast(`Created scenario "${payload.title}"`);
    setIsCreateModalOpen(false);
  };

  const onDeleteScenario = async (targetId) => {
    const ok = await handleDeleteScenario(targetId);
    if (ok) showToast('Scenario deleted successfully');
    else showToast('At least one scenario must remain active', 'error');
    setDeletingScenario(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0E1420] text-[#E8EAF0] flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-60 z-20">
        <Sidebar />
      </div>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-60 z-50">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 lg:ml-60 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#0B1220]/95 backdrop-blur-sm border-b border-[#222E42] h-14 flex items-center px-4 gap-4">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-gray-400 hover:text-white p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Venture Selector */}
          <div className="flex items-center gap-1.5 bg-[#1A2436] px-2.5 py-1.5 rounded-lg border border-[#222E42] min-w-0">
            <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <select
              value={activeVentureId || ''}
              onChange={(e) => setActiveVentureId(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none max-w-[140px] truncate"
            >
              {ventures.map((v) => (
                <option key={v._id || v.id} value={v._id || v.id} className="bg-[#151D2A]">
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Scenario Selector */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <select
              value={activeScenarioId || ''}
              onChange={(e) => setActiveScenarioId(e.target.value)}
              className="bg-[#1A2436] border border-[#222E42] text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 max-w-[160px] truncate"
            >
              {scenarios.map((s) => (
                <option key={s.id || s._id} value={s.id || s._id} className="bg-[#151D2A]">
                  {s.title}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              title="Create New Scenario"
              className="p-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-800/60 rounded-lg transition-colors flex items-center gap-1 text-xs px-2.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New</span>
            </button>
            <button
              onClick={() => activeScenario && setDeletingScenario(activeScenario)}
              title="Delete Active Scenario"
              className="p-1.5 bg-[#1A2436] hover:bg-red-950/50 text-gray-400 hover:text-red-400 border border-[#222E42] hover:border-red-900/60 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User menu */}
          {user && (
            <div className="flex items-center gap-2 border-l border-[#222E42] pl-3 ml-auto shrink-0">
              <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800 text-blue-300 flex items-center justify-center font-bold text-xs uppercase">
                {user.name ? user.name[0] : 'U'}
              </div>
              <span className="text-xs text-gray-300 hidden sm:block">{user.name}</span>
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-gray-400 hover:text-gray-200 p-1.5 rounded-lg hover:bg-[#1A2436] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>

      {/* Modals */}
      <CreateScenarioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={onCreateScenario}
      />
      <DeleteScenarioModal
        isOpen={!!deletingScenario}
        scenario={deletingScenario}
        isLastScenario={scenarios.length <= 1}
        onClose={() => setDeletingScenario(null)}
        onConfirmDelete={onDeleteScenario}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
