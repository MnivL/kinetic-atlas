import type { Exercise, ExerciseMuscle, MuscleRole } from "@/lib/exercise-data";

export const EXERCISE_CATALOG_URL = "/media/exercises/index.json";

interface CatalogRecord {
  id: string;
  name: string;
  muscle: string;
  bodyPart: string;
  equipment: string;
  category: string;
  secondaryMuscles?: string[];
  instructions?: string[];
  file?: string;
  gifUrl?: string;
}

interface CatalogResponse { count: number; exercises: CatalogRecord[] }

const MUSCLES: Record<string, Omit<ExerciseMuscle, "role" | "activation">> = {
  cardio: { id: "cardio-system", nameZh: "全身肌群", nameEn: "Whole body", meshHints: ["heart", "diaphragm", "erector spinae", "quadriceps", "gluteus"] },
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

// The public catalog is intentionally kept as a local, deterministic translation
// layer: no remote translation service is needed at runtime and the original
// English metadata never has to be shown in the Chinese UI.
const NAME_PHRASES: Array<[string, string]> = [
  ["resistance band", "弹力带"], ["bodyweight", "自重"], ["barbell", "杠铃"], ["dumbbell", "哑铃"], ["kettlebell", "壶铃"], ["medicine ball", "药球"], ["smith", "史密斯"], ["cable", "绳索"], ["lever", "器械"],
  ["hip abduction", "髋外展"], ["hip adduction", "髋内收"], ["abductor", "外展肌"], ["adductor", "内收肌"], ["quadriceps", "股四头肌"], ["hamstring", "腘绳肌"], ["glute", "臀肌"], ["calf", "小腿"], ["biceps", "二头弯举"], ["triceps", "三头肌"], ["deltoid", "三角肌"], ["shoulder", "肩部"], ["chest", "胸部"], ["pectoral", "胸肌"], ["back", "背部"], ["lat", "背阔肌"], ["forearm", "前臂"], ["spine", "脊柱"], ["abs", "腹肌"], ["oblique", "腹斜肌"], ["core", "核心"],
  ["straight leg", "直腿"], ["bent knee", "屈膝"], ["single leg", "单腿"], ["one arm", "单臂"], ["alternating", "交替"], ["assisted", "辅助"], ["weighted", "负重"], ["incline", "上斜"], ["decline", "下斜"], ["seated", "坐姿"], ["standing", "站姿"], ["kneeling", "跪姿"], ["lying", "仰卧"], ["prone", "俯卧"], ["hanging", "悬垂"], ["side lying", "侧卧"],
  ["push up", "俯卧撑"], ["pull up", "引体向上"], ["chin up", "反握引体"], ["sit up", "仰卧起坐"], ["crunch", "卷腹"], ["leg raise", "抬腿"], ["hip raise", "抬髋"], ["plank", "平板支撑"], ["side plank", "侧平板支撑"], ["squat", "深蹲"], ["lunge", "弓步"], ["deadlift", "硬拉"], ["curl", "弯举"], ["press", "推举"], ["row", "划船"], ["fly", "飞鸟"], ["twist", "旋转"], ["side bend", "侧屈"], ["stretch", "拉伸"], ["rotation", "旋转"], ["windmill", "风车"], ["rollerout", "滚轮推出"], ["wheel", "滚轮"], ["bridge", "桥式"], ["raise", "抬举"], ["reach", "伸展"], ["step", "踏步"], ["jump", "跳跃"], ["run", "跑"], ["bike", "单车"], ["air bike", "空中单车"],
  ["with", ""], ["on", ""], ["from", ""], ["to", ""], ["the", ""], ["and", ""], ["male", ""], ["female", ""], ["v2", ""],
];

function translateName(name: string) {
  let value = name.toLowerCase();
  for (const [source, target] of NAME_PHRASES) value = value.replaceAll(source, ` ${target} `);
  value = value.replace(/\s+/g, " ").trim();
  return value && !/[a-z]/i.test(value) ? value : "综合训练动作";
}

function translateInstruction(index: number, record: CatalogRecord) {
  const equipment = EQUIPMENT[record.equipment] ?? "器械";
  if (index === 0) return `调整${equipment}至适合自己的位置并选择合适负荷。`;
  if (index === 1) return "先建立目标肌群张力，再开始动作。";
  if (index === 2) return "保持躯干稳定，以受控节奏完成动作。";
  if (index === 3) return "沿原路径缓慢回到起始位置，控制离心阶段。";
  return "发力时呼气，回程时吸气。";
}

function muscle(slug: string, role: MuscleRole, activation: number): ExerciseMuscle | null {
  const base = MUSCLES[slug];
  return base ? { ...base, role, activation } : null;
}

function toExercise(record: CatalogRecord): Exercise {
  const primary = muscle(record.muscle, "primary", .82) ?? muscle("cardio", "primary", .72)!;
  const muscles = [
    primary,
    ...(record.secondaryMuscles ?? []).slice(0, 4).map((name, index) => muscle(name, index < 2 ? "secondary" : "stabilizer", .58 - index * .07)),
  ].filter((item): item is ExerciseMuscle => Boolean(item));

  return {
    id: `catalog:${record.id}`,
    nameZh: translateName(record.name),
    nameEn: "",
    pattern: PATTERN[record.category] ?? ({ legs: "下肢训练", arms: "上肢训练", back: "背部训练", chest: "胸部训练", shoulders: "肩部训练", waist: "核心训练", full_body: "全身训练" } as Record<string, string>)[record.bodyPart] ?? "综合训练",
    equipment: EQUIPMENT[record.equipment] ?? record.equipment,
    source: "exercise-gifs-db",
    reviewStatus: "catalog",
    gifUrl: record.file ? `/media/exercises/${record.file}` : undefined,
    muscles: muscles.map((item) => ({ ...item, nameEn: "" })),
    phases: ["准备", "发力", "还原"].map((name, index) => ({ name, description: translateInstruction(index, record) })),
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
