import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useVenture } from '../context/VentureContext.jsx';
import { User, Mail, Building2, Calendar, Shield, Trash2, AlertCircle } from 'lucide-react';

export const ProfilePage = () => {
  const { user, deleteAccount, logout } = useAuth();
  const { activeVenture } = useVenture();

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'Are you sure you want to permanently delete your account, ventures, scenarios, and all stored reports? This cannot be undone.'
      )
    ) {
      try {
        await deleteAccount();
      } catch (err) {
        alert(err.message || 'Failed to delete account. Please try again.');
      }
    }
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 py-3 border-b border-[#222E42]/60 last:border-b-0">
      <Icon className="w-4 h-4 text-gray-500 shrink-0" />
      <span className="text-xs text-gray-500 w-24 shrink-0">{label}</span>
      <span className="text-sm text-gray-200 font-medium">{value || '—'}</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-sm text-gray-400 mt-1">Your account details and active venture information.</p>
      </div>

      {/* Account Info */}
      <div className="bg-[#151D2A] border border-[#222E42] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#222E42] flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-950 border border-blue-800 text-blue-300 flex items-center justify-center font-bold text-lg uppercase">
            {user?.name ? user.name[0] : 'U'}
          </div>
          <div>
            <p className="font-semibold text-white">{user?.name || 'Unknown'}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <div className="px-6 py-2">
          <InfoRow icon={User} label="Full Name" value={user?.name} />
          <InfoRow icon={Mail} label="Email" value={user?.email} />
        </div>
      </div>

      {/* Active Venture */}
      {activeVenture && (
        <div className="bg-[#151D2A] border border-[#222E42] rounded-xl overflow-hidden">
          <div className="px-6 py-3.5 border-b border-[#222E42]">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              Active Venture
              {activeVenture.isSample && (
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-950/60 border border-amber-800/60 rounded text-amber-400">
                  Sample
                </span>
              )}
            </h3>
          </div>
          <div className="px-6 py-2">
            <InfoRow icon={Building2} label="Name" value={activeVenture.name} />
            <InfoRow icon={Shield} label="Industry" value={activeVenture.industry} />
            <InfoRow icon={Calendar} label="Stage" value={activeVenture.stage} />
            <InfoRow icon={User} label="Business Model" value={activeVenture.businessModel} />
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-[#151D2A] border border-red-900/40 rounded-xl overflow-hidden">
        <div className="px-6 py-3.5 border-b border-red-900/40">
          <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Danger Zone
          </h3>
        </div>
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-200">Delete Account</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Permanently delete your account and all associated data.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-950/60 hover:bg-red-900/60 border border-red-900/60 text-red-400 text-xs font-semibold rounded-lg transition-colors shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
