"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { Box, Layers, LoaderCircle, Rotate3D, ScanLine } from "lucide-react";
import type { Exercise, MuscleRole } from "@/lib/exercise-data";

const MUSCLE_FBX_PARTS = [
  "/media/anatomy/MuscularSystem100.fbx.part-001",
  "/media/anatomy/MuscularSystem100.fbx.part-002",
];
const REGIONS_FBX = "/media/anatomy/RegionsOfHumanBody100.fbx";
const ROLE_HEX: Record<MuscleRole, number> = { primary: 0xff5b45, secondary: 0xf6b84b, stabilizer: 0x4ea7d8 };

interface Props { exercise: Exercise; playbackPriority?: boolean }
type FocusMode = "muscles" | "fascia";

function material(color = 0x75817d, opacity = 1) {
  return new THREE.MeshStandardMaterial({ color, roughness: .68, metalness: .03, transparent: opacity < 1, opacity });
}

async function loadLocalFbx(loader: FBXLoader, urls: string[], onProgress?: (progress: number) => void) {
  const buffers: ArrayBuffer[] = [];
  for (let index = 0; index < urls.length; index += 1) {
    const response = await fetch(urls[index]);
    if (!response.ok) throw new Error(`Unable to load anatomy model: ${response.status}`);
    buffers.push(await response.arrayBuffer());
    onProgress?.(Math.round((index + 1) / urls.length * 85));
  }
  const byteLength = buffers.reduce((total, buffer) => total + buffer.byteLength, 0);
  const merged = new Uint8Array(byteLength);
  let offset = 0;
  for (const buffer of buffers) { merged.set(new Uint8Array(buffer), offset); offset += buffer.byteLength; }
  const model = loader.parse(merged.buffer, "");
  onProgress?.(100);
  return model;
}

function capsule(radius: number, length: number, color?: number) {
  return new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 8, 16), material(color));
}

function addMusclePair(group: THREE.Group, id: string, y: number, x: number, scale: [number, number, number], rotation = 0) {
  [-1, 1].forEach((side) => {
    const mesh = capsule(.1, .38);
    mesh.name = id;
    mesh.userData.muscleId = id;
    mesh.position.set(x * side, y, 0);
    mesh.scale.set(...scale);
    mesh.rotation.z = rotation * side;
    group.add(mesh);
  });
}

function buildStudyModel() {
  const root = new THREE.Group();
  root.rotation.y = -.12;

  const boneMat = material(0x263531, .5);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.31, 24, 20), boneMat);
  head.position.y = 2.45;
  root.add(head);
  const torso = capsule(.44, 1.05); torso.material = boneMat; torso.position.y = 1.35; torso.scale.set(1.05, 1, .62); root.add(torso);
  const pelvis = new THREE.Mesh(new THREE.SphereGeometry(.42, 24, 16), boneMat); pelvis.position.y = .55; pelvis.scale.set(1.12, .72, .72); root.add(pelvis);
  [-1, 1].forEach((side) => {
    const arm = capsule(.12, 1.08); arm.material = boneMat; arm.position.set(.62 * side, 1.35, 0); arm.rotation.z = .08 * side; root.add(arm);
    const leg = capsule(.17, 1.62); leg.material = boneMat; leg.position.set(.25 * side, -.62, 0); root.add(leg);
  });

  addMusclePair(root, "deltoid", 1.93, .55, [1.35, .65, 1.3], .45);
  addMusclePair(root, "biceps", 1.45, .65, [.72, .76, .72], .05);
  addMusclePair(root, "triceps", 1.42, .66, [.78, .86, .8], .05);
  addMusclePair(root, "forearm-flexors", .92, .68, [.62, .88, .62]);
  addMusclePair(root, "pectoralis-major", 1.72, .23, [1.65, .65, .7], 1.12);
  addMusclePair(root, "latissimus", 1.3, .28, [1.5, 1.1, .72], .12);
  addMusclePair(root, "rhomboids", 1.68, .15, [1.15, .46, .58], .7);
  addMusclePair(root, "serratus", 1.38, .39, [.65, .74, .62], .28);
  addMusclePair(root, "abdominals", 1.02, .16, [1.2, 1.12, .7]);
  addMusclePair(root, "obliques", .94, .34, [.72, .92, .65], .14);
  addMusclePair(root, "erector-spinae", 1.13, .18, [.72, 1.25, .65]);
  addMusclePair(root, "gluteus-maximus", .46, .25, [1.48, .76, 1.15], .05);
  addMusclePair(root, "gluteus-medius", .62, .34, [.78, .5, .85], .45);
  addMusclePair(root, "adductors", -.02, .13, [.86, 1.12, .76], .02);
  addMusclePair(root, "quadriceps", -.18, .25, [1.24, 1.45, 1.05], .02);
  addMusclePair(root, "hamstrings", -.2, .25, [1.08, 1.42, .92], .02);
  addMusclePair(root, "calves", -.96, .25, [.9, 1.1, .82], .02);
  addMusclePair(root, "trapezius", 1.88, .2, [1.35, .7, .72], .8);

  root.traverse((object) => {
    if (object instanceof THREE.Mesh && object.userData.muscleId) object.material = material();
  });
  return root;
}

