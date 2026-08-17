import React, { useState } from 'react';
import {
  ShieldCheck,
  Fingerprint,
  Lock,
  Smartphone,
  Laptop,
  Tablet,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useBanking } from '../../store/BankingContext';
import { triggerHaptic } from '../../hooks/useHaptic';

export const SecurityCenter: React.FC = () => {
  const { devices, removeSecurityDevice, showToast } = useBanking();
  const [biometricsActive, setBiometricsActive] = useState(true);
  const [deviceToRemove, setDeviceToRemove] = useState<string | null>(null);

  const handleToggleBiometrics = () => {
    triggerHaptic('light');
    const next = !biometricsActive;
    setBiometricsActive(next);
    showToast(
      next ? 'Biometric authentication enabled' : 'Biometrics disabled',
      'info'
    );
  };

  const handleConfirmRemoveDevice = () => {
    if (deviceToRemove) {
      triggerHaptic('medium');
      removeSecurityDevice(deviceToRemove);
      setDeviceToRemove(null);
    }
  };

  const getDeviceIcon = (type: 'phone' | 'laptop' | 'tablet') => {
    switch (type) {
      case 'laptop':
        return Laptop;
      case 'tablet':
        return Tablet;
      case 'phone':
      default:
        return Smartphone;
    }
  };

  return (
    <div className="space-y-3 select-none">
      {/* Security Status Hero Card */}
      <div className="bg-[#141618] rounded-3xl p-5 border border-white/10 relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#1D2024] border border-white/10 flex items-center justify-center text-white/90">
            <ShieldCheck size={22} strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                Security Shield
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-medium">
                Active
              </span>
            </div>
            <p className="text-xs text-[#7E848D] mt-0.5">
              Zero unauthorized activities detected.
            </p>
          </div>
        </div>
      </div>

      {/* Biometrics & Authentication */}
      <div className="bg-[#141618] rounded-3xl p-5 border border-white/10 space-y-3">
        <h4 className="text-[10px] font-medium uppercase tracking-wider text-[#7E848D]">
          Authentication & Access
        </h4>

        {/* Biometrics Toggle */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#1D2024] flex items-center justify-center text-white/80">
              <Fingerprint size={16} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-medium text-white">
                Biometrics / Passkeys
              </p>
              <p className="text-[10px] text-[#7E848D]">
                Require authentication for transfers & details
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleBiometrics}
            className={`w-10 h-5 rounded-full transition-colors relative p-0.5 outline-none ${
              biometricsActive ? 'bg-white' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full transition-transform ${
                biometricsActive ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white/60'
              }`}
            />
          </button>
        </div>

        {/* Passcode Setting */}
        <div
          onClick={() => {
            triggerHaptic('light');
            showToast('Passcode verified', 'info');
          }}
          className="flex items-center justify-between py-1 cursor-pointer hover:bg-white/5 rounded-xl p-1 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#1D2024] flex items-center justify-center text-white/80">
              <Lock size={16} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-medium text-white">
                App Passcode
              </p>
              <p className="text-[10px] text-[#7E848D]">
                Emergency fallback code
              </p>
            </div>
          </div>
          <span className="text-xs text-white font-medium hover:underline">Change</span>
        </div>
      </div>

      {/* Trusted Devices Management */}
      <div className="bg-[#141618] rounded-3xl p-5 border border-white/10 space-y-3">
        <h4 className="text-[10px] font-medium uppercase tracking-wider text-[#7E848D]">
          Active Trusted Sessions
        </h4>

        <div className="space-y-2">
          {devices.map((device) => {
            const Icon = getDeviceIcon(device.type);
            return (
              <div
                key={device.id}
                className="p-3 rounded-2xl bg-[#1D2024] flex items-center justify-between border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#141618] flex items-center justify-center text-white/80">
                    <Icon size={15} strokeWidth={1.75} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-white">
                        {device.name}
                      </p>
                      {device.isCurrent && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-white font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#7E848D]">
                      {device.location} • {device.lastActive}
                    </p>
                  </div>
                </div>

                {!device.isCurrent && (
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      setDeviceToRemove(device.id);
                    }}
                    className="p-1.5 rounded-lg text-[#7E848D] hover:text-white transition-colors"
                    title="Revoke session"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Remove Device Modal */}
      {deviceToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-xs bg-[#141618] rounded-3xl p-5 border border-white/10 text-center">
            <AlertTriangle size={24} className="text-white mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-white mb-1">Revoke Session?</h4>
            <p className="text-xs text-[#7E848D] mb-4">
              This device will be immediately logged out.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDeviceToRemove(null)}
                className="py-2 text-xs rounded-xl bg-[#1D2024] text-white font-medium hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemoveDevice}
                className="py-2 text-xs rounded-xl bg-white text-black font-semibold hover:bg-neutral-200"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
