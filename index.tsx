import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { TESTS, generateQuestions, TEST_DEFINITIONS } from './constants';
import { TestConfig, Question, AppState, AnalysisResult, ChartDataPoint } from './types';

// Icons
import { ArrowRight, ChevronLeft, RefreshCcw, Home, Share2, Sparkles, Brain, CheckCircle2 } from 'lucide-react';

// --- Components ---

// 1. Radar Chart Component
const RadarChart = ({ data }: { data: ChartDataPoint[] }) => {
  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 40;
  const angleSlice = (Math.PI * 2) / data.length;

  const getCoordinates = (value: number, index: number, max: number) => {
    const angle = index * angleSlice - Math.PI / 2;
    const r = (value / max) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const points = data.map((d, i) => getCoordinates(d.A, i, d.fullMark))
    .map(p => `${p.x},${p.y}`).join(' ');

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <div className="flex justify-center my-6">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid */}
        {gridLevels.map((level, i) => (
          <polygon
            key={i}
            points={data.map((_, idx) => {
              const { x, y } = getCoordinates(level * 100, idx, 100);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(100, i, 100);
          return (
            <g key={i}>
              <line x1={center} y1={center} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />
              <text
                x={x}
                y={y}
                dx={x > center ? 10 : x < center ? -10 : 0}
                dy={y > center ? 15 : y < center ? -10 : 5}
                textAnchor={x > center ? 'start' : x < center ? 'end' : 'middle'}
                className="text-[12px] fill-slate-500 font-medium tracking-wide"
              >
                {d.subject}
              </text>
            </g>
          );
        })}

        {/* Data Area */}
        <polygon points={points} fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2" />
        
        {/* Data Points */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(d.A, i, d.fullMark);
          return <circle key={i} cx={x} cy={y} r="3" fill="#6366f1" />;
        })}
      </svg>
    </div>
  );
};

// 2. Loading / Analyzing Component
const AnalyzingView = () => (
  <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 text-center">
    <div className="relative w-24 h-24 mb-8">
      <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping"></div>
      <div className="absolute inset-0 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
      <Brain className="absolute inset-0 m-auto text-indigo-600 w-10 h-10 animate-pulse" />
    </div>
    <h2 className="text-2xl font-bold text-slate-800 mb-2">正在生成分析报告...</h2>
    <p className="text-slate-500 max-w-xs mx-auto animate-pulse">系统正在计算六维人格模型，请勿关闭页面。</p>
  </div>
);

// --- Utils ---

