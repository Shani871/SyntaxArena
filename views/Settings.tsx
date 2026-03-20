import React, { useMemo, useState } from 'react';
import { Bell, CheckCircle2, Globe, Lock, LogOut, Monitor, Moon, Shield, Smartphone, User, Volume2 } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { readStorage, storageKeys, writeStorage } from '../utils/storage';

type SettingsTab = 'GENERAL' | 'NOTIFICATIONS' | 'PRIVACY';

interface SettingsState {
  theme: 'dark' | 'light';
  sound: boolean;
  animations: boolean;
  emailNotifs: boolean;
  pushNotifs: boolean;
  publicProfile: boolean;
  showActivity: boolean;
}

const defaultSettings: SettingsState = {
  theme: 'dark',
  sound: true,
  animations: true,
  emailNotifs: true,
  pushNotifs: false,
  publicProfile: true,
  showActivity: true,
};

export const Settings: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('GENERAL');
  const [settings, setSettings] = useState<SettingsState>(() => readStorage(storageKeys.settings, defaultSettings));
  const [saveState, setSaveState] = useState<'idle' | 'saved'>('idle');

  const sections = useMemo(
    () => [
      { id: 'GENERAL' as const, label: 'General', icon: Monitor },
      { id: 'NOTIFICATIONS' as const, label: 'Notifications', icon: Bell },
      { id: 'PRIVACY' as const, label: 'Privacy', icon: Lock },
    ],
    [],
  );

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaveState('idle');
  };

  const handleSave = () => {
    writeStorage(storageKeys.settings, settings);
    setSaveState('saved');
    window.setTimeout(() => setSaveState('idle'), 1800);
  };

  const toggle = (key: keyof SettingsState) => {
    updateSetting(key, !settings[key] as SettingsState[typeof key]);
  };

  const SettingRow = ({
    icon: Icon,
    title,
    description,
    control,
  }: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    title: string;
    description: string;
    control: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-950/65 p-4">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
      </div>
      {control}
    </div>
  );

  const Toggle = ({ value, onClick }: { value: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-7 w-12 rounded-full transition ${value ? 'bg-emerald-400' : 'bg-slate-700'}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${value ? 'left-6' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="h-full w-full overflow-y-auto px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-24">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Settings</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">System configuration</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                This screen now saves locally without blocking alerts and keeps the controls grouped into cleaner, more readable sections.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              {saveState === 'saved' && (
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-200">
                  <CheckCircle2 size={16} />
                  Settings saved
                </div>
              )}
              <button
                onClick={handleSave}
                className="rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              >
                Save changes
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4">
            <div className="space-y-2">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeTab === id ? 'bg-sky-500/14 text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <button
                onClick={() => logout()}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            {activeTab === 'GENERAL' && (
              <div className="space-y-4">
                <SettingRow
                  icon={Moon}
                  title="Theme mode"
                  description="The current production shell is optimized for dark mode, but the preference is still stored for future theming."
                  control={
                    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
                      <button
                        onClick={() => updateSetting('theme', 'dark')}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${settings.theme === 'dark' ? 'bg-sky-500 text-slate-950' : 'text-slate-500'}`}
                      >
                        Dark
                      </button>
                      <button
                        onClick={() => updateSetting('theme', 'light')}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${settings.theme === 'light' ? 'bg-sky-500 text-slate-950' : 'text-slate-500'}`}
                      >
                        Light
                      </button>
                    </div>
                  }
                />
                <SettingRow
                  icon={Monitor}
                  title="Reduce motion"
                  description="Cuts back on decorative transitions for a calmer interface."
                  control={<Toggle value={settings.animations} onClick={() => toggle('animations')} />}
                />
                <SettingRow
                  icon={Volume2}
                  title="Interface sounds"
                  description="Enable or mute local UI sound cues."
                  control={<Toggle value={settings.sound} onClick={() => toggle('sound')} />}
                />
              </div>
            )}

            {activeTab === 'NOTIFICATIONS' && (
              <div className="space-y-4">
                <SettingRow
                  icon={Globe}
                  title="Email updates"
                  description="Receive weekly summaries and challenge suggestions."
                  control={<Toggle value={settings.emailNotifs} onClick={() => toggle('emailNotifs')} />}
                />
                <SettingRow
                  icon={Smartphone}
                  title="Push notifications"
                  description="Get notified for battle invitations and session reminders."
                  control={<Toggle value={settings.pushNotifs} onClick={() => toggle('pushNotifs')} />}
                />
              </div>
            )}

            {activeTab === 'PRIVACY' && (
              <div className="space-y-4">
                <SettingRow
                  icon={User}
                  title="Public profile"
                  description="Expose your public stats and leaderboard presence to other users."
                  control={<Toggle value={settings.publicProfile} onClick={() => toggle('publicProfile')} />}
                />
                <SettingRow
                  icon={Shield}
                  title="Activity visibility"
                  description="Show when you are active inside the product."
                  control={<Toggle value={settings.showActivity} onClick={() => toggle('showActivity')} />}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
