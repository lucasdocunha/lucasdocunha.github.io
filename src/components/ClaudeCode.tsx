import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Zap, Workflow, Wrench, FlaskConical, type LucideIcon } from 'lucide-react';
import { Reveal, spotlightMove } from '@/lib/motion';
import { useLang } from '@/lib/lang';
import type { TermLine } from '@/content';

const SPIN = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const POINT_ICONS: LucideIcon[] = [Zap, Workflow, Wrench, FlaskConical];

type AgentState = 'idle' | 'running' | 'done';

function useSession(script: TermLine[], active: boolean, reduced: boolean) {
  const [shown, setShown] = useState(reduced ? script.length : 0);
  const [typed, setTyped] = useState(0);
  const [tick, setTick] = useState(0);

  // reinicia ao trocar idioma
  useEffect(() => { setShown(reduced ? script.length : 0); setTyped(0); }, [script, reduced]);

  useEffect(() => {
    if (!active || reduced) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 80);
    return () => window.clearInterval(id);
  }, [active, reduced]);

  useEffect(() => {
    if (!active || reduced) return;
    let t: number;
    if (shown >= script.length) {
      t = window.setTimeout(() => { setShown(0); setTyped(0); }, 5000);
      return () => window.clearTimeout(t);
    }
    const line = script[shown];
    if (line.kind === 'user' && typed < line.text.length) {
      t = window.setTimeout(() => setTyped((n) => n + 1), 16 + Math.random() * 22);
      return () => window.clearTimeout(t);
    }
    const prev = script[shown - 1];
    const wait =
      shown === 0 ? 700 :
      prev?.kind === 'user' ? 500 :
      line.kind === 'plan' ? 500 :
      line.kind === 'agent' ? (prev?.kind === 'plan' ? 900 : 260) :
      line.kind === 'blank' ? 600 :
      line.kind === 'done' ? 700 + Math.random() * 700 :
      line.kind === 'final' ? 700 : 400;
    t = window.setTimeout(() => { setShown((n) => n + 1); setTyped(0); }, line.kind === 'user' ? 350 : wait);
    return () => window.clearTimeout(t);
  }, [active, reduced, shown, typed, script]);

  const agents = useMemo<AgentState[]>(() => {
    const st: AgentState[] = ['idle', 'idle', 'idle', 'idle'];
    script.slice(0, shown).forEach((l) => {
      if (l.agent === undefined) return;
      st[l.agent] = l.kind === 'done' ? 'done' : 'running';
    });
    return st;
  }, [script, shown]);

  const phase: 'idle' | 'planning' | 'working' | 'done' =
    shown >= script.length ? 'done' :
    agents.some((a) => a !== 'idle') ? 'working' :
    script.slice(0, shown).some((l) => l.kind === 'plan') ? 'planning' : 'idle';

  // linha atualmente sendo digitada (prompt do usuário)
  const typing = shown < script.length && script[shown].kind === 'user' ? typed : -1;

  return { shown, typing, tick, agents, phase };
}

function Line({ line, agentState, spin, typingChars }: { line: TermLine; agentState?: AgentState; spin: string; typingChars?: number }) {
  switch (line.kind) {
    case 'prompt':
      return <div><span className="text-ember-400">~/poc</span> <span className="text-ink-400">$</span> <span className="text-ink-100">{line.text}</span></div>;
    case 'user': {
      const text = typingChars !== undefined ? line.text.slice(0, typingChars) : line.text;
      return (
        <div className="my-2 rounded-md border border-ink-700 bg-ink-850/80 px-3 py-2 text-ink-100">
          <span className="text-lilac-400">&gt;</span> {text}
          {typingChars !== undefined && <span className="ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[2px] animate-blink bg-ember-400" />}
        </div>
      );
    }
    case 'plan':
      return <div className="text-ink-100"><span className="text-ember-400">●</span> {line.text}</div>;
    case 'agent':
      return (
        <div className="pl-3 text-ink-300">
          <span className="text-ink-600">⎿ </span>
          <span className={agentState === 'done' ? 'text-amber-400' : 'text-lilac-400'}>{agentState === 'done' ? '✓' : spin}</span>{' '}
          <span className={agentState === 'done' ? 'text-ink-400' : ''}>{line.text}</span>
        </div>
      );
    case 'done':
      return <div className="text-ink-300"><span className="text-amber-400">✓</span> {line.text}</div>;
    case 'final':
      return <div className="mt-2 font-semibold"><span className="text-ember-400">★</span> <span className="text-gradient">{line.text}</span></div>;
    default:
      return <div className="h-3" />;
  }
}

