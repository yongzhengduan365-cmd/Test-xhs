import { TestConfig, Question } from './types';

export const TESTS: TestConfig[] = [
  {
    id: 'animal-persona',
    title: '拟兽化人格测试',
    description: '通过40道深度潜意识题目，发现你灵魂深处栖息着哪种野兽。',
    icon: '🦊',
    color: 'bg-orange-100 text-orange-800',
    questionCount: 40
  },
  {
    id: 'mbti-deep',
    title: '深度MBTI人格解析',
    description: '超越表面的16型人格，探索你的认知功能堆栈与心理动力。',
    icon: '🧠',
    color: 'bg-blue-100 text-blue-800',
    questionCount: 40
  },
  {
    id: 'sexual-repression',
    title: '弗洛伊德性压抑测试',
    description: '基于精神分析法，探索本我与超我之间的深层张力。',
    icon: '🔥',
    color: 'bg-red-100 text-red-800',
    questionCount: 40
  },
  {
    id: 'dark-triad',
    title: '暗黑三角人格测试',
    description: '自恋、马基雅维利主义与精神病态倾向的专业评估。',
    icon: '🌑',
    color: 'bg-gray-100 text-gray-800',
    questionCount: 40
  },
  {
    id: 'eq-pro',
    title: '高情商社交雷达',
    description: '精准评估你的情绪感知力、共情能力与社交掌控力。',
    icon: '💖',
    color: 'bg-pink-100 text-pink-800',
    questionCount: 40
  },
  {
    id: 'career-aptitude',
    title: '职业天赋潜能测试',
    description: '挖掘你未被发现的职业天赋，找到真正属于你的赛道。',
    icon: '💼',
    color: 'bg-emerald-100 text-emerald-800',
    questionCount: 40
  },
  {
    id: 'love-attachment',
    title: '亲密关系依恋类型',
    description: '焦虑型？回避型？探索你在爱情中的核心依恋模式。',
    icon: '🔗',
    color: 'bg-rose-100 text-rose-800',
    questionCount: 40
  },
  {
    id: 'social-battery',
    title: '社交能量与边界测试',
    description: '你的社交电池容量是多少？通过测试了解你的社交边界。',
    icon: '🔋',
    color: 'bg-green-100 text-green-800',
    questionCount: 40
  },
  {
    id: 'hidden-trauma',
    title: '隐性创伤疗愈指引',
    description: '温柔地探索童年阴影，开启自我疗愈的第一步。',
    icon: '🩹',
    color: 'bg-purple-100 text-purple-800',
    questionCount: 40
  },
  {
    id: 'spirit-color',
    title: '灵魂光谱颜色测试',
    description: '如果灵魂有颜色，你的是什么？探索你的精神底色。',
    icon: '🌈',
    color: 'bg-indigo-100 text-indigo-800',
    questionCount: 40
  },
  {
    id: 'left-right-brain',
    title: '左右脑优势偏侧性',
    description: '理性逻辑还是感性直觉？测测你的大脑底层运作模式。',
    icon: '⚖️',
    color: 'bg-yellow-100 text-yellow-800',
    questionCount: 40
  },
  {
    id: 'loneliness-scale',
    title: 'UCLA孤独感量表(Pro)',
    description: '在这个喧嚣的世界里，精准度量你内心的孤独等级。',
    icon: '🌊',
    color: 'bg-cyan-100 text-cyan-800',
    questionCount: 40
  }
];

