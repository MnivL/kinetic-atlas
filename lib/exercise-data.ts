export type MuscleRole = "primary" | "secondary" | "stabilizer";
export interface ExerciseMuscle { id: string; nameZh: string; nameEn: string; role: MuscleRole; activation: number; meshHints: string[] }
export interface Exercise {
  id: string; nameZh: string; nameEn: string; pattern: string; equipment: string;
  source?: "curated" | "exercise-gifs-db";
  reviewStatus?: "curated" | "catalog";
  gifUrl?: string;
  muscles: ExerciseMuscle[];
  phases: Array<{ name: string; description: string }>;
  cues: string[];
  compensations: Array<{ observation: string; possibleContributors: string[] }>;
  selfChecks: string[];
}
const m = (id: string, nameZh: string, nameEn: string, role: MuscleRole, activation: number, ...meshHints: string[]): ExerciseMuscle => ({ id, nameZh, nameEn, role, activation, meshHints });

const common = {
  squatChecks: ["先做徒手版本，比较是否仍出现相同偏移", "降低重量与动作范围，观察偏移是否随难度变化", "分别测试左右侧活动度与控制"],
  hingeChecks: ["用木棍三点接触练习髋铰链", "减少动作范围并观察能否维持躯干", "空杆侧面录像检查负重是否贴近身体"],
};

