import { readFile } from "node:fs/promises";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { MUSCLES } from "../lib/external-catalog";

const partPaths = ["public/media/anatomy/MuscularSystem100.fbx.part-001", "public/media/anatomy/MuscularSystem100.fbx.part-002"];
const buffers = await Promise.all(partPaths.map((path) => readFile(path)));
const merged = Buffer.concat(buffers);
const model = new FBXLoader().parse(merged.buffer.slice(merged.byteOffset, merged.byteOffset + merged.byteLength), "");
const names: string[] = [];
model.traverse((object) => { if (object instanceof THREE.Mesh) names.push(object.name); });
const normalize = (value: string) => value.toLowerCase().replace(/[\s_\-.]+/g, " ").replace(/\s+/g, " ").trim();
const normalizedNames = names.map(normalize);
const catalog = JSON.parse(await readFile("public/media/exercises/index.json", "utf8")) as { exercises: Array<{ muscle: string; secondaryMuscles?: string[] }> };
const sourceMuscles = [...new Set(catalog.exercises.flatMap((record) => [record.muscle, ...(record.secondaryMuscles ?? [])]))].sort();
const coverage = sourceMuscles.map((muscle) => {
  const hints = MUSCLES[muscle]?.meshHints ?? [];
  return { muscle, hints, hits: hints.filter((hint) => normalizedNames.some((name) => name.includes(normalize(hint)))) };
});
const omittedSecondary = catalog.exercises.reduce((total, record) => total + Math.max(0, (record.secondaryMuscles?.length ?? 0) - 4), 0);
console.log(JSON.stringify({
  meshCount: names.length,
  sourceMuscles,
  omittedSecondaryBeforeFix: omittedSecondary,
  unmatchedHints: coverage.flatMap((item) => item.hints.filter((hint) => !item.hits.includes(hint)).map((hint) => `${item.muscle}:${hint}`)),
  coverage,
  ...(process.env.AUDIT_VERBOSE === "1" ? { names } : {}),
}, null, 2));