const BASE_QUESTIONS = [
  "在热闹的社交场合中，我经常感到精力被消耗而不是被补充。",
  "做决定时，我更倾向于依赖客观数据而非个人直觉。",
  "我经常担心别人如何看待我的行为举止。",
  "为了达成目标，有时候必须打破常规或规则。",
  "我很容易察觉到房间里其他人未表达的情绪。",
  "在压力下，我倾向于退缩独处而不是寻求他人帮助。",
  "我经常感到在这个世界上，没有人真正理解我。",
  "我喜欢提前计划好所有细节，突发状况会让我焦虑。",
  "看到别人受苦，我会感同身受，甚至生理上感到不适。",
  "由于害怕被拒绝，我常常不敢表达真实的自我。",
  "我认为这是一个弱肉强食的世界，胜者为王。",
  "我经常反思自己过去的行为，并感到后悔或羞愧。",
  "在艺术或抽象概念面前，我能感受到强烈的共鸣。",
  "我更看重事情的逻辑正确性，而不是是否伤及他人感情。",
  "为了维护和谐，我经常隐藏自己的真实观点。",
  "我经常做白日梦，想象完全不同的人生。",
  "我对于权力、地位和声望有着强烈的渴望。",
  "在亲密关系中，我往往需要大量的确认和安全感。",
  "我很难拒绝别人的请求，即使这会让我自己陷入困境。",
  "面对冲突，我通常选择正面迎击而不是回避。",
  "通过观察别人的微表情，我能判断他们是否在撒谎。",
  "即使在人群中，我也经常感到一种深刻的孤独感。",
  "我相信命运或某种更高力量的指引。",
  "我很难长时间集中注意力在一件枯燥的事情上。",
  "当事情没有按计划进行时，我会感到极度的愤怒。",
  "我倾向于通过理性的利弊分析来解决人际纠纷。",
  "我经常感到一种莫名的空虚感，需要填补。",
  "在团队合作中，我更喜欢独自完成任务。",
  "为了保护自己，我会刻意与他人保持情感距离。",
  "通过冒险和寻求刺激，我能感觉到自己活着。",
  "我经常怀疑自己的能力，觉得自己是个冒牌货。",
  "对于复杂的理论或哲学问题，我充满好奇。",
  "我很难原谅那些曾经伤害过我的人。",
  "在需要展示脆弱的时候，我会选择用冷漠来伪装。",
  "我认为大多数人都是自私的，只关心自己的利益。",
  "通过帮助别人，我能获得自我价值感。",
  "我对环境的变化非常敏感，比如光线、声音或气味。",
  "我经常压抑自己的愤怒，直到它爆发。",
  "相比于现实世界，我更喜欢沉浸在虚构的故事中。",
  "回顾人生，我认为我的选择主要受情感而非理智驱动。"
];

export const generateQuestions = (testTitle: string): Question[] => {
  return BASE_QUESTIONS.map((text, index) => ({
    id: index + 1,
    text: text,
    options: [
      { label: "非常不符合", value: 1 },
      { label: "不符合", value: 2 },
      { label: "中立", value: 3 },
      { label: "符合", value: 4 },
      { label: "非常符合", value: 5 }
    ]
  }));
};

// Data structure for Local Analysis
interface TestDefinition {
  dimensions: string[]; // 6 dimension names
  archetypes: string[]; // 6 archetypes corresponding to dominant dimensions
  quotes: string[]; // Pool of quotes
  desc_templates: string[]; // 6 templates corresponding to dominant dimensions
}