function applyStudyColors(root: THREE.Object3D, exercise: Exercise, detailed = false, focusMode: FocusMode = "muscles") {
  const byId = new Map(exercise.muscles.map((muscle) => [muscle.id, muscle]));
  const normalizeName = (value: string) => value.toLowerCase().replace(/[_\-.]+/g, " ").replace(/\s+/g, " ");
  const allHints = exercise.muscles.flatMap((muscle) => muscle.meshHints.map((hint) => ({ hint: normalizeName(hint), muscle })));
  let fasciaMeshes = 0;
  if (detailed && focusMode === "fascia") {
    root.traverse((object) => {
      if (object instanceof THREE.Mesh && /fascia|aponeurosis|retinaculum/.test(normalizeName(object.name))) fasciaMeshes += 1;
    });
  }
  // Some exported FBX revisions omit connective-tissue mesh names. In that case,
  // keep the action muscles visible instead of rendering a nearly empty canvas.
  const showFascia = focusMode === "fascia" && fasciaMeshes > 0;
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const objectName = normalizeName(object.name);
    const fascial = detailed && /fascia|aponeurosis|retinaculum/.test(objectName);
    const hit = detailed
      ? allHints.find(({ hint }) => objectName.includes(hint))?.muscle
      : byId.get(String(object.userData.muscleId));
    const active = showFascia ? fascial : Boolean(hit);
    const color = showFascia && fascial ? 0x8ee8df : hit ? ROLE_HEX[hit.role] : detailed ? 0x273632 : 0x58706a;
    const opacity = active ? .96 : detailed ? .09 : .38;
    const nextMaterial = material(color, opacity);
    if (detailed) {
      nextMaterial.depthWrite = active;
      // Educational overlay: active structures remain legible through dense fascial layers.
      nextMaterial.depthTest = !active;
    }
    object.material = nextMaterial;
    object.renderOrder = active ? 10 : 0;
  });
  return showFascia;
}

