"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import "./neural-field.css";

type Language = "en" | "zh";
type TopicId = "learning" | "memory" | "intelligence";
type Point = { x: number; y: number };
type Stroke = { d: string; width: number; opacity: number; tone: "ink" | "olive"; order: number };
type Camera = { x: number; y: number; turn: number };

const TOPICS = [
  {
    id: "learning" as TopicId, point: { x: 337, y: 239 }, scale: 1, index: "01",
    title: { en: "Learning", zh: "学习" },
    description: { en: "How does experience become knowledge? Exploring learning, adaptation, and the ways we represent the world.", zh: "经验如何转化为知识？从学习、适应，以及我们表征世界的方式开始探索。" },
  },
  {
    id: "memory" as TopicId, point: { x: 151, y: 153 }, scale: 0.56, index: "02",
    title: { en: "Memory", zh: "记忆" },
    description: { en: "What stays, and what changes? Questions about memory, plasticity, and the traces experience leaves behind.", zh: "什么被留下，什么会改变？关于记忆、可塑性，以及经验留下的痕迹。" },
  },
  {
    id: "intelligence" as TopicId, point: { x: 527, y: 300 }, scale: 0.65, index: "03",
    title: { en: "Intelligence", zh: "智能" },
    description: { en: "How do connected parts give rise to complex behavior? Thinking across brains and artificial systems.", zh: "相互连接的个体如何产生复杂行为？在大脑与人工系统之间寻找值得思考的问题。" },
  },
];
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const f = (value: number) => value.toFixed(2);

// Seeded, hand-directed geometry is identical on server/client and never rebuilt per frame.
function drawNeuron(center: Point, seed: number, primary: boolean) {
  let state = seed;
  const random = () => { state = state * 16807 % 2147483647; return (state - 1) / 2147483646; };
  const branches: Stroke[] = [], spines: string[] = [], terminals: Point[] = [];
  function grow(start: Point, angle: number, length: number, depth: number, order: number, tone: Stroke["tone"]) {
    const bend = (random() - 0.5) * 0.44;
    const end = { x: clamp(start.x + Math.cos(angle + bend) * length, 39, 640), y: clamp(start.y + Math.sin(angle + bend) * length, 40, 420) };
    const a = { x: start.x + Math.cos(angle - bend * 0.65) * length * 0.44, y: start.y + Math.sin(angle - bend * 0.65) * length * 0.44 };
    const b = { x: end.x - Math.cos(angle + bend * 1.6) * length * 0.3, y: end.y - Math.sin(angle + bend * 1.6) * length * 0.3 };
    branches.push({ d: `M${f(start.x)} ${f(start.y)}C${f(a.x)} ${f(a.y)} ${f(b.x)} ${f(b.y)} ${f(end.x)} ${f(end.y)}`, width: (primary ? [4.4, 2.5, 1.4, 0.85, 0.5] : [2.5, 1.5, 0.85, 0.5])[order] ?? 0.45, opacity: 0.95 - order * 0.09, tone, order });
    if (order > 0 && random() > 0.35) {
      const side = random() > 0.5 ? 1 : -1;
      const x = start.x + (end.x - start.x) * 0.55, y = start.y + (end.y - start.y) * 0.55, reach = 3 + random() * 3;
      spines.push(`M${f(x)} ${f(y)}q${f(Math.cos(angle + side * 1.1) * reach)} ${f(Math.sin(angle + side * 1.1) * reach)} ${f(Math.cos(angle + side * 0.9) * (reach + 1.6))} ${f(Math.sin(angle + side * 0.9) * (reach + 1.6))}`);
    }
    if (depth > 0) {
      grow(end, angle + bend - 0.23 - random() * 0.35, length * (0.63 + random() * 0.11), depth - 1, order + 1, tone);
      grow(end, angle + bend + 0.27 + random() * 0.34, length * (0.61 + random() * 0.12), depth - 1, order + 1, tone);
    } else if (random() > 0.78) terminals.push(end);
  }
  const arms = primary ? 8 : 6;
  for (let arm = 0; arm < arms; arm += 1) grow(center, arm / arms * Math.PI * 2 - 2.72 + (random() - 0.5) * 0.35, primary ? 60 + random() * 11 : 34 + random() * 10, primary ? 4 : 3, 0, arm % 3 === 1 ? "olive" : "ink");
  return { branches, spines, terminals };
}
const DRAWINGS = TOPICS.map((topic, index) => drawNeuron(topic.point, [173, 431, 839][index], index === 0));
const AXONS = ["M151 153C190 148 184 195 230 187S302 190 337 239", "M337 239C394 214 410 269 451 282S498 306 527 300", "M527 300C480 362 399 382 315 349S204 355 170 299C139 250 105 204 151 153"];
const SOMA = "M-41-7C-35-17-33-26-22-29C-14-34-12-43-4-39C6-35 14-35 23-29C33-25 28-16 39-9C47-2 37 6 35 15C29 24 22 24 16 34C8 41-2 33-12 36C-23 33-21 24-31 20C-38 14-33 4-41-7Z";
const GRANULES = Array.from({ length: 55 }, (_, index) => ({ x: Math.cos(index * 2.39996) * (15 + index % 7 * 2.5), y: Math.sin(index * 2.39996) * (15 + index % 7 * 2.5) * 0.88, r: 0.45 + index % 3 * 0.25 }));