export const TEST_DEFINITIONS: Record<string, TestDefinition> = {
  'animal-persona': {
    dimensions: ['野性', '直觉', '忠诚', '独立', '灵性', '统御'],
    archetypes: ['荒原孤狼', '林间灵鹿', '护卫牧羊犬', '雪域独豹', '深海灵鲸', '草原狮王'],
    quotes: [
      '你的灵魂栖息着野性的呼唤，不为世俗所驯服。',
      '直觉是你最强大的武器，指引你穿过迷雾。',
      '忠诚不是枷锁，而是你选择守护的荣耀。',
      '独处是你的力量源泉，在寂静中你最强大。',
      '你像深海一样深邃，承载着古老的智慧。',
      '王者不需要咆哮，你的存在本身就是权威。'
    ],
    desc_templates: [
      '你拥有不羁的灵魂，这种野性让你在人群中显得格格不入，却又充满魅力。',
      '你对周围环境的变化有着惊人的感知力，往往能预判危险与机遇。',
      '你对认定的伙伴和信念有着绝对的坚持，是团队中最值得信赖的后盾。',
      '你习惯独自解决问题，不依赖他人，这让你显得高冷而神秘。',
      '你的精神世界极为丰富，常在哲学与艺术的海洋中遨游。',
      '你天生具有领袖气质，即使不刻意争取，也能自然地成为众人的焦点。'
    ]
  },
  'mbti-deep': {
    dimensions: ['外倾E', '内倾I', '直觉N', '实感S', '思考T', '情感F'],
    archetypes: ['社交指挥官', '深邃哲学家', '未来梦想家', '现实实干家', '逻辑构建师', '共情治愈者'],
    quotes: [
      '世界是你的棋盘，而你执子先行。',
      '在内心的宇宙中，你构建了宏伟的宫殿。',
      '你看到的不是事物的现在，而是它们无限的可能。',
      '脚踏实地，每一步都算数。',
      '真理高于一切，逻辑是唯一的信仰。',
      '你的温柔是这残酷世界的一剂良药。'
    ],
    desc_templates: [
      '你善于调动资源，在群体中总是能迅速找到自己的位置并发挥影响力。',
      '你享受独处的时光，那是你充电和深度思考的必要时刻。',
      '由于直觉功能主导，你总是跳跃性思维，常人难以跟上你的节奏。',
      '你对细节有着惊人的把控力，是混乱中最稳定的锚点。',
      '你客观、冷静，能够剥离情绪干扰，直击问题的本质。',
      '你对他人的情绪变化极其敏感，总是能在第一时间给予抚慰。'
    ]
  },
  'sexual-repression': {
    dimensions: ['本我冲动', '超我控制', '性压抑', '升华力', '防御机制', '内在张力'],
    archetypes: ['原始火种', '禁欲圣徒', '潜渊暗流', '艺术升华者', '铁壁防御者', '矛盾综合体'],
    quotes: [
      '火焰被压抑得越深，爆发时越灿烂。',
      '秩序是你对抗混乱的盾牌。',
      '沉默不是没有声音，而是震耳欲聋的渴望。',
      '你将欲望化作了创造的燃料。',
      '心墙高筑，只为守护最柔软的角落。',
      '在冰与火的交界处，你找到了平衡。'
    ],
    desc_templates: [
      '你内心涌动着原始的生命力，这种力量渴望突破束缚。',
      '强大的道德感和自我要求，让你时刻保持着克制与体面。',
      '通过压抑直接的欲望，你积累了巨大的心理势能。',
      '你成功地将本能冲动转化为了社会认可的成就与创造力。',
      '为了避免受伤，你构建了复杂的心理防御机制。',
      '你时刻处于释放与克制的拉锯战中，这种张力赋予了你独特的深度。'
    ]
  },
  'default': {
    dimensions: ['认知力', '情绪力', '行动力', '意志力', '创造力', '社交力'],
    archetypes: ['全能探索者', '心灵捕手', '破局先锋', '坚毅行者', '灵感缪斯', '社群领袖'],
    quotes: [
      '认知觉醒是你人生的转折点。',
      '情绪不是弱点，而是你的感知雷达。',
      '行动是治愈焦虑的唯一良药。',
      '在逆境中，你的意志比钻石更坚硬。',
      '你不需要寻找灵感，你就是灵感本身。',
      '连接他人，是你天赋的使命。'
    ],
    desc_templates: [
      '你展现出了极高的思维清晰度，能够迅速洞察事物的本质。',
      '你拥有丰富细腻的情感世界，这让你具备了极强的共情能力。',
      '你是一个典型的行动派，想到就做，从不拖泥带水。',
      '你面对困难时的韧性令人惊叹，往往能坚持到最后。',
      '你的思维不受常规束缚，总是能提出意想不到的解决方案。',
      '你在人际交往中游刃有余，能够轻松调动周围的气氛。'
    ]
  }
};