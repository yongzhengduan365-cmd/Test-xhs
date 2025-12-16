import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TESTS, generateQuestions, TEST_DEFINITIONS } from './constants';
import { TestConfig, Question, AppState, AnalysisResult, ChartDataPoint } from './types';

// Icons
import { ArrowRight, ChevronLeft, RefreshCcw, Sparkles, Brain, CheckCircle2, Play, Star, Copy } from 'lucide-react';

// --- Components ---

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

const generateLocalAnalysis = (testId: string, answers: Record<number, number>): AnalysisResult => {
  const definition = TEST_DEFINITIONS[testId] || TEST_DEFINITIONS['default'];
  
  const scores = [0, 0, 0, 0, 0, 0];
  const counts = [0, 0, 0, 0, 0, 0];
  
  Object.entries(answers).forEach(([qId, value]) => {
    const dimIndex = (parseInt(qId) - 1) % 6;
    scores[dimIndex] += value;
    counts[dimIndex] += 1;
  });

  const normalizedScores = scores.map((score, i) => {
    const maxPossible = counts[i] * 5;
    return Math.round((score / maxPossible) * 100);
  });

  const maxScoreIndex = normalizedScores.indexOf(Math.max(...normalizedScores));
  const archetype = definition.archetypes[maxScoreIndex] || definition.archetypes[0];

  const radarChart: ChartDataPoint[] = definition.dimensions.map((dim, i) => ({
    subject: dim,
    A: normalizedScores[i],
    fullMark: 100
  }));

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

  const detailedAnalysis = `
### 核心性格底色
你展现出了强烈的**${archetype}**特质。在${definition.dimensions[maxScoreIndex]}维度上的显著表现，意味着你拥有独特的感知世界的方式。${definition.desc_templates[maxScoreIndex]}

### 潜意识中的隐性优势
你的${definition.dimensions[sortedIndices[1]]}与${definition.dimensions[sortedIndices[0]]}形成了完美的互补。这种组合使你在面对复杂局面时，往往能比旁人更快地找到平衡点。你内在潜藏着一种不被轻易察觉的韧性，这通常来源于你对自我价值的深层坚持。

### 需要警惕的盲点与阴影
由于${definition.dimensions[sortedIndices[5]]}相对较弱，你可能在某些特定情境下会感到能量受阻。建议在日常生活中有意识地觉察自己的回避倾向，与其对抗不如尝试接纳，这将是你近期成长的关键突破口。
  `.trim();

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

// --- App ---

const App = () => {
  const [view, setView] = useState<AppState>(AppState.HOME);
  const [selectedTest, setSelectedTest] = useState<TestConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // --- Router Logic ---
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash; // e.g., #/test/animal-persona
      
      if (hash.startsWith('#/test/')) {
        const parts = hash.split('/');
        const testId = parts[2];
        const mode = parts[3]; // 'play'

        const test = TESTS.find(t => t.id === testId);
        if (test) {
          setSelectedTest(test);
          setQuestions(generateQuestions(test.title));
          
          if (mode === 'play') {
             setView(AppState.TESTING);
          } else {
             // 如果在 intro 页面，重置测试状态
             setResult(null);
             setAnswers({});
             setCurrentQuestionIndex(0);
             setView(AppState.INTRO); // 默认为介绍页，无“返回主页”按钮
          }
        }
      } else {
        // Root path - Home Dashboard for Seller
        setView(AppState.HOME);
        setSelectedTest(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Init on load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const startTestFlow = () => {
    if (selectedTest) {
      setCurrentQuestionIndex(0);
      setAnswers({});
      setResult(null);
      window.location.hash = `#/test/${selectedTest.id}/play`;
    }
  };

  const finishTest = () => {
    setView(AppState.ANALYZING);
    setTimeout(() => {
        if (!selectedTest) return;
        const analysisData = generateLocalAnalysis(selectedTest.id, answers);
        setResult(analysisData);
        setView(AppState.RESULT);
    }, 2000);
  };

  const handleAnswer = (value: number) => {
    const q = questions[currentQuestionIndex];
    if (!q) return; 
    setAnswers(prev => ({ ...prev, [q.id]: value }));
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        const nextElement = document.getElementById(`q-${currentQuestionIndex + 1}`);
        if(nextElement) nextElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        finishTest();
      }
    }, 200);
  };

  const copyLink = (e: React.MouseEvent, testId: string) => {
    e.stopPropagation();
    e.preventDefault();
    const url = window.location.origin + window.location.pathname + `#/test/${testId}`;
    navigator.clipboard.writeText(url).then(() => {
      alert(`【${testId}】的购买链接已复制！\n您可以发送给客户了。`);
    });
  };

  // --- Render Views ---

  // 1. Home View (仅供商家使用：商品目录)
  if (view === AppState.HOME) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20 animate-fade-in">
        <header className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm/50 backdrop-blur-md bg-white/90">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                灵镜 SoulMirror
              </h1>
            </div>
            <span className="text-xs font-medium px-3 py-1 bg-amber-100 text-amber-700 rounded-full">商家后台目录</span>
          </div>
        </header>

        <div className="bg-indigo-900 text-white px-6 py-10 mb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">测试产品列表</h2>
            <p className="text-indigo-200 text-sm">
              点击卡片右侧的复制按钮获取独立售卖链接。
              <br/>
              客户通过该链接进入只能访问特定测试，无法跳转其他页面。
            </p>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 grid grid-cols-1 gap-4">
          {TESTS.map(test => (
            <div 
              key={test.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-indigo-500 transition-all relative"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${test.color}`}>
                {test.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-lg truncate">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-400 truncate">
                  ID: {test.id} • {test.questionCount}题
                </p>
              </div>
              
              {/* 复制链接按钮 */}
              <button
                onClick={(e) => copyLink(e, test.id)}
                className="shrink-0 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" /> 复制链接
              </button>
            </div>
          ))}
        </main>
      </div>
    );
  }

  // 2. Intro View (客户看到的：单项测试落地页) - 无返回主页按钮
  if (view === AppState.INTRO && selectedTest) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col animate-slide-up">
        {/* Navigation Bar - 仅显示标题，无返回按钮 */}
        <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 px-6 py-4 flex items-center justify-center border-b border-slate-100">
           <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
             <Sparkles className="w-4 h-4 text-indigo-600"/> 灵镜专业测评
           </span>
        </div>

        <div className="flex-1 flex flex-col items-center p-6 max-w-lg mx-auto w-full">
           <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-lg ${selectedTest.color} mt-8`}>
             {selectedTest.icon}
           </div>
           
           <h1 className="text-2xl font-bold text-slate-900 text-center mb-4">{selectedTest.title}</h1>
           
           <div className="flex gap-4 mb-8 text-sm text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500"/> {selectedTest.questionCount}道精选题</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-orange-500"/> 深度分析</span>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full mb-8">
             <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
               <Sparkles className="w-4 h-4 text-indigo-500"/> 测试简介
             </h3>
             <p className="text-slate-600 leading-relaxed text-sm">
               {selectedTest.description}
               <br/><br/>
               本测试基于专业心理学模型设计，通过潜意识投射与行为分析，为您生成专属的万字性格解析报告。
             </p>
           </div>

           <div className="mt-auto w-full pb-8">
             <button 
               onClick={startTestFlow}
               className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
             >
               <Play className="w-5 h-5 fill-current" /> 开始测试
             </button>
             <p className="text-center text-xs text-slate-400 mt-4">
               测评结果仅供参考 · 保护个人隐私
             </p>
           </div>
        </div>
      </div>
    );
  }

  // 3. Testing View - 仅允许返回介绍页，不允许回主页
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
            <div className="flex items-center justify-between mb-3">
              <button 
                onClick={() => window.location.hash = `#/test/${selectedTest.id}`} 
                className="text-slate-400 hover:text-slate-600"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-sm font-bold text-slate-600 tabular-nums">
                <span className="text-indigo-600 text-lg">{currentQuestionIndex + 1}</span>
                <span className="text-slate-300 mx-1">/</span>
                {questions.length}
              </span>
              <div className="w-6"></div> 
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto px-6 py-10 w-full animate-fade-in">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold mb-6 w-fit">
            {selectedTest.title}
          </span>
          
          <h2 className="text-2xl font-bold text-slate-800 leading-normal mb-12 min-h-[80px]">
            {currentQ.text}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value as number)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between group active:scale-[0.98]
                  ${answers[currentQ.id] === opt.value 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium' 
                    : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'
                  }`}
              >
                <span>{opt.label}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                  ${answers[currentQ.id] === opt.value 
                    ? 'border-indigo-500' 
                    : 'border-slate-200 group-hover:border-indigo-300'
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

  // 4. Analyzing View
  if (view === AppState.ANALYZING) {
    return <AnalyzingView />;
  }

  // 5. Result View - 仅允许分享或重测，无“更多测试”
  if (view === AppState.RESULT && result && selectedTest) {
    return (
      <div className="min-h-screen bg-slate-50 animate-fade-in">
        <div className="bg-indigo-900 text-white pb-24 pt-10 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 opacity-20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-3xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium mb-6 border border-white/20">
               <Sparkles className="w-3 h-3" />
               {selectedTest.title} · 专属报告
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
              {result.mainArchetype}
            </h1>
            <p className="text-indigo-200 text-lg italic font-light opacity-90 max-w-xl mx-auto mb-8">
              "{result.shortQuote}"
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {result.personalityTraits.map((trait, i) => (
                <span key={i} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm">
                  #{trait}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 -mt-20 pb-12 relative z-20 space-y-6">
          
          {/* Chart Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-900/5">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2 border-b border-slate-50 pb-3">
              <Brain className="w-5 h-5 text-indigo-500" /> 维度分析
            </h3>
            <RadarChart data={result.radarChart} />
          </div>

          {/* Detailed Analysis */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-900/5">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
              <Sparkles className="w-5 h-5 text-indigo-500" /> 深度解读
            </h3>
            <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
              {result.detailedAnalysis}
            </div>
          </div>

          {/* Life Aspects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(result.lifeAspects).map(([key, value]) => (
              <div key={key} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-indigo-50 transition-colors">
                <h4 className="font-bold text-slate-800 capitalize mb-3 flex items-center gap-2 text-sm">
                  {key === 'work' && <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">💼</span>}
                  {key === 'love' && <span className="w-6 h-6 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center text-xs">❤️</span>}
                  {key === 'social' && <span className="w-6 h-6 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-xs">👯</span>}
                  {key === 'growth' && <span className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs">🌱</span>}
                  
                  {key === 'work' && '事业与成就'}
                  {key === 'love' && '亲密关系'}
                  {key === 'social' && '社交互动'}
                  {key === 'growth' && '自我成长'}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed text-justify">{value}</p>
              </div>
            ))}
          </div>

          {/* Action Footer - Only Retest */}
          <div className="flex flex-col gap-3 mt-8">
            <button 
              onClick={startTestFlow}
              className="w-full bg-white border-2 border-indigo-100 text-indigo-600 py-3.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
              <RefreshCcw className="w-5 h-5" /> 再测一次
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);