// Local Analysis Generation Logic
const generateLocalAnalysis = (testId: string, answers: Record<number, number>): AnalysisResult => {
  const definition = TEST_DEFINITIONS[testId] || TEST_DEFINITIONS['default'];
  
  // 1. Calculate Dimension Scores
  // We map the 40 questions to 6 dimensions using modulo arithmetic
  const scores = [0, 0, 0, 0, 0, 0];
  const counts = [0, 0, 0, 0, 0, 0];
  
  Object.entries(answers).forEach(([qId, value]) => {
    const dimIndex = (parseInt(qId) - 1) % 6;
    scores[dimIndex] += value;
    counts[dimIndex] += 1;
  });

  // Normalize scores to 0-100
  const normalizedScores = scores.map((score, i) => {
    const maxPossible = counts[i] * 5;
    return Math.round((score / maxPossible) * 100);
  });

  // 2. Find Dominant Archetype
  const maxScoreIndex = normalizedScores.indexOf(Math.max(...normalizedScores));
  const archetype = definition.archetypes[maxScoreIndex] || definition.archetypes[0];

  // 3. Generate Radar Chart Data
  const radarChart: ChartDataPoint[] = definition.dimensions.map((dim, i) => ({
    subject: dim,
    A: normalizedScores[i],
    fullMark: 100
  }));

  // 4. Generate Traits (Pseudo-random based on scores)
  // Pick traits based on the top 3 scoring dimensions
  const sortedIndices = normalizedScores
    .map((s, i) => ({ s, i }))
    .sort((a, b) => b.s - a.s)
    .map(obj => obj.i);
  
  const personalityTraits = [
    definition.dimensions[sortedIndices[0]] + "型",
    definition.dimensions[sortedIndices[1]] + "主导",
    "高" + definition.dimensions[sortedIndices[2]],
    normalizedScores[sortedIndices[5]] < 50 ? "低" + definition.dimensions[sortedIndices[5]] : "均衡发展"
  ];

  // 5. Generate Text Content
  // We simulate detailed analysis by combining template strings based on the dominant trait
  const detailedAnalysis = `
### 核心性格底色
你展现出了强烈的**${archetype}**特质。在${definition.dimensions[maxScoreIndex]}维度上的显著表现，意味着你拥有独特的感知世界的方式。${definition.desc_templates[maxScoreIndex]}

### 潜意识中的隐性优势
你的${definition.dimensions[sortedIndices[1]]}与${definition.dimensions[sortedIndices[0]]}形成了完美的互补。这种组合使你在面对复杂局面时，往往能比旁人更快地找到平衡点。你内在潜藏着一种不被轻易察觉的韧性，这通常来源于你对自我价值的深层坚持。

### 需要警惕的盲点与阴影
由于${definition.dimensions[sortedIndices[5]]}相对较弱，你可能在某些特定情境下会感到能量受阻。建议在日常生活中有意识地觉察自己的回避倾向，与其对抗不如尝试接纳，这将是你近期成长的关键突破口。
  `.trim();

  // 6. Generate Life Aspects
  const lifeAspects = {
    work: `以你的${archetype}特质，在工作中你更适合能够发挥${definition.dimensions[maxScoreIndex]}的角色。建议寻找能够提供自主空间的环境，避免过于机械化的重复劳动消耗你的灵性。`,
    love: `在亲密关系中，你渴望的是深度的共鸣而非表面的陪伴。你的${definition.dimensions[sortedIndices[0]]}特质既是吸引力也是双刃剑，试着向伴侣展示你${definition.dimensions[sortedIndices[5]]}的一面，会带来意想不到的亲密感。`,
    social: `社交对你而言是能量的交换。作为${archetype}，你不需要取悦所有人。保持你的${definition.dimensions[sortedIndices[1]]}，真正的同频者自会被你吸引。`,
    growth: `当下的成长课题是平衡你的${definition.dimensions[maxScoreIndex]}与${definition.dimensions[sortedIndices[5]]}。尝试去做一些平时不擅长的小事，打破惯性，你将发现一个更广阔的自己。`
  };

  return {
    mainArchetype: archetype,
    shortQuote: definition.quotes[maxScoreIndex % definition.quotes.length],
    detailedAnalysis,
    personalityTraits,
    radarChart,
    lifeAspects
  };
};


// --- Main App Component ---