export const exercises: Exercise[] = [
  {
    id: "back-squat", nameZh: "杠铃深蹲", nameEn: "Barbell Back Squat", pattern: "深蹲", equipment: "杠铃",
    muscles: [m("quadriceps", "股四头肌", "Quadriceps", "primary", .9, "rectus femoris", "vastus"), m("gluteus-maximus", "臀大肌", "Gluteus maximus", "primary", .84, "gluteus maximus"), m("adductors", "内收肌群", "Hip adductors", "secondary", .58, "adductor"), m("hamstrings", "腘绳肌", "Hamstrings", "secondary", .44, "biceps femoris", "semitendinosus", "semimembranosus"), m("erector-spinae", "竖脊肌", "Erector spinae", "stabilizer", .62, "erector spinae", "multifidus")],
    phases: [{ name: "下蹲", description: "髋、膝同步屈曲，股四头肌与臀肌离心控制下降。" }, { name: "底部转换", description: "躯干与足部维持稳定，不依赖失去张力后的反弹。" }, { name: "起身", description: "伸髋与伸膝共同完成向心发力。" }],
    cues: ["足底三点持续接触地面", "膝盖方向与脚尖大致一致", "胸廓和骨盆保持可控，不追求过度挺腰"],
    compensations: [{ observation: "膝盖明显向内塌", possibleContributors: ["髋部控制不足", "足弓稳定性不足", "负重或深度超出当前能力"] }, { observation: "起身时臀部先抬", possibleContributors: ["股四头肌能力不足", "躯干角度控制欠佳", "杠铃位置与身体比例影响"] }], selfChecks: common.squatChecks,
  },
  {
    id: "deadlift", nameZh: "传统硬拉", nameEn: "Conventional Deadlift", pattern: "髋铰链", equipment: "杠铃",
    muscles: [m("gluteus-maximus", "臀大肌", "Gluteus maximus", "primary", .92, "gluteus maximus"), m("hamstrings", "腘绳肌", "Hamstrings", "primary", .78, "biceps femoris", "semitendinosus", "semimembranosus"), m("erector-spinae", "竖脊肌", "Erector spinae", "stabilizer", .82, "erector spinae", "multifidus"), m("latissimus", "背阔肌", "Latissimus dorsi", "stabilizer", .48, "latissimus dorsi"), m("quadriceps", "股四头肌", "Quadriceps", "secondary", .52, "rectus femoris", "vastus")],
    phases: [{ name: "建立张力", description: "杠铃贴近小腿，背阔肌收紧，躯干形成稳定整体。" }, { name: "离地", description: "脚推地并伸膝，髋部与肩部协调上升。" }, { name: "锁定与还原", description: "完成伸髋后沿腿部受控下降。" }],
    cues: ["杠铃全程靠近身体", "先拉紧杠铃再离地", "锁定来自伸髋，不是向后折腰"],
    compensations: [{ observation: "离地瞬间腰背形态快速变化", possibleContributors: ["起始位不合适", "躯干稳定不足", "重量超过当前控制能力"] }], selfChecks: common.hingeChecks,
  },
  {
    id: "bench-press", nameZh: "杠铃卧推", nameEn: "Barbell Bench Press", pattern: "水平推", equipment: "杠铃",
    muscles: [m("pectoralis-major", "胸大肌", "Pectoralis major", "primary", .94, "pectoralis major"), m("triceps", "肱三头肌", "Triceps brachii", "secondary", .71, "triceps brachii"), m("anterior-deltoid", "三角肌前束", "Anterior deltoid", "secondary", .66, "deltoid"), m("serratus", "前锯肌", "Serratus anterior", "stabilizer", .38, "serratus anterior")],
    phases: [{ name: "下降", description: "肩水平外展与肘屈曲，胸大肌和肱三头肌离心控制。" }, { name: "胸前转换", description: "前臂接近垂直，肩胛保持稳定支撑。" }, { name: "推起", description: "肩水平内收与肘伸展共同完成推举。" }],
    cues: ["肩胛稳定贴住凳面", "手腕位于前臂上方", "选择无痛且可控的下降深度"],
    compensations: [{ observation: "肩膀向耳朵方向耸起", possibleContributors: ["肩胛稳定策略不足", "握距或负重不合适"] }, { observation: "左右杠铃高度不一致", possibleContributors: ["左右力量或控制差异", "握距不对称", "疼痛回避"] }], selfChecks: ["空杆确认握距标记左右一致", "俯卧撑观察左右肩胛运动", "降低重量确认不对称是否仍存在"],
  },
  {
    id: "pull-up", nameZh: "引体向上", nameEn: "Pull-up", pattern: "垂直拉", equipment: "单杠",
    muscles: [m("latissimus", "背阔肌", "Latissimus dorsi", "primary", .92, "latissimus dorsi"), m("biceps", "肱二头肌", "Biceps brachii", "secondary", .68, "biceps brachii"), m("lower-trapezius", "斜方肌下束", "Lower trapezius", "secondary", .55, "trapezius"), m("forearm-flexors", "前臂屈肌群", "Forearm flexors", "stabilizer", .61, "flexor digitorum", "flexor carpi")],
    phases: [{ name: "悬垂准备", description: "握持稳定，胸廓和骨盆保持可控。" }, { name: "向上拉", description: "肩关节内收、伸展并伴随肘屈曲。" }, { name: "受控下降", description: "背阔肌和肘屈肌离心控制回到悬垂。" }],
    cues: ["从肩胛和上臂共同开始动作", "避免用摆动替代拉力", "下降到仍能保持肩部舒适的位置"],
    compensations: [{ observation: "头部前伸抢过横杆", possibleContributors: ["动作范围要求过高", "垂直拉力量不足", "胸椎与肩部控制策略"] }], selfChecks: ["用弹力带辅助后观察轨迹是否改善", "做肩胛引体确认起始段控制", "比较正握与中立握的舒适度"],
  },
  {
    id: "barbell-row", nameZh: "俯身杠铃划船", nameEn: "Bent-over Barbell Row", pattern: "水平拉", equipment: "杠铃",
    muscles: [m("latissimus", "背阔肌", "Latissimus dorsi", "primary", .82, "latissimus dorsi"), m("rhomboids", "菱形肌", "Rhomboids", "primary", .76, "rhomboid"), m("posterior-deltoid", "三角肌后束", "Posterior deltoid", "secondary", .59, "deltoid"), m("biceps", "肱二头肌", "Biceps brachii", "secondary", .61, "biceps brachii"), m("erector-spinae", "竖脊肌", "Erector spinae", "stabilizer", .66, "erector spinae", "multifidus")],
    phases: [{ name: "支撑", description: "髋铰链建立稳定躯干角度。" }, { name: "拉起", description: "肩伸展、肩胛后缩并伴随肘屈曲。" }, { name: "还原", description: "保持躯干稳定并受控伸直手臂。" }],
    cues: ["保持髋铰链而非反复起身", "肘部沿预定方向移动", "在肩部舒适范围内完成肩胛运动"],
    compensations: [{ observation: "每次拉起时躯干大幅摆动", possibleContributors: ["重量过大", "髋与躯干等长能力不足", "动作目标发生变化"] }], selfChecks: ["改用胸托划船排除躯干稳定因素", "降低重量并暂停顶端", "比较不同握距下的轨迹"],
  },
  {
    id: "overhead-press", nameZh: "站姿推举", nameEn: "Standing Overhead Press", pattern: "垂直推", equipment: "杠铃",
    muscles: [m("deltoid", "三角肌", "Deltoid", "primary", .91, "deltoid"), m("triceps", "肱三头肌", "Triceps brachii", "secondary", .73, "triceps brachii"), m("upper-chest", "胸大肌锁骨部", "Clavicular pectoralis", "secondary", .41, "clavicular part of pectoralis"), m("serratus", "前锯肌", "Serratus anterior", "stabilizer", .56, "serratus anterior"), m("abdominals", "腹肌群", "Abdominals", "stabilizer", .52, "rectus abdominis", "oblique")],
    phases: [{ name: "起始", description: "杠铃位于肩前，躯干和下肢建立稳定支撑。" }, { name: "推举", description: "肩屈曲/外展与肘伸展共同将杠铃送过头顶。" }, { name: "锁定与下降", description: "肩胛向上旋转，随后受控返回。" }],
    cues: ["肋骨不要通过大幅外翻换取高度", "杠铃贴近面部向上移动", "顶端保持耳、肩、髋大致堆叠"],
    compensations: [{ observation: "推举时明显后仰", possibleContributors: ["肩屈曲活动度受限", "躯干控制不足", "重量过大"] }], selfChecks: ["仰卧屈肩测试活动范围", "半跪姿单臂推举减少腰椎代偿", "降低重量确认后仰是否改善"],
  },
  {
    id: "split-squat", nameZh: "保加利亚分腿蹲", nameEn: "Bulgarian Split Squat", pattern: "单腿蹲", equipment: "哑铃 / 徒手",
    muscles: [m("quadriceps", "股四头肌", "Quadriceps", "primary", .86, "rectus femoris", "vastus"), m("gluteus-maximus", "臀大肌", "Gluteus maximus", "primary", .79, "gluteus maximus"), m("gluteus-medius", "臀中肌", "Gluteus medius", "stabilizer", .68, "gluteus medius"), m("adductors", "内收肌群", "Hip adductors", "secondary", .45, "adductor")],
    phases: [{ name: "下降", description: "前侧髋膝屈曲，骨盆保持可控。" }, { name: "底部", description: "前脚维持稳定，后腿只提供必要支撑。" }, { name: "起身", description: "以前腿为主完成伸膝和伸髋。" }],
    cues: ["前脚全程稳定压地", "允许躯干按训练目标适度前倾", "保持骨盆不向一侧明显旋转"],
    compensations: [{ observation: "骨盆向支撑腿外侧偏移", possibleContributors: ["单腿稳定能力不足", "站距不合适", "负重过高"] }], selfChecks: common.squatChecks,
  },
  {
    id: "push-up", nameZh: "俯卧撑", nameEn: "Push-up", pattern: "水平推", equipment: "徒手",
    muscles: [m("pectoralis-major", "胸大肌", "Pectoralis major", "primary", .88, "pectoralis major"), m("triceps", "肱三头肌", "Triceps brachii", "secondary", .7, "triceps brachii"), m("anterior-deltoid", "三角肌前束", "Anterior deltoid", "secondary", .58, "deltoid"), m("serratus", "前锯肌", "Serratus anterior", "stabilizer", .63, "serratus anterior"), m("abdominals", "腹肌群", "Abdominals", "stabilizer", .55, "rectus abdominis", "oblique")],
    phases: [{ name: "下降", description: "胸部靠近地面，肩胛自然后缩，躯干保持整体。" }, { name: "推起", description: "肩水平内收与肘伸展，肩胛逐渐前伸。" }, { name: "顶端", description: "在不耸肩的前提下完成肩胛前伸。" }],
    cues: ["头、胸廓、骨盆作为整体移动", "手掌主动压地", "肘部选择肩部舒适的角度"],
    compensations: [{ observation: "腰部下沉", possibleContributors: ["躯干控制不足", "动作难度过高", "呼吸与腹压策略欠佳"] }], selfChecks: ["改为斜板俯卧撑后观察躯干", "平板支撑确认躯干位置", "录像检查左右肩胛是否同步"],
  },
  {
    id: "hip-thrust", nameZh: "杠铃臀推", nameEn: "Barbell Hip Thrust", pattern: "伸髋", equipment: "杠铃",
    muscles: [m("gluteus-maximus", "臀大肌", "Gluteus maximus", "primary", .96, "gluteus maximus"), m("hamstrings", "腘绳肌", "Hamstrings", "secondary", .47, "biceps femoris", "semitendinosus"), m("adductors", "内收肌群", "Hip adductors", "secondary", .38, "adductor magnus"), m("abdominals", "腹肌群", "Abdominals", "stabilizer", .45, "rectus abdominis", "oblique")],
    phases: [{ name: "下降", description: "髋部屈曲，保持胸廓和骨盆可控。" }, { name: "伸髋", description: "臀大肌主导将髋部推向上方。" }, { name: "顶端", description: "达到髋伸展后停止，不通过腰椎后伸继续抬高。" }],
    cues: ["下巴微收并保持视线稳定", "顶端保持肋骨不过度外翻", "小腿在顶端接近垂直"],
    compensations: [{ observation: "顶端腰部明显反弓", possibleContributors: ["把腰椎后伸误当成髋伸展", "负重过大", "骨盆控制欠佳"] }], selfChecks: ["徒手臀桥练习骨盆后倾", "减轻负重并在顶端停顿", "调整脚距观察腘绳肌是否更舒适"],
  },
  {
    id: "lateral-raise", nameZh: "哑铃侧平举", nameEn: "Dumbbell Lateral Raise", pattern: "肩外展", equipment: "哑铃",
    muscles: [m("middle-deltoid", "三角肌中束", "Middle deltoid", "primary", .93, "deltoid"), m("supraspinatus", "冈上肌", "Supraspinatus", "secondary", .51, "supraspinatus"), m("trapezius", "斜方肌", "Trapezius", "stabilizer", .46, "trapezius"), m("serratus", "前锯肌", "Serratus anterior", "stabilizer", .39, "serratus anterior")],
    phases: [{ name: "抬起", description: "肩外展并伴随肩胛向上旋转。" }, { name: "顶端", description: "在肩部舒适范围内短暂停顿。" }, { name: "下降", description: "三角肌离心控制哑铃回到起始位。" }],
    cues: ["手臂在略偏身体前方的肩胛平面抬起", "保持手腕自然", "以可控范围为准，不强求固定高度"],
    compensations: [{ observation: "耸肩并借助身体摆动", possibleContributors: ["重量过大", "三角肌局部疲劳", "对肩胛正常上旋的误解"] }], selfChecks: ["减轻重量并放慢下降", "单臂扶墙减少身体摆动", "比较拇指略向上时的舒适度"],
  },
  {
    id: "plank", nameZh: "前臂平板支撑", nameEn: "Forearm Plank", pattern: "抗伸展", equipment: "徒手",
    muscles: [m("abdominals", "腹直肌", "Rectus abdominis", "primary", .82, "rectus abdominis"), m("obliques", "腹斜肌", "Obliques", "primary", .72, "oblique"), m("gluteus-maximus", "臀大肌", "Gluteus maximus", "stabilizer", .48, "gluteus maximus"), m("serratus", "前锯肌", "Serratus anterior", "stabilizer", .49, "serratus anterior")],
    phases: [{ name: "等长维持", description: "躯干肌群共同抵抗重力引起的腰椎伸展与骨盆旋转。" }],
    cues: ["主动把前臂压向地面", "保持自然呼吸，不屏气硬撑", "在姿势明显失控前结束一组"],
    compensations: [{ observation: "腰部逐渐下沉", possibleContributors: ["持续时间超过当前能力", "腹压策略不足", "肩部支撑疲劳"] }], selfChecks: ["缩短每组时间观察能否稳定", "改为高位平板降低难度", "保持呼吸并检查骨盆控制"],
  },
];