export function AnatomyViewer({ exercise, playbackPriority = false }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const playbackPriorityRef = useRef(playbackPriority);
  const [detailed, setDetailed] = useState(false);
  const [showSurface, setShowSurface] = useState(false);
  const [focusMode, setFocusMode] = useState<FocusMode>("muscles");
  const [fasciaAvailable, setFasciaAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    playbackPriorityRef.current = playbackPriority;
  }, [playbackPriority]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(34, host.clientWidth / host.clientHeight, .01, 100);
    camera.position.set(0, 1.05, 7.8);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xd9fff1, 0x07100f, 2.6));
    const key = new THREE.DirectionalLight(0xffffff, 3.4); key.position.set(4, 5, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0x7ac7ff, 2); rim.position.set(-4, 1, -4); scene.add(rim);
    const grid = new THREE.GridHelper(7, 14, 0x244038, 0x152823); grid.position.y = -1.55; scene.add(grid);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, .55, 0); controls.enableDamping = true; controls.minDistance = 4.4; controls.maxDistance = 11;
    const model = buildStudyModel(); modelRef.current = model; applyStudyColors(model, exercise); scene.add(model);
    let frame = 0;
    const animate = () => {
      // Animated GIF decoding and a full-resolution WebGL loop compete for the main thread/GPU.
      // Keep the current anatomy frame visible while the instruction panel plays a demonstration.
      if (!playbackPriorityRef.current) {
        controls.update();
        renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    const resize = () => { camera.aspect = host.clientWidth / host.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(host.clientWidth, host.clientHeight); };
    const observer = new ResizeObserver(resize); observer.observe(host);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); controls.dispose(); renderer.dispose(); host.removeChild(renderer.domElement); scene.clear(); };
  // The scene is intentionally created once; selected exercise colors update in the effect below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (modelRef.current) setFasciaAvailable(applyStudyColors(modelRef.current, exercise, detailed, focusMode));
  }, [exercise, detailed, focusMode]);

  async function loadDetailedModel() {
    const scene = sceneRef.current;
    if (!scene || loading) return;
    setLoading(true); setError(""); setProgress(0);
    try {
      const loader = new FBXLoader();
      const model = await loadLocalFbx(loader, MUSCLE_FBX_PARTS, setProgress);
      const box = new THREE.Box3().setFromObject(model); const size = box.getSize(new THREE.Vector3()); const center = box.getCenter(new THREE.Vector3());
      const scale = 4 / Math.max(size.x, size.y, size.z); model.scale.setScalar(scale);
      model.position.copy(center).multiplyScalar(-scale); model.position.y += .5;
      if (modelRef.current) scene.remove(modelRef.current);
      modelRef.current = model; setFasciaAvailable(applyStudyColors(model, exercise, true, focusMode)); scene.add(model); setDetailed(true);
      if (showSurface) void loadSurface(scene, model, scale, center);
    } catch { setError("精细模型加载失败，可继续使用轻量模型。"); }
    finally { setLoading(false); }
  }

  async function loadSurface(scene: THREE.Scene, anchor: THREE.Object3D, scale?: number, center?: THREE.Vector3) {
    const loader = new FBXLoader();
    try {
      const surface = await loadLocalFbx(loader, [REGIONS_FBX]);
      const surfaceBox = new THREE.Box3().setFromObject(surface); const surfaceSize = surfaceBox.getSize(new THREE.Vector3()); const surfaceCenter = center ?? surfaceBox.getCenter(new THREE.Vector3());
      const surfaceScale = scale ?? 4 / Math.max(surfaceSize.x, surfaceSize.y, surfaceSize.z);
      surface.scale.setScalar(surfaceScale); surface.position.copy(surfaceCenter).multiplyScalar(-surfaceScale); surface.position.y += .5; surface.name = "surface-layer";
      surface.traverse((object) => { if (object instanceof THREE.Mesh) object.material = material(0xb6cdc5, .13); });
      scene.add(surface); anchor.userData.surface = surface;
    } catch { setError("外层区域模型加载失败。"); setShowSurface(false); }
  }

  async function toggleSurface() {
    const scene = sceneRef.current; const model = modelRef.current; if (!scene || !model) return;
    const next = !showSurface; setShowSurface(next);
    const existing = model.userData.surface as THREE.Object3D | undefined;
    if (existing) existing.visible = next;
    else if (next && detailed) await loadSurface(scene, model);
  }

  return (
    <div className="h-full min-h-[540px] w-full">
      <div ref={hostRef} className="absolute inset-0" aria-label="可旋转的三维人体肌肉模型" />
      <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-2">
        <button onClick={loadDetailedModel} disabled={loading || detailed} className="viewer-control">
          {loading ? <LoaderCircle className="animate-spin" size={14} /> : <Box size={14} />}
          {detailed ? "Z-Anatomy 已加载" : loading ? `加载中 ${progress || "…"}%` : "加载精细解剖"}
        </button>
        <button
          onClick={() => setFocusMode((current) => current === "muscles" ? "fascia" : "muscles")}
          disabled={!detailed}
          title={detailed ? "在肌肉发力和筋膜结构视图之间切换" : "请先加载精细解剖模型"}
          className="viewer-control"
        >
          <ScanLine size={14} />{focusMode === "fascia" ? "返回肌肉发力" : "观察筋膜结构"}
        </button>
        <button onClick={toggleSurface} className="viewer-control"><Layers size={14} />{showSurface ? "隐藏外层" : "显示外层"}</button>
      </div>
      <div className="pointer-events-none absolute left-5 top-28 z-10 flex items-center gap-2 text-[11px] text-white/28"><Rotate3D size={14} />拖动旋转 · 滚轮缩放</div>
      {error && <p className="absolute right-4 top-28 z-20 max-w-60 rounded-xl border border-red-300/15 bg-red-950/75 p-3 text-xs text-red-100/70">{error}</p>}
      {focusMode === "fascia" && <p className="pointer-events-none absolute left-5 top-28 z-10 max-w-64 rounded-xl border border-[#8ee8df]/15 bg-[#08110f]/76 p-3 text-[11px] leading-5 text-[#b8f4ee]/70 backdrop-blur-md">{fasciaAvailable ? "筋膜视图显示模型中名称含 fascia、aponeurosis 或 retinaculum 的结构。它用于定位与学习，不代表某个体态问题的确定病因。" : "当前 FBX 未提供可单独定位的筋膜网格名称，已自动保留当前动作肌群视图；筋膜不作为体态问题的确定病因。"}</p>}
      <a href="https://github.com/LluisV/Z-Anatomy" target="_blank" rel="noreferrer" className="absolute bottom-20 left-5 z-10 text-[10px] text-white/20 hover:text-white/45">精细模型：Z-Anatomy / BodyParts3D · CC BY-SA</a>
    </div>
  );
}