/* ---------- grafo de orquestração ---------- */

const AX = [56, 152, 248, 344];
const OY = 58;
const AY = 206;
const edge = (x: number) => `M200 ${OY + 22} C 200 ${OY + 80}, ${x} ${AY - 90}, ${x} ${AY - 22}`;

function Graph({ agents, phase, labels }: { agents: AgentState[]; phase: string; labels: { orchestrator: string; agents: string[] } }) {
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" role="img" aria-label="Orquestração de subagentes">
      <defs>
        <radialGradient id="og" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6b3d" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff6b3d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff8a5c" />
          <stop offset="100%" stopColor="#a995ff" />
        </linearGradient>
      </defs>

      {AX.map((x, i) => {
        const st = agents[i];
        return (
          <g key={i}>
            <path d={edge(x)} fill="none" stroke="#23232f" strokeWidth="1.5" />
            {st !== 'idle' && (
              <motion.path
                d={edge(x)} fill="none" stroke="url(#eg)" strokeWidth={st === 'running' ? 1.8 : 1.4}
                strokeDasharray={st === 'running' ? '4 6' : '0'}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: st === 'done' ? (phase === 'done' ? 0.9 : 0.45) : 1, strokeDashoffset: st === 'running' ? [0, -40] : 0 }}
                transition={{ pathLength: { duration: 0.6 }, strokeDashoffset: { duration: 1, repeat: Infinity, ease: 'linear' } }}
              />
            )}
            {st === 'running' && (
              <circle r="3" fill="#ffc15e">
                <animateMotion dur={`${1.1 + i * 0.15}s`} repeatCount="indefinite" path={edge(x)} />
              </circle>
            )}
            {st === 'done' && phase !== 'done' && (
              <circle r="2.5" fill="#a995ff">
                <animateMotion dur="1.4s" repeatCount="1" fill="freeze" keyPoints="1;0" keyTimes="0;1" calcMode="linear" path={edge(x)} />
              </circle>
            )}
          </g>
        );
      })}

      {/* orquestrador */}
      <motion.circle cx="200" cy={OY} r="46" fill="url(#og)" animate={{ opacity: phase === 'idle' ? 0.15 : [0.4, 0.9, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }} />
      <circle cx="200" cy={OY} r="22" fill="#12121a" stroke={phase === 'done' ? '#ffc15e' : '#ff6b3d'} strokeWidth="1.6" />
      {phase === 'planning' || phase === 'working' ? (
        <g style={{ transformOrigin: `200px ${OY}px` }} className="animate-spin-slow">
          <circle cx="200" cy={OY} r="29" fill="none" stroke="#ff8a5c" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="3 7" />
        </g>
      ) : null}
      <text x="200" y={OY + 4.5} textAnchor="middle" className="fill-ember-400 font-mono" fontSize="13">{phase === 'done' ? '✓' : '✳'}</text>
      <text x="200" y={OY - 32} textAnchor="middle" className="fill-ink-300 font-mono" fontSize="10">{labels.orchestrator}</text>

      {/* subagentes */}
      {AX.map((x, i) => {
        const st = agents[i];
        return (
          <g key={`n${i}`}>
            <motion.rect
              x={x - 34} y={AY - 20} width="68" height="40" rx="10"
              fill={st === 'done' ? 'rgba(255,193,94,0.08)' : '#12121a'}
              animate={{ stroke: st === 'idle' ? '#30303f' : st === 'running' ? '#a995ff' : '#ffc15e' }}
              strokeWidth="1.4"
            />
            {st === 'running' && (
              <motion.rect x={x - 34} y={AY - 20} width="68" height="40" rx="10" fill="none" stroke="#a995ff"
                initial={{ opacity: 0.6, scale: 1 }} animate={{ opacity: 0, scale: 1.25 }} transition={{ duration: 1.2, repeat: Infinity }}
                style={{ transformOrigin: `${x}px ${AY}px` }} />
            )}
            <text x={x} y={AY + 4} textAnchor="middle" fontSize="10" className={`font-mono ${st === 'idle' ? 'fill-ink-400' : 'fill-ink-100'}`}>
              {labels.agents[i]}
            </text>
            <text x={x} y={AY + 38} textAnchor="middle" fontSize="9" className={`font-mono ${st === 'done' ? 'fill-amber-400' : st === 'running' ? 'fill-lilac-400' : 'fill-ink-600'}`}>
              {st === 'done' ? 'done' : st === 'running' ? 'running' : 'idle'}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ClaudeCode() {
  const { c } = useLang();
  const k = c.claude;
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const { shown, typing, tick, agents, phase } = useSession(k.script, inView, reduced);
  const spin = SPIN[tick % SPIN.length];
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <section id="claude" className="relative py-28 md:py-36 overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-ember-500/[0.06] blur-[120px]" />
      <div className="wrap relative">
        <Reveal>
          <p className="eyebrow">{k.eyebrow}</p>
          <h2 className="h2 mt-4 max-w-3xl">{k.title}</h2>
          <p className="mt-5 max-w-2xl text-ink-400 leading-relaxed">{k.intro}</p>
        </Reveal>

        <div ref={ref} className="mt-14 grid gap-4 lg:grid-cols-12">
          {/* terminal */}
          <Reveal className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/90 shadow-[0_30px_80px_-30px_rgba(255,107,61,0.25)]">
              <div className="flex items-center gap-2 border-b border-ink-800 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 font-mono text-xs text-ink-400">claude — ~/poc</span>
                <span className="ml-auto hidden sm:inline font-mono text-[10px] uppercase tracking-wider text-ink-600">{k.disclaimer}</span>
              </div>
              <div ref={bodyRef} className="h-[470px] sm:h-[400px] overflow-hidden sm:whitespace-pre-wrap px-4 py-4 font-mono text-[11px] leading-[1.7] sm:text-[12.5px] sm:leading-[1.75]">
                <AnimatePresence initial={false}>
                  {k.script.slice(0, typing >= 0 ? shown + 1 : shown).map((line, i) => (
                    <motion.div key={`${i}-${line.text}`} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                      <Line
                        line={line}
                        spin={spin}
                        agentState={line.agent !== undefined ? agents[line.agent] : undefined}
                        typingChars={i === shown && typing >= 0 ? typing : undefined}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {shown === 0 && typing < 0 && <span className="inline-block h-[1.05em] w-[7px] animate-blink bg-ember-400" />}
              </div>
            </div>
          </Reveal>

          {/* grafo */}
          <Reveal className="lg:col-span-5" delay={0.1}>
            <div className="flex h-full min-h-[340px] flex-col rounded-2xl border border-ink-800 bg-ink-900/60 p-5">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ink-400">
                <span>subagents</span>
                <span className={phase === 'done' ? 'text-amber-400' : phase === 'idle' ? '' : 'text-lilac-400'}>
                  {agents.filter((a) => a === 'done').length}/4
                </span>
              </div>
              <div className="flex-1"><Graph agents={agents} phase={phase} labels={k.graph} /></div>
            </div>
          </Reveal>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {k.points.map((p, i) => {
            const Icon = POINT_ICONS[i];
            return (
              <Reveal key={p.title} delay={i * 0.08}>
                <div onMouseMove={spotlightMove} className="spotlight group h-full rounded-2xl border border-ink-800 bg-ink-900/60 p-5">
                  <Icon size={18} className="text-ember-400 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12" />
                  <h3 className="mt-4 font-display text-base font-semibold text-ink-100">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">{p.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
