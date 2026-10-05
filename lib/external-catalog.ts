import type { Exercise, ExerciseMuscle, MuscleRole } from "@/lib/exercise-data";

export const EXERCISE_CATALOG_URL = "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/api/en/exercises.json";

interface CatalogRecord {
  id: string;
  name: string;
  muscle: string;
  bodyPart: string;
  equipment: string;
  category: string;
  secondaryMuscles?: string[];
  instructions?: string[];
  gifUrl?: string;
}

interface CatalogResponse { count: number; exercises: CatalogRecord[] }

const MUSCLES: Record<string, Omit<ExerciseMuscle, "role" | "activation">> = {
  abductors: { id: "gluteus-medius", nameZh: "髋外展肌群", nameEn: "Hip abductors", meshHints: ["gluteus medius", "gluteus minimus", "tensor fasciae latae"] },
  abs: { id: "abdominals", nameZh: "腹肌群", nameEn: "Abdominals", meshHints: ["rectus abdominis", "oblique"] },
  adductors: { id: "adductors", nameZh: "髋内收肌群", nameEn: "Hip adductors", meshHints: ["adductor", "gracilis"] },
  biceps: { id: "biceps", nameZh: "肱二头肌", nameEn: "Biceps brachii", meshHints: ["biceps brachii"] },
  calves: { id: "calves", nameZh: "小腿三头肌", nameEn: "Calves", meshHints: ["gastrocnemius", "soleus"] },
  delts: { id: "deltoid", nameZh: "三角肌", nameEn: "Deltoid", meshHints: ["deltoid"] },
  forearms: { id: "forearm-flexors", nameZh: "前臂肌群", nameEn: "Forearms", meshHints: ["flexor carpi", "extensor carpi", "flexor digitorum"] },
  glutes: { id: "gluteus-maximus", nameZh: "臀肌群", nameEn: "Gluteals", meshHints: ["gluteus maximus", "gluteus medius"] },
  hamstrings: { id: "hamstrings", nameZh: "腘绳肌", nameEn: "Hamstrings", meshHints: ["biceps femoris", "semitendinosus", "semimembranosus"] },
  lats: { id: "latissimus", nameZh: "背阔肌", nameEn: "Latissimus dorsi", meshHints: ["latissimus dorsi"] },
  "levator-scapulae": { id: "trapezius", nameZh: "肩胛提肌", nameEn: "Levator scapulae", meshHints: ["levator scapulae"] },
  pectorals: { id: "pectoralis-major", nameZh: "胸肌群", nameEn: "Pectorals", meshHints: ["pectoralis major", "pectoralis minor"] },
  quads: { id: "quadriceps", nameZh: "股四头肌", nameEn: "Quadriceps", meshHints: ["rectus femoris", "vastus"] },
  "serratus-anterior": { id: "serratus", nameZh: "前锯肌", nameEn: "Serratus anterior", meshHints: ["serratus anterior"] },
  spine: { id: "erector-spinae", nameZh: "脊柱伸肌群", nameEn: "Spinal extensors", meshHints: ["erector spinae", "multifidus"] },
  traps: { id: "trapezius", nameZh: "斜方肌", nameEn: "Trapezius", meshHints: ["trapezius"] },
  triceps: { id: "triceps", nameZh: "肱三头肌", nameEn: "Triceps brachii", meshHints: ["triceps brachii"] },
  "upper-back": { id: "rhomboids", nameZh: "上背肌群", nameEn: "Upper back", meshHints: ["rhomboid", "trapezius"] },
};

const EQUIPMENT: Record<string, string> = {
  barbell: "杠铃", dumbbell: "哑铃", cable: "绳索", machine: "器械", bodyweight: "徒手",
  band: "弹力带", kettlebell: "壶铃", smith: "史密斯机", "ez-bar": "曲杆", lever: "杠杆器械", other: "其他",
};

const PATTERN: Record<string, string> = { strength: "力量训练", stretching: "拉伸", cardio: "心肺", plyometrics: "爆发训练" };

function muscle(slug: string, role: MuscleRole, activation: number): ExerciseMuscle | null {
  const base = MUSCLES[slug];
  return base ? { ...base, role, activation } : null;
}

function toExercise(record: CatalogRecord): Exercise {
  const primary = muscle(record.muscle, "primary", .82) ?? {
    id: `catalog-${record.muscle}`,
    nameZh: `待映射：${record.muscle}`,
    nameEn: record.muscle,
    role: "primary" as const,
    activation: .82,
    meshHints: [],
  };
  const muscles = [
    primary,
    ...(record.secondaryMuscles ?? []).slice(0, 4).map((name, index) => muscle(name, index < 2 ? "secondary" : "stabilizer", .58 - index * .07)),
  ].filter((item): item is ExerciseMuscle => Boolean(item));

  return {
    id: `catalog:${record.id}`,
    nameZh: record.name,
    nameEn: record.name,
    pattern: PATTERN[record.category] ?? record.bodyPart,
    equipment: EQUIPMENT[record.equipment] ?? record.equipment,
    source: "exercise-gifs-db",
    reviewStatus: "catalog",
    gifUrl: record.gifUrl,
    muscles,
    phases: (record.instructions ?? []).slice(0, 5).map((description, index) => ({ name: `步骤 ${index + 1}`, description })),
    cues: ["该条目来自外部目录，肌肉映射为粗粒度分类。", "先用轻负荷确认动作范围与控制。", "GIF 只能帮助观察外形，不能替代个体化评估。"],
    compensations: [{ observation: "动作轨迹与示范明显不同", possibleContributors: ["器械与身体比例差异", "活动度或控制策略差异", "负荷超过当前能力"] }],
    selfChecks: ["降低负荷或改为徒手版本后复查", "从正面与侧面录像比较左右和轨迹", "出现疼痛、麻木或明显无力时停止训练"],
  };
}

export async function loadExerciseCatalog(signal?: AbortSignal): Promise<Exercise[]> {
  const response = await fetch(EXERCISE_CATALOG_URL, { signal });
  if (!response.ok) throw new Error(`catalog request failed: ${response.status}`);
  const data = await response.json() as CatalogResponse;
  if (!Array.isArray(data.exercises)) throw new Error("invalid catalog response");
  return data.exercises.map(toExercise);
}
