"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, ChevronRight, Database, Dumbbell, ExternalLink, Info, LoaderCircle, Search, ShieldCheck, Upload, X } from "lucide-react";
import { AnatomyViewer } from "@/components/anatomy-viewer";
import { exercises, type Exercise } from "@/lib/exercise-data";
import { loadExerciseCatalog } from "@/lib/external-catalog";

type DetailTab = "mechanics" | "form" | "posture";
const ROLE_LABEL = { primary: "主动肌", secondary: "辅助肌", stabilizer: "稳定肌" };
const ROLE_COLOR = { primary: "bg-[#ff5b45]", secondary: "bg-[#f6b84b]", stabilizer: "bg-[#4ea7d8]" };

function MuscleRow({ muscle }: { muscle: Exercise["muscles"][number] }) {
  return (
    <li className="grid grid-cols-[8px_1fr_auto] items-center gap-3 border-b border-white/6 py-3 last:border-0">
      <span className={`h-2 w-2 rounded-full ${ROLE_COLOR[muscle.role]}`} />
      <div>
        <p className="text-sm font-medium text-white">{muscle.nameZh}</p>
        <p className="mt-0.5 text-xs text-white/42">{muscle.nameEn}</p>
      </div>
      <span className="font-mono text-xs text-white/45">{Math.round(muscle.activation * 100)}%</span>
    </li>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(exercises[0].id);
  const [tab, setTab] = useState<DetailTab>("mechanics");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Exercise[]>([]);
  const [catalogState, setCatalogState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const allExercises = useMemo(() => [...exercises, ...catalog], [catalog]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? allExercises.filter((x) => [x.nameZh, x.nameEn, x.pattern, x.equipment, ...x.muscles.map((m) => `${m.nameZh} ${m.nameEn}`)].join(" ").toLowerCase().includes(q)) : allExercises;
  }, [allExercises, query]);
  const visibleExercises = filtered.slice(0, 120);
  const selected = allExercises.find((item) => item.id === selectedId) ?? exercises[0];

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Parameters<ModelContext["registerTool"]>[0]) => {
      try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch { /* Unsupported experimental API. */ }
    };
    register({
      name: "list_exercises",
      title: "列出训练动作",
      description: "读取 Kinetic Atlas 中可选择的训练动作及其动作模式。",
      inputSchema: { type: "object", properties: { query: { type: "string" }, limit: { type: "number", minimum: 1, maximum: 100 } }, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: (input: unknown) => {
        const values = typeof input === "object" && input ? input as { query?: unknown; limit?: unknown } : {};
        const q = typeof values.query === "string" ? values.query.toLowerCase() : "";
        const limit = Math.min(100, Math.max(1, Number(values.limit) || 30));
        const matches = allExercises.filter((item) => !q || `${item.nameZh} ${item.nameEn} ${item.pattern}`.toLowerCase().includes(q));
        return { total: matches.length, exercises: matches.slice(0, limit).map(({ id, nameZh, nameEn, pattern, reviewStatus }) => ({ id, nameZh, nameEn, pattern, reviewStatus })) };
      },
    });
    register({
      name: "select_exercise",
      title: "选择训练动作",
      description: "按动作 ID 切换当前可见的 3D 肌肉高亮和动作说明。",
      inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input: unknown) => {
        const id = typeof input === "object" && input && "id" in input ? String((input as { id: unknown }).id) : "";
        const next = allExercises.find((x) => x.id === id);
        if (!next) throw new Error("Unknown exercise id");
        setSelectedId(id); setMediaUrl(null);
        return { selected: { id: next.id, nameZh: next.nameZh, nameEn: next.nameEn } };
      },
    });
    return () => lifecycle.abort();
  }, [allExercises]);

  async function importCatalog() {
    if (catalogState === "loading" || catalogState === "ready") return;
    setCatalogState("loading");
    try {
      const items = await loadExerciseCatalog();
      setCatalog(items);
      setCatalogState("ready");
    } catch {
      setCatalogState("error");
    }
  }

  function importMedia(file?: File) {
    if (!file) return;
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaUrl(URL.createObjectURL(file));
  }

  return (
    <main className="min-h-screen bg-[#07100f] text-[#edf5f1]">
      <header className="flex h-16 items-center justify-between border-b border-white/8 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#b8f55b] text-[#08110f] shadow-[0_0_28px_rgba(184,245,91,.15)]"><Activity size={19} strokeWidth={2.4} /></div>
          <div><p className="text-[15px] font-semibold tracking-[-0.02em]">KINETIC ATLAS</p><p className="text-[11px] tracking-[0.12em] text-white/35">动作与解剖实验室</p></div>
        </div>
        <div className="hidden items-center gap-2 text-xs text-white/45 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#b8f55b]" />本地优先 · 教育用途</div>
      </header>

      <div className="workspace-grid">
        <aside className="exercise-rail flex flex-col border-r border-white/8 bg-[#091412]">
          <div className="p-4">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" size={16} />
              <input aria-label="搜索动作" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索动作或器械" className="h-10 w-full rounded-xl border border-white/8 bg-white/[0.035] pl-9 pr-3 text-sm outline-none placeholder:text-white/28 focus:border-[#b8f55b]/55" />
            </label>
          </div>
          <div className="px-4 pb-3">
            <button onClick={importCatalog} disabled={catalogState === "loading" || catalogState === "ready"} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.025] px-3 py-2.5 text-xs text-white/55 transition hover:border-[#b8f55b]/35 hover:text-white disabled:opacity-65">
              {catalogState === "loading" ? <LoaderCircle className="animate-spin" size={14} /> : <Database size={14} />}
              {catalogState === "ready" ? `公共索引已载入 · ${catalog.length} 条` : catalogState === "loading" ? "正在载入动作索引…" : catalogState === "error" ? "载入失败 · 点击重试" : "载入 1323 动作公共索引"}
            </button>
            <p className="mt-2 text-[10px] leading-4 text-white/25">仅获取动作元数据；GIF 不打包进本站。</p>
          </div>
          <div className="flex items-center justify-between px-4 pb-3 text-xs text-white/35"><span>动作库</span><span>{visibleExercises.length}{filtered.length > visibleExercises.length ? ` / ${filtered.length}` : ""} 项</span></div>
          <nav className="rail-scroll min-h-0 flex-1 px-2 pb-5" aria-label="动作列表">
            {visibleExercises.map((exercise) => {
              const active = exercise.id === selected.id;
              return (
                <button key={exercise.id} onClick={() => { setSelectedId(exercise.id); setMediaUrl(null); }} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active ? "bg-[#b8f55b] text-[#08110f]" : "text-white/72 hover:bg-white/5 hover:text-white"}`}>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${active ? "bg-black/10" : "bg-white/5"}`}><Dumbbell size={15} /></span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{exercise.nameZh}</span><span className={`mt-0.5 block truncate text-[11px] ${active ? "text-black/55" : "text-white/32"}`}>{exercise.pattern} · {exercise.equipment}</span></span>
                  <ChevronRight size={14} className={active ? "opacity-55" : "opacity-25"} />
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="viewer-stage relative min-h-[540px] overflow-hidden">
          <div className="absolute left-5 top-5 z-10 max-w-[70%]">
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.15em] text-[#b8f55b]">{selected.pattern}</p>
            <h1 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{selected.nameZh}</h1>
            <p className="mt-1 text-sm text-white/38">{selected.nameEn}</p>
            {selected.reviewStatus === "catalog" && <p className="mt-2 inline-flex rounded-full border border-[#f6b84b]/20 bg-[#f6b84b]/8 px-2 py-1 text-[10px] text-[#f7cc75]">公共目录映射 · 未经人工逐条审核</p>}
          </div>
          <AnatomyViewer exercise={selected} />
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-end justify-between gap-3">
            <div className="rounded-xl border border-white/8 bg-[#08110f]/78 px-3 py-2.5 text-xs text-white/50 backdrop-blur-md">
              <div className="flex flex-wrap gap-x-4 gap-y-2">{(Object.keys(ROLE_LABEL) as Array<keyof typeof ROLE_LABEL>).map((role) => <span key={role} className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${ROLE_COLOR[role]}`} />{ROLE_LABEL[role]}</span>)}</div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-[#101c19]/90 px-3 py-2.5 text-xs font-medium text-white/70 backdrop-blur-md transition hover:border-[#b8f55b]/45 hover:text-white">
              <Upload size={14} />导入本地动作 GIF
              <input type="file" accept="image/gif" className="sr-only" onChange={(e) => importMedia(e.target.files?.[0])} />
            </label>
            {selected.gifUrl && <button onClick={() => setMediaUrl(selected.gifUrl ?? null)} className="flex items-center gap-2 rounded-xl border border-[#f6b84b]/20 bg-[#101c19]/90 px-3 py-2.5 text-xs font-medium text-[#f7cc75] backdrop-blur-md transition hover:border-[#f6b84b]/45"><ExternalLink size={14} />按需查看第三方 GIF</button>}
          </div>
          {mediaUrl && <div className="absolute bottom-20 right-4 z-20 overflow-hidden rounded-2xl border border-white/12 bg-black shadow-2xl"><img src={mediaUrl} alt={`${selected.nameZh} 动作演示`} className="h-48 w-48 object-cover" /><button aria-label="关闭动作演示" className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-lg bg-black/70 text-white/70" onClick={() => setMediaUrl(null)}><X size={14} /></button>{selected.gifUrl === mediaUrl && <p className="max-w-48 px-3 py-2 text-[9px] leading-4 text-white/38">第三方 CDN 按需加载 · GIF 权利归原作者</p>}</div>}
        </section>

        <aside className="detail-panel border-l border-white/8 bg-[#091412]">
          <div className="border-b border-white/8 p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-xs text-white/35">动作档案</p><p className="mt-1 text-sm font-medium">{selected.equipment}</p></div><span className={`rounded-full border px-2.5 py-1 text-[11px] ${selected.reviewStatus === "catalog" ? "border-[#f6b84b]/22 bg-[#f6b84b]/8 text-[#f7cc75]" : "border-[#b8f55b]/22 bg-[#b8f55b]/8 text-[#c9fb7e]"}`}>{selected.reviewStatus === "catalog" ? "目录映射" : "已人工整理"}</span></div></div>
          <div className="grid grid-cols-3 border-b border-white/8 px-3 pt-2">
            {([["mechanics", "发力"], ["form", "动作"], ["posture", "体态"]] as Array<[DetailTab, string]>).map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`border-b-2 px-2 py-3 text-sm transition ${tab === id ? "border-[#b8f55b] text-white" : "border-transparent text-white/35 hover:text-white/65"}`}>{label}</button>)}
          </div>
          <div className="detail-scroll p-5">
            {tab === "mechanics" && <><h2 className="section-label">肌肉参与</h2><ul className="mt-2">{[...selected.muscles].sort((a, b) => b.activation - a.activation).map((m) => <MuscleRow key={m.id} muscle={m} />)}</ul><h2 className="section-label mt-7">动作阶段</h2><ol className="mt-3 space-y-3">{selected.phases.map((phase, i) => <li key={phase.name} className="grid grid-cols-[26px_1fr] gap-3"><span className="grid h-6 w-6 place-items-center rounded-full border border-white/10 text-[11px] text-white/45">{i + 1}</span><div><p className="text-sm font-medium">{phase.name}</p><p className="mt-1 text-[13px] leading-5 text-white/46">{phase.description}</p></div></li>)}</ol></>}
            {tab === "form" && <><h2 className="section-label">动作要点</h2><ul className="mt-3 space-y-3">{selected.cues.map((cue) => <li key={cue} className="flex gap-3 text-sm leading-6 text-white/65"><ShieldCheck className="mt-1 shrink-0 text-[#b8f55b]" size={15} />{cue}</li>)}</ul><h2 className="section-label mt-7">常见代偿</h2><div className="mt-3 space-y-3">{selected.compensations.map((item) => <div key={item.observation} className="rounded-xl border border-white/8 bg-white/[0.025] p-3.5"><p className="text-sm font-medium text-[#ffb19f]">{item.observation}</p><p className="mt-1.5 text-[13px] leading-5 text-white/48">{item.possibleContributors.join("；")}</p></div>)}</div></>}
            {tab === "posture" && <><div className="rounded-xl border border-[#4ea7d8]/18 bg-[#4ea7d8]/7 p-4"><div className="flex items-center gap-2 text-sm font-medium text-[#8dcaeb]"><Info size={15} />观察，不是诊断</div><p className="mt-2 text-[13px] leading-5 text-white/52">同一种动作表现可能来自活动度、控制、疲劳、负重或个体结构差异。请结合无负重测试与疼痛情况判断。</p></div><h2 className="section-label mt-6">引导式检查</h2><ol className="mt-3 space-y-3">{selected.selfChecks.map((check, i) => <li key={check} className="flex gap-3 text-sm leading-6 text-white/62"><span className="font-mono text-xs text-[#b8f55b]">0{i + 1}</span>{check}</li>)}</ol><p className="mt-7 border-t border-white/8 pt-4 text-xs leading-5 text-white/30">若出现锐痛、麻木、明显无力或持续加重，请停止训练并寻求专业评估。</p></>}
          </div>
        </aside>
      </div>
    </main>
  );
}

interface ModelContext {
  registerTool(tool: {
    name: string; title?: string; description: string; inputSchema: object;
    execute(input: unknown): unknown | Promise<unknown>;
    annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  }, options?: { signal?: AbortSignal }): void | Promise<void>;
}
