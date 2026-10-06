import type { Exercise, ExerciseMuscle, MuscleRole } from "@/lib/exercise-data";

export const EXERCISE_CATALOG_URL = "/data/exercises.zh.json";

export interface CatalogRecord {
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

interface LocalCatalogResponse { count: number; language: string; exercises: Exercise[] }

export const MUSCLES: Record<string, Omit<ExerciseMuscle, "role" | "activation">> = {
  cardio: { id: "cardio-system", nameZh: "全身肌群", nameEn: "Whole body", meshHints: ["diaphragm", "rectus femoris", "gluteus", "biceps femoris", "gastrocnemius", "pectoralis"] },
  abductors: { id: "gluteus-medius", nameZh: "髋外展肌群", nameEn: "Hip abductors", meshHints: ["gluteus medius", "gluteus minimus", "tensor fasciae latae"] },
  abs: { id: "abdominals", nameZh: "腹肌群", nameEn: "Abdominals", meshHints: ["rectus abdominis", "external abdominal oblique", "internal abdominal oblique", "transversus abdominis", "pyramidalis", "quadratus lumborum"] },
  adductors: { id: "adductors", nameZh: "髋内收肌群", nameEn: "Hip adductors", meshHints: ["adductor", "gracilis", "pectineus"] },
  biceps: { id: "biceps", nameZh: "肱二头肌", nameEn: "Biceps brachii", meshHints: ["biceps brachii"] },
  calves: { id: "calves", nameZh: "小腿三头肌", nameEn: "Calves", meshHints: ["gastrocnemius", "soleus", "plantaris"] },
  delts: { id: "deltoid", nameZh: "三角肌", nameEn: "Deltoid", meshHints: ["deltoid", "clavicular part of deltoid", "acromial part of deltoid", "scapular spinal part of deltoid"] },
  forearms: { id: "forearm-flexors", nameZh: "前臂肌群", nameEn: "Forearms", meshHints: ["flexor carpi", "extensor carpi", "flexor digitorum", "flexor pollicis", "extensor pollicis", "brachioradialis", "pronator"] },
  glutes: { id: "gluteus-maximus", nameZh: "臀肌群", nameEn: "Gluteals", meshHints: ["gluteus maximus", "gluteus medius", "gluteus minimus", "tensor fasciae latae"] },
  hamstrings: { id: "hamstrings", nameZh: "腘绳肌", nameEn: "Hamstrings", meshHints: ["biceps femoris", "semitendinosus", "semimembranosus"] },
  lats: { id: "latissimus", nameZh: "背阔肌", nameEn: "Latissimus dorsi", meshHints: ["latissimus dorsi"] },
  "levator-scapulae": { id: "trapezius", nameZh: "肩胛提肌", nameEn: "Levator scapulae", meshHints: ["levator scapulae"] },
  pectorals: { id: "pectoralis-major", nameZh: "胸肌群", nameEn: "Pectorals", meshHints: ["pectoralis major", "pectoralis minor", "clavicular head of pectoralis major", "sternocostal head of pectoralis major", "abdominal part of pectoralis major", "subclavius"] },
  quads: { id: "quadriceps", nameZh: "股四头肌", nameEn: "Quadriceps", meshHints: ["rectus femoris", "vastus"] },
  "serratus-anterior": { id: "serratus", nameZh: "前锯肌", nameEn: "Serratus anterior", meshHints: ["serratus anterior"] },
  spine: { id: "erector-spinae", nameZh: "脊柱伸肌群", nameEn: "Spinal extensors", meshHints: ["iliocostalis", "longissimus", "spinalis", "semispinalis", "multifidus", "interspinales", "intertransversarii", "quadratus lumborum"] },
  traps: { id: "trapezius", nameZh: "斜方肌", nameEn: "Trapezius", meshHints: ["trapezius", "descending part of trapezius", "transverse part of trapezius", "ascending part of trapezius"] },
  triceps: { id: "triceps", nameZh: "肱三头肌", nameEn: "Triceps brachii", meshHints: ["triceps brachii"] },
  "upper-back": { id: "rhomboids", nameZh: "上背肌群", nameEn: "Upper back", meshHints: ["rhomboid", "trapezius", "levator scapulae", "teres major"] },
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
  ["side bridge", "侧桥"], ["side hip", "侧髋"], ["straight leg", "直腿"], ["air bike", "空中单车"], ["heel touchers", "触踵"], ["arm slingers", "摆臂"], ["arms overhead", "双臂过顶"], ["knee raise", "抬膝"], ["throw down", "下砸"], ["lateral throw down", "侧向下砸"], ["motion", "动态"], ["rectus femoris", "股直肌"], ["v up", "V字起身"], ["wheel rollerout", "滚轮推出"], ["bicycle", "单车"], ["horizontal", "水平"], ["pallof", "帕洛夫"], ["jack knife", "折刀"], ["bent knee", "屈膝"], ["push sit up", "推举仰卧起坐"], ["vertical pallof", "垂直帕洛夫"], ["side bent", "侧屈"], ["sitted", "坐姿"], ["ab rollerout", "腹肌滚轮推出"], ["bottoms up", "底部向上"], ["mountain climber", "登山者"], ["cross body", "交叉触体"], ["butt ups", "臀部抬升"], ["judo flip", "柔道翻转"], ["reverse crunch", "反向卷腹"], ["russian twists", "俄罗斯转体"], ["stability ball", "瑞士球"], ["bosu ball", "半球"], ["side bend crunch", "侧屈卷腹"], ["standing lift", "站姿提拉"], ["tuck reverse", "收膝反向"], ["twist up down", "上下旋转"], ["captains chair", "船长椅"], ["straight leg raise", "直腿抬高"], ["toe touch", "触趾"], ["hands overhead", "双手过顶"], ["stability ball arms straight", "瑞士球直臂"], ["floor", "地面"], ["curl up", "卷曲起身"], ["dead bug", "死虫式"], ["elbow to knee", "肘触膝"], ["frog crunch", "蛙式卷腹"], ["front lever", "前水平"], ["front plank", "前平板"], ["maltese", "马尔他十字"], ["gorilla chin", "大猩猩引体"], ["groin", "腹股沟"], ["half sit up", "半程仰卧起坐"], ["leg hip raise", "抬腿抬髋"], ["hanging pike", "悬垂折髋"], ["twisting leg hip raise", "旋转抬腿抬髋"], ["inchworm", "毛毛虫"], ["leg straight", "直腿"], ["jackknife", "折刀"], ["janda", "詹达"], ["advanced", "进阶"], ["windmill", "风车"], ["bent press", "屈身推举"], ["figure 8", "八字绕壶"], ["touch crunch", "触膝卷腹"], ["tap shoulder", "点肩"], ["sit on floor", "坐地"], ["landmine", "地雷管"], ["leg pull in", "收腿"], ["chest pad", "胸垫"], ["lying elbow", "仰卧肘"], ["flat bench", "平板凳"], ["negative", "负向"], ["oblique crunches", "腹斜肌卷腹"], ["slam", "砸球"], ["medicine ball", "药球"], ["otis up", "奥蒂斯起身"], ["pelvic tilt", "骨盆倾斜"], ["posterior step", "后撤步"], ["overhead reach", "过顶伸展"], ["potty squat", "便盆深蹲"], ["power point", "力量点"], ["prisoner", "囚徒"], ["pull in", "收腿"], ["to side plank", "转侧平板"], ["quarter", "四分之一程"], ["plank with leg lift", "平板抬腿"], ["body saw", "锯体"], ["seated side crunch", "坐姿侧卷腹"], ["shoulder tap", "点肩"], ["parallel bars", "双杠"], ["arms on chest", "双手抱胸"], ["sledge hammer", "大锤"], ["spell caster", "施法者"], ["full range", "全程"], ["behind head", "脑后"], ["suspended", "悬吊"], ["abdominal fallout", "腹肌悬吊展开"], ["wind sprints", "冲刺跑"], ["side lying", "侧卧"], ["butterfly yoga pose", "蝴蝶式瑜伽"], ["concentration curl", "集中弯举"], ["arm blaster", "手臂固定器"], ["drag curl", "拖拽弯举"], ["preacher", "牧师椅"], ["close grip", "窄握"], ["reverse grip", "反握"], ["wide grip", "宽握"], ["narrow pull ups", "窄握引体"], ["leg concentration", "腿部集中"], ["side lying biceps", "侧卧二头肌"], ["close grip curl", "窄握弯举"], ["hammer", "锤式"], ["rope", "绳索"], ["one arm", "单臂"], ["overhead curl", "过顶弯举"], ["exercise ball", "健身球"], ["pulldown", "下拉"], ["one arm reverse", "单臂反握"], ["reverse preacher", "反向牧师椅"], ["rope hammer", "绳索锤式"], ["incline curl", "上斜弯举"], ["alternating", "交替"], ["standing curl", "站姿弯举"], ["spider", "蜘蛛式"], ["z ottman", "佐特曼"], ["cuban", "古巴"], ["arnold", "阿诺德"], ["military", "军式"], ["upright", "直立"], ["shrug", "耸肩"], ["scapular", "肩胛"], ["retractor", "回缩"], ["external", "外旋"], ["internal", "内旋"], ["rotation", "旋转"], ["flyes", "飞鸟"], ["pullover", "上拉"], ["guillotine", "断头台"], ["svend", "斯文德"], ["floor press", "地板卧推"], ["close", "窄握"], ["dip", "双杠臂屈伸"], ["diamond", "钻石"], ["clap", "击掌"], ["handstand", "倒立"], ["pike", "折髋"], ["planche", "俄式挺身"], ["ring", "吊环"], ["tricep", "肱三头肌"], ["pushdown", "下压"], ["skullcrusher", "仰卧臂屈伸"], ["kickback", "后踢"], ["bench", "凳上"], ["row", "划船"], ["pendlay", "潘德雷"], ["rear", "后束"], ["posterior", "后侧"], ["face pull", "面拉"], ["crossover", "交叉"], ["straight arm", "直臂"], ["lat pulldown", "背阔肌下拉"], ["chin", "引体"], ["deadlift", "硬拉"], ["romanian", "罗马尼亚"], ["stiff", "直腿"], ["good morning", "早安式"], ["sumo", "相扑"], ["zercher", "泽奇尔"], ["goblet", "高脚杯"], ["hack", "哈克"], ["pistol", "手枪式"], ["cossack", "哥萨克"], ["split squat", "分腿蹲"], ["bulgarian", "保加利亚"], ["step up", "登阶"], ["curtsey", "屈膝礼"], ["skater", "滑冰式"], ["sissy", "希西"], ["calf raise", "提踵"], ["tibialis", "胫骨前肌"], ["donkey", "驴式"], ["seated calf", "坐姿提踵"], ["hip thrust", "臀推"], ["glute bridge", "臀桥"], ["kickback", "后踢"], ["abduction", "外展"], ["adduction", "内收"], ["stretch", "拉伸"], ["yoga", "瑜伽"], ["cardio", "心肺"], ["treadmill", "跑步机"], ["elliptical", "椭圆机"], ["stepmill", "登阶机"], ["ergometer", "测功仪"], ["sprint", "冲刺"], ["run", "跑步"], ["walk", "行走"], ["jump", "跳跃"], ["burpee", "波比跳"], ["battle", "战绳"], ["rope", "绳"], ["carry", "行走负重"], ["farmers", "农夫"], ["suitcase", "手提箱"], ["turkish", "土耳其起身"], ["get up", "起身"], ["waiter", "服务员"], ["windmill", "风车"], ["snatch", "抓举"], ["clean", "翻"], ["jerk", "挺举"], ["thruster", "推蹲"], ["swing", "摆荡"], ["high pull", "高翻拉"], ["around", "绕环"], ["figure", "数字"], ["circle", "环绕"], ["walk", "行走"], ["march", "踏步"], ["flutter", "交替摆腿"], ["scissor", "剪刀"], ["wiper", "雨刷"], ["superman", "超人式"], ["cobra", "眼镜蛇式"], ["cat", "猫式"], ["dog", "狗式"], ["bear", "熊爬"], ["crawl", "爬行"], ["inverted", "倒置"], ["reverse", "反向"], ["forward", "向前"], ["backward", "向后"], ["left", "左侧"], ["right", "右侧"], ["upper", "上部"], ["lower", "下部"], ["middle", "中部"], ["inner", "内侧"], ["outer", "外侧"], ["wide", "宽距"], ["narrow", "窄距"], ["single", "单侧"], ["double", "双侧"], ["one", "单"], ["two", "双"], ["three", "三"], ["half", "半程"], ["full", "完整"], ["quarter", "四分之一程"], ["deep", "深度"], ["modified", "改良"], ["basic", "基础"], ["intermediate", "中级"], ["isometric", "等长"], ["dynamic", "动态"], ["stability", "稳定"], ["supported", "支撑"], ["assisted", "辅助"], ["weighted", "负重"], ["resistance", "阻力"], ["band", "弹力带"], ["bar", "杠"], ["barbell", "杠铃"], ["dumbbell", "哑铃"], ["machine", "器械"], ["lever", "器械"], ["cable", "绳索"], ["ez", "曲杆"], ["smith", "史密斯"], ["bodyweight", "自重"], ["ball", "球"], ["bench", "凳"], ["chair", "椅"], ["wall", "墙"], ["floor", "地面"], ["rope", "绳索"], ["handle", "把手"], ["grip", "握法"], ["feet", "双脚"], ["hands", "双手"], ["arm", "手臂"], ["arms", "手臂"], ["leg", "腿"], ["legs", "腿部"], ["knee", "膝"], ["knees", "膝盖"], ["elbow", "肘"], ["shoulder", "肩"], ["neck", "颈部"], ["head", "头部"], ["chest", "胸部"], ["back", "背部"], ["hip", "髋部"], ["ankle", "踝"], ["wrist", "腕"], ["toe", "脚趾"], ["heel", "脚跟"], ["finger", "手指"], ["palm", "手掌"], ["grip", "握法"], ["position", "姿势"], ["stance", "站距"], ["angle", "角度"], ["degrees", "度"], ["range", "幅度"], ["speed", "速度"], ["slow", "慢速"], ["quick", "快速"], ["hold", "保持"], ["pause", "停顿"], ["release", "释放"], ["drop", "下放"], ["up", "向上"], ["down", "向下"], ["overhead", "过顶"], ["behind", "后方"], ["above", "上方"], ["below", "下方"], ["against", "对抗"], ["apart", "分开"], ["together", "合拢"], ["across", "交叉"], ["through", "穿过"], ["into", "进入"], ["off", "离开"], ["out", "向外"], ["in", "向内"], ["plus", "加"], ["variation", "变式"], ["style", "方式"], ["exercise", "训练"], ["workout", "训练"], ["male", ""], ["female", ""], ["the", ""], ["and", ""], ["with", ""], ["on", ""], ["from", ""], ["to", ""], ["of", ""], ["a", ""],
];

const EXTRA_WORDS: Array<[string, string]> = [
  ["side", "侧"], ["alternate", "交替"], ["air", "空中"], ["touchers", "触踵"], ["straight", "直线"], ["lateral", "侧向"], ["russian", "俄罗斯"], ["push", "推"], ["v", "V字"], ["twisting", "旋转"], ["vertical", "垂直"], ["ab", "腹肌"], ["frog", "蛙式"], ["front", "前侧"], ["hanging", "悬垂"], ["bicep", "二头肌"], ["cocoons", "茧式"], ["crab", "螃蟹式"], ["flag", "旗式"], ["flexion", "屈曲"], ["tuck", "收膝"], ["twisted", "旋转"], ["sit", "坐姿"], ["lean", "倾斜"], ["touch", "触碰"], ["tap", "点触"], ["lift", "抬升"], ["raise", "抬高"], ["roller", "滚轮"], ["russian", "俄罗斯"], ["straddle", "分腿"], ["concentration", "集中"], ["drag", "拖拽"], ["squatting", "深蹲"], ["curls", "弯举"], ["raised", "抬高"], ["high", "高位"], ["stork", "鹳式"], ["bowling", "保龄球"], ["supine", "仰卧"], ["neutral", "中立"], ["wrist", "腕部"], ["over", "跨过"], ["pulley", "滑轮"], ["scott", "牧师椅"], ["clasped", "交握"], ["face", "面部"], ["hyperextension", "过伸"], ["dead", "硬拉"], ["stiff", "直腿"], ["morning", "早安式"], ["sumo", "相扑"], ["goblet", "高脚杯"], ["hack", "哈克"], ["pistol", "手枪式"], ["curtsey", "屈膝礼"], ["skater", "滑冰式"], ["sissy", "希西"], ["donkey", "驴式"], ["kick", "踢"], ["treadmill", "跑步机"], ["elliptical", "椭圆机"], ["stepmill", "登阶机"], ["ergometer", "测功仪"], ["suitcase", "手提箱"], ["waiter", "服务员"], ["snatch", "抓举"], ["clean", "翻"], ["jerk", "挺举"], ["thruster", "推蹲"], ["swing", "摆荡"], ["wiper", "雨刷"], ["superman", "超人式"], ["cobra", "眼镜蛇式"], ["cat", "猫式"], ["dog", "狗式"], ["bear", "熊爬"], ["crawl", "爬行"], ["inverted", "倒置"], ["forward", "向前"], ["backward", "向后"], ["left", "左侧"], ["right", "右侧"], ["middle", "中部"], ["inner", "内侧"], ["outer", "外侧"], ["wide", "宽距"], ["narrow", "窄握"], ["single", "单侧"], ["double", "双侧"], ["one", "单"], ["two", "双"], ["three", "三"], ["deep", "深度"], ["modified", "改良"], ["basic", "基础"], ["intermediate", "中级"], ["isometric", "等长"], ["dynamic", "动态"], ["supported", "支撑"], ["resistance", "阻力"], ["handle", "把手"], ["feet", "双脚"], ["knees", "膝盖"], ["neck", "颈部"], ["ankle", "踝"], ["heel", "脚跟"], ["position", "姿势"], ["stance", "站距"], ["angle", "角度"], ["degrees", "度"], ["range", "幅度"], ["speed", "速度"], ["quick", "快速"], ["release", "释放"], ["drop", "下放"], ["down", "向下"], ["above", "上方"], ["against", "对抗"], ["apart", "分开"], ["together", "合拢"], ["across", "交叉"], ["through", "穿过"], ["into", "进入"], ["off", "离开"], ["out", "向外"], ["in", "向内"], ["plus", "加"], ["variation", "变式"], ["style", "方式"], ["workout", "训练"], ["major", "主要"], ["minor", "次要"], ["femoral", "股骨"], ["femoris", "股肌"], ["rectus", "直肌"], ["flexor", "屈肌"], ["peroneals", "腓骨肌"], ["piriformis", "梨状肌"], ["tibialis", "胫骨前肌"], ["sternum", "胸骨"], ["scapula", "肩胛骨"], ["pelvic", "骨盆"], ["attachment", "附件"], ["platform", "平台"], ["rack", "架"], ["cage", "架"], ["strap", "带"], ["ring", "吊环"], ["parallel", "平行"], ["bars", "双杠"], ["180", "180度"], ["360", "360度"],
];

const EXTRA_WORDS_2: Array<[string, string]> = [
  ["all", "全程"], ["angled", "倾斜"], ["ankles", "脚踝"], ["anti", "抗"], ["archer", "弓箭手"], ["astride", "跨立"], ["balance", "平衡"], ["battling", "战绳"], ["benches", "凳子"], ["bends", "屈曲"], ["bent", "屈曲"], ["between", "之间"], ["big", "大幅"], ["board", "板"], ["body", "身体"], ["both", "双侧"], ["box", "箱式"], ["boxing", "拳击"], ["bradford", "布拉德福德"], ["breeding", "展开"], ["calves", "小腿"], ["cambered", "弧形"], ["can", "罐式"], ["catch", "接"], ["circles", "绕环"], ["circular", "环形"], ["climb", "攀爬"], ["clock", "时钟"], ["closer", "更窄"], ["contralateral", "对侧"], ["cross", "交叉"], ["crossovers", "交叉"], ["crunches", "卷腹"], ["crusher", "臂屈伸"], ["cycle", "循环"], ["delt", "三角肌"], ["depresor", "下压"], ["depth", "深度"], ["diagonal", "斜向"], ["dips", "臂屈伸"], ["drive", "驱动"], ["dumbbells", "哑铃"], ["elevated", "抬高"], ["elevator", "提升"], ["equipment", "器械"], ["extended", "伸展"], ["extension", "伸展"], ["facing", "面向"], ["fixed", "固定"], ["flip", "翻转"], ["forth", "往返"], ["fours", "四点支撑"], ["frankenstein", "科学怪人式"], ["french", "法式"], ["gironda", "吉隆达"], ["glutes", "臀肌"], ["gluteus", "臀肌"], ["gravity", "重力"], ["greatest", "最大"], ["gripless", "无握法"], ["gripper", "握力器"], ["ground", "地面"], ["ham", "腘绳肌"], ["hand", "手"], ["hang", "悬垂"], ["hindu", "印度式"], ["hook", "勾拳"], ["hops", "跳步"], ["hug", "抱"], ["hyght", "海特"], ["hyper", "过伸"], ["impossible", "不可能"], ["inside", "内侧"], ["inverse", "反向"], ["iron", "铁十字"], ["jack", "开合"], ["jefferson", "杰斐逊"], ["jm", "JM"], ["jumps", "跳跃"], ["kayak", "皮划艇"], ["keens", "凯恩斯"], ["kickbacks", "后踢"], ["kicks", "踢腿"], ["kipping", "摆动"], ["korean", "韩式"], ["legged", "腿"], ["lifting", "提拉"], ["low", "低位"], ["mixed", "混合"], ["monster", "怪兽"], ["multiple", "多次"], ["muscle", "肌肉"], ["olympic", "奥林匹克"], ["outside", "外侧"], ["outstretched", "伸直"], ["overhand", "正握"], ["pad", "垫"], ["palms", "掌心"], ["pass", "穿越"], ["peacher", "牧师椅"], ["pec", "胸肌"], ["pectoralis", "胸大肌"], ["pin", "销"], ["pirate", "海盗"], ["plyo", "爆发"], ["point", "点"], ["pose", "姿势"], ["potty", "便盆"], ["pov", "视角"], ["power", "力量"], ["presses", "推举"], ["pro", "专业"], ["pyramid", "金字塔"], ["quad", "股四头肌"], ["quads", "股四头肌"], ["raises", "抬举"], ["reclining", "斜躺"], ["renegade", "叛徒式"], ["reps", "次数"], ["response", "响应"], ["revers", "反向"], ["reversed", "反向"], ["rocking", "摇摆"], ["rocky", "摇摆"], ["rollerer", "滚轮"], ["ropes", "绳索"], ["rotary", "旋转"], ["rotate", "旋转"], ["rotational", "旋转"], ["round", "环绕"], ["runners", "跑步"], ["seesaw", "跷跷板"], ["self", "自我"], ["semi", "半程"], ["sequence", "序列"], ["short", "短距"], ["ski", "滑雪"], ["skier", "滑雪"], ["skin", "皮肤"], ["skull", "头颅"], ["sled", "雪橇"], ["slide", "滑动"], ["sphinx", "狮身人面"], ["split", "分腿"], ["squad", "深蹲"], ["squats", "深蹲"], ["squeeze", "挤压"], ["stabilization", "稳定"], ["staircase", "楼梯"], ["stalder", "斯塔尔德"], ["star", "星式"], ["stationary", "固定"], ["stepbox", "踏步箱"], ["stirrups", "脚蹬"], ["straps", "带子"], ["stride", "步幅"], ["supinated", "旋后握"], ["supination", "旋后"], ["supper", "晚餐式"], ["support", "支撑"], ["swimmer", "游泳"], ["sz", "SZ"], ["tate", "泰特"], ["tennis", "网球"], ["thibaudeau", "蒂博多"], ["throw", "投掷"], ["thrusts", "臀推"], ["tire", "轮胎"], ["towel", "毛巾"], ["trainer", "训练器"], ["trap", "斜方肌"], ["twin", "双"], ["under", "下方"], ["underhand", "反握"], ["unilateral", "单侧"], ["ups", "抬升"], ["upward", "向上"], ["walking", "行走"], ["wipers", "雨刷"], ["world", "环绕全身"], ["y", "Y字"], ["zottman", "佐特曼"], ["V字", "V字"], ["V字起身", "V字起身"],
];

const EXTRA_WORDS_3: Array<[string, string]> = [
  ["l", "直角型"], ["v3", "第三版"], ["t", "横竖型"], ["w", "双峰型"], ["pull", "拉"], ["pronation", "旋前"], ["pronate", "旋前握"], ["pronated", "旋前握"], ["y", "分叉型"], ["v", "三角型"], ["pallof", "帕洛夫"], ["jm", "杰姆式"], ["sz", "曲杆式"],
];

function translateName(name: string) {
  let value = name.toLowerCase();
  for (const [source, target] of [...NAME_PHRASES, ...EXTRA_WORDS, ...EXTRA_WORDS_2, ...EXTRA_WORDS_3]) {
    const phrase = source.split(/\s+/).map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s+");
    value = value.replace(new RegExp(`(^|\\s)${phrase}(?=\\s|$)`, "g"), ` ${target} `);
  }
  value = value.replace(/V字|Y字/gi, "三角型").replace(/JM/gi, "杰姆式").replace(/SZ/gi, "曲杆式");
  value = value.replace(/\s+/g, " ").trim();
  return value && !/[a-z]/i.test(value) ? value : "未命名动作";
}

const INSTRUCTION_MUSCLES: Record<string, string> = {
  abductors: "髋外展肌群", adductors: "髋内收肌群", biceps: "肱二头肌", calves: "小腿三头肌", shoulders: "肩部肌群", forearms: "前臂肌群", glutes: "臀肌群", hamstrings: "腘绳肌", lats: "背阔肌", "levator scapulae": "肩胛提肌", chest: "胸肌群", quadriceps: "股四头肌", "serratus anterior": "前锯肌", "lower back": "下背部肌群", traps: "斜方肌", triceps: "肱三头肌", "upper back": "上背部肌群", core: "核心肌群",
};

function translateInstruction(instruction: string, record: CatalogRecord) {
  const text = instruction.toLowerCase();
  const equipment = EQUIPMENT[record.equipment] ?? "器械";
  if (text.startsWith("adjust the machine")) return "调整器械至适合自己的尺寸，并选择合适负荷。";
  if (text.startsWith("anchor the resistance band")) return "固定弹力带，保持起始张力。";
  if (text.startsWith("load the bar")) return "杠铃加载合适重量，建立正确起始姿势。";
  if (text.startsWith("set the pulley")) return "将滑轮调到所需高度并选择合适重量。";
  if (text.startsWith("grab a dumbbell")) return "双手（或按示范单手）握住合适重量的哑铃。";
  if (text.startsWith("grab the kettlebell")) return "握住合适重量的壶铃并建立起始姿势。";
  if (text.startsWith("prepare the equipment")) return `准备${equipment}并建立起始姿势。`;
  if (text.startsWith("set the bar on the smith")) return "将史密斯机横杆调到合适高度。";
  if (text.startsWith("load the ez-bar")) return "给曲杆加载合适重量并稳固握住。";
  if (text.startsWith("pre-engage")) {
    const match = text.match(/pre-engage the (.+?) before/);
    const muscleName = match ? INSTRUCTION_MUSCLES[match[1]] ?? "目标肌群" : "目标肌群";
    return `先收紧${muscleName}，再开始动作。`;
  }
  if (text.includes("stretch position")) {
    const match = text.match(/the (.+?) stretch position/);
    const muscleName = match ? INSTRUCTION_MUSCLES[match[1]] ?? "目标部位" : "目标部位";
    return `进入${muscleName}的拉伸位置，保持动作可控。`;
  }
  if (text.startsWith("perform the movement")) return "以受控节奏完成动作，全程保持良好姿势。";
  if (text.startsWith("return to the starting")) return "缓慢回到起始位置，控制回程的离心阶段。";
  if (text.startsWith("return slowly")) return "缓慢回到起始位置，按需要重复动作。";
  if (text.startsWith("breathe:")) return "发力时呼气，回程时吸气。";
  if (text.startsWith("hold for")) return "保持约20至40秒，并持续深呼吸。";
  if (text.startsWith("perform a brief dip")) return "先做短幅度下沉以积累张力。";
  if (text.startsWith("execute the movement explosively")) return "快速爆发完成动作，并以可控方式落地。";
  if (text.startsWith("land softly")) return "落地时用腿部和核心吸收冲击，再衔接下一次动作。";
  if (text.startsWith("keep a steady pace")) return "保持稳定节奏，并根据自身体能调整速度。";
  if (text.startsWith("engage your core")) return "收紧核心，整个动作过程中保持躯干直立。";
  if (text.startsWith("continue for")) return "按计划完成规定时间或次数。";
  return "保持动作稳定、呼吸顺畅，并在无痛范围内完成。";
}

function buildActionCues(record: CatalogRecord, primary: ExerciseMuscle) {
  const name = record.name.toLowerCase();
  const equipment = EQUIPMENT[record.equipment] ?? "器械";
  const target = primary.nameZh;
  const cues = [`以本地动作动图中的运动轨迹为参考，先建立${target}张力，再开始主要动作。`];

  if (/plank|side bridge/.test(name)) {
    cues.push("保持头部、躯干和骨盆成一条稳定线，主动收紧核心和臀部，避免髋部塌陷或旋转。");
  } else if (/squat|lunge|step|split|leg press|pistol|cossack|hack/.test(name)) {
    cues.push("脚掌保持稳定，膝盖大致朝向脚尖，下降深度以骨盆和躯干仍可控为准。");
  } else if (/deadlift|good morning|hip extension|hip thrust|bridge|pull through|swing/.test(name)) {
    cues.push("先做髋铰链，保持杠铃或负重贴近身体；伸髋完成动作，不用腰椎过度后仰代偿。");
  } else if (/row|pulldown|pull up|chin up|pull-up|chin/.test(name)) {
    cues.push("先下沉并稳定肩胛，再让肘部沿目标方向移动；避免耸肩或用躯干摆动借力。");
  } else if (/press|push|dip|fly|flyes|pushdown|extension/.test(name)) {
    cues.push("保持手腕与前臂对齐，肩胛和肋骨位置稳定；推起时不要用耸肩或锁死关节换取幅度。");
  } else if (/curl|concentration|preacher/.test(name)) {
    cues.push("固定上臂和肘部位置，只在舒适范围内屈伸前臂；回程放慢，避免甩动负重。");
  } else if (/raise|abduction|adduction|shrug|lateral/.test(name)) {
    cues.push("用目标部位带动负重，保持身体不摆动；抬到可控范围即可，避免耸肩抢动作。");
  } else if (/crunch|sit up|leg raise|plank|roll|roller|pallof|twist|rotation/.test(name)) {
    cues.push("保持骨盆和胸廓协调，颈部放松；核心主动维持躯干，不用惯性完成最后一段。");
  } else if (/stretch|yoga|mobility/.test(name)) {
    cues.push("缓慢进入拉伸位置并持续呼吸，只到牵拉感而不是疼痛；不要弹震或强行压入幅度。");
  } else if (/jump|hop|run|sprint|bike|cardio|burpee|climb/.test(name)) {
    cues.push("保持稳定节奏，落地时用髋、膝、踝共同吸收冲击；疲劳后仍应优先保证落地和呼吸控制。");
  } else {
    cues.push(`使用${equipment}时保持躯干稳定、动作连续，先用轻负荷确认完整活动范围。`);
  }

  cues.push("出现锐痛、麻木或明显代偿时停止，降低负荷或缩小幅度后再评估。");
  return cues;
}

function muscle(slug: string, role: MuscleRole, activation: number): ExerciseMuscle | null {
  const base = MUSCLES[slug];
  return base ? { ...base, role, activation } : null;
}

export function toExercise(record: CatalogRecord): Exercise {
  const primary = muscle(record.muscle, "primary", .82) ?? muscle("cardio", "primary", .72)!;
  const muscles = [
    primary,
    ...(record.secondaryMuscles ?? []).map((name, index) => muscle(name, index < 2 ? "secondary" : "stabilizer", Math.max(.28, .58 - index * .07))),
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
    phases: (record.instructions ?? []).map((instruction, index) => ({ name: ["准备", "启动", "执行", "还原", "呼吸"][index] ?? `步骤${index + 1}`, description: translateInstruction(instruction, record) })),
    cues: buildActionCues(record, primary),
    compensations: [{ observation: "动作轨迹与示范明显不同", possibleContributors: ["器械与身体比例差异", "活动度或控制策略差异", "负荷超过当前能力"] }],
    selfChecks: ["降低负荷或改为徒手版本后复查", "从正面与侧面录像比较左右和轨迹", "出现疼痛、麻木或明显无力时停止训练"],
  };
}

export async function loadExerciseCatalog(signal?: AbortSignal): Promise<Exercise[]> {
  const response = await fetch(EXERCISE_CATALOG_URL, { signal });
  if (!response.ok) throw new Error(`catalog request failed: ${response.status}`);
  const data = await response.json() as LocalCatalogResponse;
  if (!Array.isArray(data.exercises)) throw new Error("invalid catalog response");
  if (data.language !== "zh-CN") throw new Error("catalog is not localized");
  return data.exercises;
}
