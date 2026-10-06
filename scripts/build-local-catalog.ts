import { mkdir, readFile, writeFile } from "node:fs/promises";
import { toExercise, type CatalogRecord } from "../lib/external-catalog";

const sourcePath = new URL("../public/media/exercises/index.json", import.meta.url);
const targetPath = new URL("../data/exercises.zh.json", import.meta.url);
const publicTargetPath = new URL("../public/data/exercises.zh.json", import.meta.url);
const source = JSON.parse(await readFile(sourcePath, "utf8")) as { count: number; exercises: CatalogRecord[] };
const exercises = source.exercises.map(toExercise);

const output = JSON.stringify({
  version: 1,
  language: "zh-CN",
  source: "ExerciseGymGifsDB v1.1.0 · local snapshot",
  count: exercises.length,
  exercises,
}, null, 2) + "\n";
await mkdir(new URL("../public/data/", import.meta.url), { recursive: true });
await writeFile(targetPath, output, "utf8");
await writeFile(publicTargetPath, output, "utf8");

console.log(`Wrote ${exercises.length} localized exercises to ${targetPath.pathname}`);