const App = () => {
  const [view, setView] = useState<AppState>(AppState.HOME);
  const [selectedTest, setSelectedTest] = useState<TestConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startTest = (test: TestConfig) => {
    const qs = generateQuestions(test.title);
    setQuestions(qs);
    setSelectedTest(test);
    setView(AppState.TESTING);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setError(null);
    window.scrollTo(0, 0);
  };

  const handleAnswer = (value: number) => {
    const q = questions[currentQuestionIndex];
    if (!q) return; 

    setAnswers(prev => ({ ...prev, [q.id]: value }));
    
    // Auto advance
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        const nextElement = document.getElementById(`q-${currentQuestionIndex + 1}`);
        if(nextElement) nextElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        finishTest();
      }
    }, 250);
  };

  const finishTest = async () => {
    setView(AppState.ANALYZING);
    
    // Simulate network delay for better UX (makes it feel like "analyzing")
    setTimeout(() => {
      try {
        if (!selectedTest) throw new Error("No test selected");
        
        const analysisData = generateLocalAnalysis(selectedTest.id, answers);
        
        setResult(analysisData);
        setView(AppState.RESULT);
      } catch (err) {
        console.error(err);
        setError("分析生成失败，请重试。");
        setView(AppState.HOME);
      }
    }, 2000);
  };

  const handleShare = async () => {
    if (!selectedTest || !result) return;

    const text = `我在灵镜 SoulMirror 的【${selectedTest.title}】中测出了：${result.mainArchetype}\n"${result.shortQuote}"\n\n快来测测你的灵魂原型吧！`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '灵镜 SoulMirror - 专业心理测评',
          text: text,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        alert('结果已复制到剪贴板，快去分享吧！');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // --- Render Views ---

  if (view === AppState.HOME) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                灵镜 SoulMirror
              </h1>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-full text-slate-500">
              专业测评
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <div className="bg-indigo-600 text-white px-6 py-12 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">探索未知的自己</h2>
            <p className="text-indigo-100 mb-0 max-w-lg mx-auto">
              包含MBTI、拟兽化、心理动力学等12项专业深度测评，本地算法驱动的万字解析，带你看清灵魂的模样。
            </p>
          </div>
        </div>

        {/* Grid */}
        <main className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {TESTS.map(test => (
            <div 
              key={test.id}
              onClick={() => startTest(test)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all cursor-pointer group flex items-start gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${test.color}`}>
                {test.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                  {test.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                  {test.description}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {test.questionCount}题
                  </span>
                  <span>•</span>
                  <span>约10分钟</span>
                </div>
              </div>
              <div className="self-center">
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  if (view === AppState.TESTING && selectedTest) {
    if (!questions || questions.length === 0 || !questions[currentQuestionIndex]) {
      return (
         <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
         </div>
      );
    }

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const currentQ = questions[currentQuestionIndex];

    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Header */}
        <div className="sticky top-0 bg-white z-20 px-6 py-4 border-b border-slate-100">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setView(AppState.HOME)} className="text-slate-400 hover:text-slate-600">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-sm font-semibold text-slate-600">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
              <div className="w-6"></div> 
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto px-6 py-10 w-full">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold mb-6 w-fit">
            {selectedTest.title}
          </span>
          
          <h2 className="text-2xl font-bold text-slate-800 leading-normal mb-12 min-h-[120px]">
            {currentQ.text}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value as number)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between group
                  ${answers[currentQ.id] === opt.value 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium' 
                    : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'
                  }`}
              >
                <span>{opt.label}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${answers[currentQ.id] === opt.value 
                    ? 'border-indigo-500' 
                    : 'border-slate-300 group-hover:border-indigo-300'
                  }`}>
                  {answers[currentQ.id] === opt.value && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === AppState.ANALYZING) {
    return <AnalyzingView />;
  }

  if (view === AppState.RESULT && result && selectedTest) {
    return (
      <div className="min-h-screen bg-slate-50 animate-fade-in">
        <div className="bg-indigo-900 text-white pb-20 pt-10 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 opacity-20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-3xl mx-auto relative z-10 text-center">
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium mb-4 border border-white/20">
              {selectedTest.title} • 测试报告
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
              {result.mainArchetype}
            </h1>
            <p className="text-indigo-200 text-lg italic font-light opacity-90 max-w-xl mx-auto mb-8">
              "{result.shortQuote}"
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {result.personalityTraits.map((trait, i) => (
                <span key={i} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm">
                  #{trait}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 -mt-16 pb-12 relative z-20 space-y-6">
          
          {/* Chart Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-500" /> 维度分析
            </h3>
            <RadarChart data={result.radarChart} />
          </div>

          {/* Detailed Analysis */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" /> 深度解读
            </h3>
            <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
              {result.detailedAnalysis}
            </div>
          </div>

          {/* Life Aspects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(result.lifeAspects).map(([key, value]) => (
              <div key={key} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h4 className="font-bold text-slate-800 capitalize mb-2 flex items-center gap-2">
                  {key === 'work' && '💼 事业与成就'}
                  {key === 'love' && '❤️ 亲密关系'}
                  {key === 'social' && '👯 社交互动'}
                  {key === 'growth' && '🌱 自我成长'}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">{value}</p>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" /> 分享我的测试结果
            </button>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setView(AppState.HOME);
                  setQuestions([]);
                  setAnswers({});
                }}
                className="flex-1 bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" /> 返回主页
              </button>
              <button 
                onClick={() => startTest(selectedTest)}
                className="flex-1 bg-white border-2 border-indigo-100 text-indigo-600 py-3.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" /> 再测一次
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);