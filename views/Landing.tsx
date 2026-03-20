import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Calendar, CheckCircle2, Clock3, Cpu, Flame, LayoutDashboard, Shield, Sparkles, Swords, Zap } from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { GameMode, ScheduledBattle } from '../types';

interface LandingProps {
  setMode: (mode: GameMode) => void;
  onScheduleBattle?: (battle: ScheduledBattle) => void;
}

interface ScheduleFormState {
  date: string;
  time: string;
  opponent: string;
}

const defaultScheduleForm = (): ScheduleFormState => ({
  date: '',
  time: '',
  opponent: 'Open Challenge',
});

export const Landing: React.FC<LandingProps> = ({ setMode, onScheduleBattle }) => {
  const [terminalText, setTerminalText] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleFormState>(defaultScheduleForm);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const terminalLines = useMemo(
    () =>
      [
        '> Booting SyntaxArena control surface',
        '> Syncing battle queues, docs, and visualization tools',
        '> Ready for practice, ranked matches, and assessments',
      ].join('\n'),
    [],
  );

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      setTerminalText(terminalLines.slice(0, index));
      index += 3;

      if (index > terminalLines.length) {
        window.clearInterval(timer);
      }
    }, 20);

    return () => window.clearInterval(timer);
  }, [terminalLines]);

  const handleScheduleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onScheduleBattle?.({
      id: Date.now().toString(),
      date: scheduleData.date,
      time: scheduleData.time,
      opponent: scheduleData.opponent.trim() || 'Open Challenge',
    });

    setScheduleSuccess(true);
    window.setTimeout(() => {
      setScheduleSuccess(false);
      setShowScheduleModal(false);
      setScheduleData(defaultScheduleForm());
    }, 1400);
  };

  const actionCards = [
    {
      icon: Swords,
      title: 'Start Battle',
      description: 'Launch into a real-time coding duel with a tighter, cleaner battle shell.',
      accent: 'from-rose-500 to-orange-400',
      onClick: () => setMode(GameMode.BATTLE),
    },
    {
      icon: Shield,
      title: 'Run Assessment',
      description: 'Use the proctored environment for invigilated interview or test-style sessions.',
      accent: 'from-sky-500 to-cyan-400',
      onClick: () => setMode(GameMode.ASSESSMENT),
    },
    {
      icon: Zap,
      title: 'Open Visualizer',
      description: 'Inspect execution flow, generate explanations, and save notes into the docs workspace.',
      accent: 'from-emerald-400 to-teal-300',
      onClick: () => setMode(GameMode.VISUALIZER),
    },
    {
      icon: Calendar,
      title: 'Schedule Match',
      description: 'Queue a practice challenge or a review session and keep it pinned on the dashboard.',
      accent: 'from-violet-400 to-fuchsia-400',
      onClick: () => setShowScheduleModal(true),
    },
  ];

  const metrics = [
    { label: 'Battle modes', value: '4' },
    { label: 'Learning tools', value: '6+' },
    { label: 'Saved sessions', value: 'Local' },
    { label: 'UI baseline', value: 'Clean' },
  ];

  return (
    <div className="h-full w-full overflow-y-auto px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-24">
        <section className="grid gap-6 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
          <div>
            <BrandMark />
            <div className="mt-8 inline-flex rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-300">
              Cleaner production shell
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Train backend instincts in one focused workspace.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Practice, compete, visualize program flow, write docs, and keep a persistent task loop without jumping across disconnected screens.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setMode(GameMode.DASHBOARD)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              >
                Open Dashboard
                <LayoutDashboard size={16} />
              </button>
              <button
                onClick={() => setMode(GameMode.PRACTICE)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                Practice Now
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">System status</p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 font-mono text-sm text-slate-300">
              <pre className="min-h-[130px] whitespace-pre-wrap">{terminalText}</pre>
              <div className="mt-3 flex items-center gap-2 text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                <span className="text-xs uppercase tracking-[0.25em]">Ready</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-2xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {actionCards.map(({ icon: Icon, title, description, accent, onClick }) => (
            <button
              key={title}
              onClick={onClick}
              className="group rounded-[28px] border border-white/10 bg-slate-950/70 p-5 text-left shadow-xl transition hover:-translate-y-1 hover:border-white/20 hover:bg-slate-950"
            >
              <div className={`inline-flex rounded-2xl bg-gradient-to-r ${accent} p-3 text-slate-950`}>
                <Icon size={20} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
            </button>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Why this version is better</p>
            <div className="mt-6 space-y-5">
              {[
                { icon: Flame, title: 'Sharper navigation', text: 'The shell now emphasizes the core destinations instead of forcing every view into the same visual weight.' },
                { icon: Cpu, title: 'Faster startup path', text: 'Modules load lazily so the initial screen is lighter and better aligned with production builds.' },
                { icon: Sparkles, title: 'Cleaner visual language', text: 'The updated palette removes the noisy glow-heavy treatment and keeps emphasis where it matters.' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Suggested flow</p>
            <div className="mt-6 space-y-4">
              {[
                'Start from the dashboard to review tasks, stats, and scheduled battles.',
                'Use practice mode for quick iterations before opening a ranked battle or assessment.',
                'Save visualizer output into documentation when you want a reusable study note.',
              ].map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-semibold text-emerald-300">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-slate-950 p-6 shadow-2xl">
            {!scheduleSuccess ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/12 text-violet-300">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Schedule a battle</h2>
                    <p className="text-sm text-slate-400">Store it on the dashboard so the next session has context.</p>
                  </div>
                </div>

                <form onSubmit={handleScheduleSubmit} className="mt-6 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Opponent</span>
                    <input
                      type="text"
                      value={scheduleData.opponent}
                      onChange={(event) => setScheduleData((current) => ({ ...current, opponent: event.target.value }))}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/40"
                      placeholder="Open Challenge"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Date</span>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <Calendar size={16} className="text-slate-500" />
                        <input
                          type="date"
                          required
                          value={scheduleData.date}
                          onChange={(event) => setScheduleData((current) => ({ ...current, date: event.target.value }))}
                          className="w-full bg-transparent text-sm text-white outline-none"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Time</span>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <Clock3 size={16} className="text-slate-500" />
                        <input
                          type="time"
                          required
                          value={scheduleData.time}
                          onChange={(event) => setScheduleData((current) => ({ ...current, time: event.target.value }))}
                          className="w-full bg-transparent text-sm text-white outline-none"
                        />
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowScheduleModal(false);
                        setScheduleData(defaultScheduleForm());
                      }}
                      className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06]"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-400 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110">
                      Save schedule
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-8 text-center">
                <CheckCircle2 size={54} className="mx-auto text-emerald-300" />
                <h3 className="mt-4 text-2xl font-semibold text-white">Battle scheduled</h3>
                <p className="mt-2 text-sm text-slate-400">The session has been pinned to your dashboard.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