function MotionIcon({ paused }: { paused: boolean }) {
  return <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true">{paused ? <path d="m5 3 7 5-7 5Z" fill="currentColor" /> : <path d="M5 3v10M11 3v10" fill="none" stroke="currentColor" strokeWidth="2" />}</svg>;
}

export default function NeuralField({ lang }: { lang: Language }) {
  const svgId = `neural-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [selected, setSelected] = useState<TopicId>("learning");
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [pulseEpoch, setPulseEpoch] = useState(0);
  const [selectionEpoch, setSelectionEpoch] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<Camera>({ x: 0, y: 0, turn: 0 });
  const dragRef = useRef<{ id: number; x: number; y: number; origin: Camera } | null>(null);
  const frameRef = useRef<number | null>(null);
  const pendingRef = useRef({ x: 0, y: 0, turn: 0, tiltX: 0, tiltY: 0 });
  const wantsMotion = !paused && !reducedMotion, active = wantsMotion && visible && tabVisible;
  const topic = TOPICS.find((item) => item.id === selected) ?? TOPICS[0];

  function paintCamera(x: number, y: number, turn: number, tiltX = 0, tiltY = 0) {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--neural-shift-x", `${x}px`);
    stage.style.setProperty("--neural-shift-y", `${y}px`);
    stage.style.setProperty("--neural-turn", `${turn}deg`);
    stage.style.setProperty("--neural-tilt-x", `${tiltX}deg`);
    stage.style.setProperty("--neural-tilt-y", `${tiltY}deg`);
  }
  function stopPointerMotion(resetCamera = false) {
    if (frameRef.current !== null) { cancelAnimationFrame(frameRef.current); frameRef.current = null; }
    const drag = dragRef.current;
    dragRef.current = null;
    const stage = stageRef.current;
    if (drag && stage?.hasPointerCapture(drag.id)) stage.releasePointerCapture(drag.id);
    if (stage) { stage.dataset.dragging = "false"; delete stage.dataset.near; }
    if (resetCamera) cameraRef.current = { x: 0, y: 0, turn: 0 };
    const camera = cameraRef.current;
    paintCamera(camera.x, camera.y, camera.turn);
  }
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setTabVisible(document.visibilityState === "visible");
    updateMotion(); updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.08 }) : null;
    if (observer && stageRef.current) observer.observe(stageRef.current); else setVisible(true);
    return () => { media.removeEventListener("change", updateMotion); document.removeEventListener("visibilitychange", updateVisibility); observer?.disconnect(); if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); };
  }, []);
  useEffect(() => {
    if (!active) stopPointerMotion(reducedMotion);
    // Visibility/preference changes must also release an in-progress gesture.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reducedMotion]);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!active || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width, py = (event.clientY - rect.top) / rect.height;
    const nearby = TOPICS.reduce((best, item) => { const distance = Math.hypot(item.point.x - px * 680, item.point.y - py * 460); return distance < best.distance ? { id: item.id, distance } : best; }, { id: "" as string, distance: 118 });
    event.currentTarget.dataset.near = nearby.id;
    const drag = dragRef.current;
    if (drag) {
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      cameraRef.current = { x: clamp(drag.origin.x + dx * 0.12, -12, 12), y: clamp(drag.origin.y + dy * 0.12, -8, 8), turn: clamp(drag.origin.turn + dx * 0.018, -2, 2) };
      pendingRef.current = { ...cameraRef.current, tiltX: clamp(-dy * 0.025, -3, 3), tiltY: clamp(dx * 0.025, -3, 3) };
    } else {
      const camera = cameraRef.current;
      pendingRef.current = { x: camera.x + (px - 0.5) * 6, y: camera.y + (py - 0.5) * 4, turn: camera.turn, tiltX: (0.5 - py) * 1.8, tiltY: (px - 0.5) * 1.8 };
    }
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(() => { frameRef.current = null; const view = pendingRef.current; paintCamera(view.x, view.y, view.turn, view.tiltX, view.tiltY); });
  }
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!active || event.pointerType !== "mouse" || event.button !== 0 || (event.target as Element).closest("button")) return;
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, origin: { ...cameraRef.current } };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
    event.preventDefault();
  }
  function reset() { stopPointerMotion(true); setSelected("learning"); setPaused(false); setPulseEpoch((value) => value + 1); setSelectionEpoch(0); }

  return (
    <figure className="neural-field" data-playing={active} data-motion={wantsMotion ? "on" : "off"} aria-label={lang === "zh" ? "神经连接交互手稿：兴趣与探索" : "An interactive neural manuscript: interests and exploration"}>
      <div className="neural-field__header"><span className="neural-field__folio"><span aria-hidden="true">✳</span>{lang === "zh" ? "连接的形状" : "The shape of connection"}</span><span className="neural-field__edition">PLATE 01 <span>/</span> NEURAL STUDIES</span></div>
      <div className="neural-field__stage" ref={stageRef} onPointerMove={onPointerMove} onPointerDown={onPointerDown} onPointerUp={() => stopPointerMotion()} onPointerCancel={() => stopPointerMotion()} onLostPointerCapture={() => stopPointerMotion()} onPointerLeave={() => { if (!dragRef.current) stopPointerMotion(); }}>
        <div className="neural-field__drawing">
          <svg className="neural-field__svg" viewBox="0 0 680 460" fill="none" aria-hidden="true" focusable="false">
            <defs>
              <radialGradient id={`${svgId}-copper`} cx="36%" cy="30%" r="72%"><stop offset="0" className="neural-field__stop-light" /><stop offset="0.5" className="neural-field__stop-copper" /><stop offset="1" className="neural-field__stop-deep" /></radialGradient>
              <radialGradient id={`${svgId}-olive`} cx="33%" cy="29%" r="76%"><stop offset="0" className="neural-field__stop-light" /><stop offset="0.58" className="neural-field__stop-olive" /><stop offset="1" className="neural-field__stop-olive-deep" /></radialGradient>
              <radialGradient id={`${svgId}-nucleus`} cx="35%" cy="30%" r="70%"><stop offset="0" stopColor="#edd2a0" /><stop offset="0.65" stopColor="#b67b4b" /><stop offset="1" stopColor="#795238" /></radialGradient>
            </defs>
            <g className="neural-field__plate-guides" strokeWidth="0.65"><path d="M25 49V28h21M634 28h21v21M25 411v21h21M655 411v21h-21M48 401h61M48 397v8M109 397v8" /><path d="M53 79C172 3 344 25 454 56C551 84 628 174 633 264M91 354C199 439 408 440 573 378" strokeDasharray="2 5" /><path d="m449 51 5 5-7 1M628 257l5 7 2-8" />{Array.from({ length: 9 }, (_, index) => <path key={index} d={`M${237 + index * 23} 35v${index % 2 === 0 ? 6 : 3}`} />)}</g>
            <g className="neural-field__annotations"><text x="48" y="421">a field of possibilities</text><text x="74" y="47">II.</text><text x="393" y="57">experience → connection</text><text x="602" y="355" transform="rotate(-90 602 355)">traces / patterns / emergence</text><text x="615" y="402">III.</text></g>
            <g className="neural-field__understory" strokeWidth="0.75" strokeLinecap="round"><path d="M60 215C148 209 204 104 293 118S423 206 598 142M77 277C160 244 219 328 329 305S460 209 604 238M106 373C170 320 235 358 311 391S493 418 593 339M190 63C227 133 275 159 306 236S378 356 426 407M450 82C410 153 421 249 373 304S284 385 230 408M62 185C119 234 239 238 273 202S404 128 486 166" /><path d="M119 81C160 66 196 84 207 114M400 395c40-14 65-6 89 5M583 187c-19-18-29-29-47-31" strokeDasharray="1 4" /></g>
            <g className="neural-field__axon-underlay" strokeWidth="5.5" strokeLinecap="round">{AXONS.map((d, index) => <path key={index} d={d} />)}</g>
            <g className="neural-field__axons" strokeWidth="1.9" strokeLinecap="round">{AXONS.map((d, index) => <path key={index} d={d} />)}</g>
            {[1, 2, 0].map((index) => {
              const item = TOPICS[index], drawing = DRAWINGS[index];
              return <g key={item.id} data-topic={item.id} className={`neural-field__neuron${selected === item.id ? " is-selected" : ""}`} strokeLinecap="round" strokeLinejoin="round">
                {drawing.branches.map((branch, branchIndex) => <path key={branchIndex} className={`neural-field__branch neural-field__branch--${branch.tone}${branch.order < 2 ? " neural-field__trunk" : ""}`} d={branch.d} strokeWidth={branch.width} opacity={branch.opacity} />)}
                <g className="neural-field__spines" strokeWidth="0.65">{drawing.spines.map((d, spineIndex) => <path key={spineIndex} d={d} />)}</g>
                <g className="neural-field__terminal-dots">{drawing.terminals.map((point, dotIndex) => <circle key={dotIndex} cx={point.x} cy={point.y} r={0.75} stroke="none" />)}</g>
                <g transform={`translate(${item.point.x} ${item.point.y}) scale(${item.scale})`}>
                  <path className="neural-field__cell-shadow" d={SOMA} transform="translate(2 2)" stroke="none" />
                  <path className="neural-field__soma" d={SOMA} fill={`url(#${svgId}-${selected === item.id ? "copper" : "olive"})`} strokeWidth="1.45" />
                  <path className="neural-field__cell-etch" d="M-29-9C-22-27-4-32 16-25M-27-5C-29 11-19 23-8 24M-23-7C-21-18-14-22-5-24M-27 1l5 6M-25 10l5 5M-18 21l6 2M-16-24l6-2M18-21l5 6M25-12l3 7M28 5l-3 8M21 17l-6 5M4 27l-7-1" strokeWidth="0.9" />
                  <path className="neural-field__cell-highlight" d="M-30-9C-27-21-15-27-4-29M-24-14l3-4M-17-24l7-2" strokeWidth="1.3" />
                  <g className="neural-field__granules">{GRANULES.map((grain, grainIndex) => <circle key={grainIndex} cx={grain.x} cy={grain.y} r={grain.r} stroke="none" />)}</g>
                  <ellipse className="neural-field__nuclear-membrane" cx="-2.5" cy="-3" rx="15.3" ry="12.4" transform="rotate(-21)" strokeWidth="0.75" />
                  <ellipse cx="-2.5" cy="-3" rx="12.4" ry="10" transform="rotate(-21)" fill={`url(#${svgId}-nucleus)`} className="neural-field__nucleus" strokeWidth="0.95" />
                  <path d="M-12-5c1-5 5-7 10-6" className="neural-field__cell-highlight" strokeWidth="1" />
                  <circle className="neural-field__nucleolus" cx="-0.3" cy="-1.8" r="3.4" strokeWidth="0.65" /><circle cx="-1.1" cy="-3" r="0.9" fill="#efcf98" stroke="none" />
                  <path d="M10 7q7 0 10 5M9 11q6 0 8 4M-17 7l4 5M-13 12l4 2" className="neural-field__cell-etch" strokeWidth="1.4" />
                </g>
              </g>;
            })}
            <g className="neural-field__synapses" strokeWidth="0.9"><circle cx="230" cy="187" r="3.1" /><circle cx="451" cy="282" r="3.1" /><circle cx="315" cy="349" r="2.8" /><circle cx="170" cy="299" r="2.5" /></g>
            <g key={pulseEpoch} className="neural-field__signals" strokeLinecap="round">{AXONS.map((d, index) => <g key={index} style={{ "--neural-delay": `${index * -2.15}s` } as CSSProperties}><path className="neural-field__signal-trail" d={d} pathLength="100" /><path className="neural-field__signal-head" d={d} pathLength="100" /></g>)}</g>
            {selectionEpoch > 0 && active ? <g transform={`translate(${topic.point.x} ${topic.point.y})`}><circle key={selectionEpoch} className="neural-field__selection-flash" r={topic.scale * 45} strokeWidth="1.2" /></g> : null}
          </svg>
          {TOPICS.map((item, index) => <button key={item.id} type="button" className={`neural-field__node${index === 0 ? " neural-field__node--primary" : ""}${selected === item.id ? " is-selected" : ""}`} style={{ left: `${item.point.x / 6.8}%`, top: `${item.point.y / 4.6}%` }} aria-label={lang === "zh" ? `探索${item.title.zh}` : `Explore ${item.title.en.toLowerCase()}`} aria-pressed={selected === item.id} aria-controls={`${svgId}-thought`} onClick={() => { setSelected(item.id); setSelectionEpoch((value) => value + 1); }} onFocus={() => { if (stageRef.current) stageRef.current.dataset.near = item.id; }} onBlur={() => { if (stageRef.current) delete stageRef.current.dataset.near; }}><span className="neural-field__node-ring" aria-hidden="true" /><span className="neural-field__node-label"><span>{item.index}</span>{item.title[lang]}<span className="neural-field__node-arrow" aria-hidden="true">↗</span></span></button>)}
        </div>
        <div className="neural-field__drag-hint" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12M6 4l2-2 2 2M6 12l2 2 2-2M4 6 2 8l2 2M12 6l2 2-2 2" stroke="currentColor" strokeWidth="0.8" /></svg><span className="neural-field__desktop-hint">{lang === "zh" ? "拖动手稿 · 点选节点" : "Drag to turn · select a node"}</span><span className="neural-field__touch-hint">{lang === "zh" ? "点选节点，展开思考" : "Tap a node to explore"}</span></div>
      </div>
      <figcaption className="neural-field__caption">
        <div className="neural-field__thought" id={`${svgId}-thought`} aria-live="polite" aria-atomic="true"><span className="neural-field__thought-index" aria-hidden="true">{topic.index}</span><div><span className="neural-field__thought-label">{lang === "zh" ? "兴趣与探索" : "A question to explore"}</span><p>{topic.description[lang]}</p></div></div>
        <div className="neural-field__controls"><span className="neural-field__status"><span aria-hidden="true" />{reducedMotion ? (lang === "zh" ? "静态阅读模式" : "Reduced motion") : paused ? (lang === "zh" ? "传导已暂停" : "Signals paused") : (lang === "zh" ? "连接中的思考" : "Thoughts in connection")}</span><div className="neural-field__control-buttons">
          <button type="button" className="neural-field__control" disabled={reducedMotion} onClick={() => { setPaused((value) => !value); stopPointerMotion(); }} aria-label={reducedMotion ? (lang === "zh" ? "已遵循系统设置，关闭动态效果" : "Animations are off to follow your reduced motion preference") : wantsMotion ? (lang === "zh" ? "暂停动画与拖动" : "Pause animation and dragging") : (lang === "zh" ? "播放动画并启用拖动" : "Play animation and enable dragging")}><MotionIcon paused={!wantsMotion} />{reducedMotion ? (lang === "zh" ? "静态" : "Static") : wantsMotion ? (lang === "zh" ? "暂停" : "Pause") : (lang === "zh" ? "播放" : "Play")}</button>
          <button type="button" className="neural-field__control" onClick={reset} aria-label={lang === "zh" ? "重置方向、选中节点与动画" : "Reset orientation, selected node, and animation"}><svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 6a5 5 0 1 1 .4 5M3 2v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>{lang === "zh" ? "重置" : "Reset"}</button>
        </div></div>
      </figcaption>
    </figure>
  );
}
