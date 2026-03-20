import React, { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, Calendar, CheckSquare, Flame, Plus, Rocket, Target, Trash2, Trophy, Zap } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { MOCK_USER } from '../constants';
import { GameMode, ScheduledBattle, TodoItem } from '../types';

interface DashboardProps {
  setMode?: (mode: GameMode) => void;
  scheduledBattles?: ScheduledBattle[];
  onRemoveBattle?: (id: string) => void;
}

const activityData = [
  { day: 'Mon', score: 14, focus: 9 },
  { day: 'Tue', score: 18, focus: 11 },
  { day: 'Wed', score: 16, focus: 13 },
  { day: 'Thu', score: 22, focus: 14 },
  { day: 'Fri', score: 24, focus: 17 },
  { day: 'Sat', score: 28, focus: 19 },
  { day: 'Sun', score: 26, focus: 16 },
];

export const Dashboard: React.FC<DashboardProps> = ({ setMode, scheduledBattles = [], onRemoveBattle }) => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: 'Review the visualizer notes for recursion tracing', completed: true },
    { id: '2', text: 'Finish one medium practice problem', completed: false },
    { id: '3', text: 'Schedule a mock interview battle', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const displayName = useMemo(
    () => user?.displayName || user?.email?.split('@')[0] || MOCK_USER.username,
    [user],
  );

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const completionRate = Math.round((completedTodos / Math.max(todos.length, 1)) * 100);

  const addTodo = () => {
    if (!newTodo.trim()) {
      return;
    }

    setTodos((current) => [...current, { id: Date.now().toString(), text: newTodo.trim(), completed: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  const stats = [
    {
      label: 'Current rank',
      value: `#${42}`,
      helper: 'Up 3 positions this week',
      icon: Trophy,
      accent: 'text-amber-300',
    },
    {
      label: 'Current streak',
      value: `${MOCK_USER.streak} days`,
      helper: 'Stay active to preserve your streak',
      icon: Flame,
      accent: 'text-rose-300',
    },
    {
      label: 'XP collected',
      value: MOCK_USER.xp.toLocaleString(),
      helper: 'Level 12 architect track',
      icon: Zap,
      accent: 'text-sky-300',
    },
    {
      label: 'Focus score',
      value: `${completionRate}%`,
      helper: `${completedTodos}/${todos.length} checklist items complete`,
      icon: Target,
      accent: 'text-emerald-300',
    },
  ];

  return (
    <div className="h-full w-full overflow-y-auto px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-24">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-400 text-xl font-semibold text-slate-950">
                {(displayName || 'SA').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Control center</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">{displayName}, welcome back.</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Your production cleanup pass tightened the shell, reduced the startup bundle, and made the dashboard a more usable operational view.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setMode?.(GameMode.PRACTICE)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                Practice mode
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setMode?.(GameMode.RESUME_BUILDER)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              >
                Resume builder
                <Rocket size={16} />
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, helper, icon: Icon, accent }) => (
            <div key={label} className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-xl">
              <div className={`inline-flex rounded-2xl bg-white/[0.04] p-3 ${accent}`}>
                <Icon size={20} />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{helper}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Performance trend</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Weekly momentum</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                7 day window
              </div>
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#020617',
                      border: '1px solid rgba(148, 163, 184, 0.16)',
                      borderRadius: '16px',
                      color: '#fff',
                    }}
                  />
                  <Area type="monotone" dataKey="focus" stroke="#34d399" fill="url(#focusGradient)" strokeWidth={2} />
                  <Area type="monotone" dataKey="score" stroke="#38bdf8" fill="url(#scoreGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Focus queue</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Today&apos;s checklist</h2>
            </div>

            <div className="space-y-3">
              {todos.map((todo) => (
                <div key={todo.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                      todo.completed ? 'border-emerald-300 bg-emerald-300 text-slate-950' : 'border-white/15 text-slate-500'
                    }`}
                  >
                    <CheckSquare size={14} />
                  </button>
                  <span className={`flex-1 text-sm ${todo.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{todo.text}</span>
                  <button onClick={() => deleteTodo(todo.id)} className="text-slate-500 transition hover:text-rose-300">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(event) => setNewTodo(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    addTodo();
                  }
                }}
                placeholder="Add a new goal"
                className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/40"
              />
              <button onClick={addTodo} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-slate-950 transition hover:bg-sky-400">
                <Plus size={18} />
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Upcoming battles</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Scheduled sessions</h2>
            </div>
            <button
              onClick={() => setMode?.(GameMode.HOME)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              Schedule new
            </button>
          </div>

          {scheduledBattles.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {scheduledBattles.map((battle) => (
                <div key={battle.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">Upcoming match</p>
                      <h3 className="mt-2 text-xl font-semibold text-white">{battle.opponent}</h3>
                    </div>
                    <button onClick={() => onRemoveBattle?.(battle.id)} className="text-slate-500 transition hover:text-rose-300">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-5 space-y-3 text-sm text-slate-300">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <Calendar size={16} className="text-violet-300" />
                      <span>{battle.date}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <Zap size={16} className="text-sky-300" />
                      <span>{battle.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-8 text-center">
              <Calendar size={26} className="mx-auto text-slate-500" />
              <p className="mt-4 text-lg font-semibold text-white">No battles scheduled yet</p>
              <p className="mt-2 text-sm text-slate-400">Use the landing page to create the next practice or challenge session.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
