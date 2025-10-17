import React, { useState, useEffect } from 'react';
import { Shield, Target, Code, Award, TrendingUp, BookOpen, ChevronRight, CheckCircle, XCircle, Globe, Sparkles } from 'lucide-react';
import { useTranslation, languages } from './i18n';
import ScenarioQuestion from './components/ScenarioQuestion';
import ApiKeyConfig from './components/ApiKeyConfig';
import { scenarioQuestions, getRandomScenario } from './data/scenarioQuestions';
import { useAIQuestions } from './hooks/useAIQuestions';

// Question bank with adaptive difficulty
const questionBank = {
  'network-security': {
    beginner: [
      {
        id: 'ns1',
        question: 'What does a firewall primarily do?',
        options: [
          'Blocks all internet traffic',
          'Filters network traffic based on security rules',
          'Encrypts all data on a network',
          'Monitors user passwords'
        ],
        correct: 1,
        explanation: 'A firewall filters incoming and outgoing network traffic based on predetermined security rules, acting as a barrier between trusted and untrusted networks.'
      },
      {
        id: 'ns2',
        question: 'Which protocol is used to securely access a remote server?',
        options: ['FTP', 'HTTP', 'SSH', 'SMTP'],
        correct: 2,
        explanation: 'SSH (Secure Shell) provides encrypted communication for remote server access, protecting credentials and data in transit.'
      }
    ],
    intermediate: [
      {
        id: 'ns3',
        question: 'In a DDoS attack, what is the primary goal of the attacker?',
        options: [
          'Steal sensitive data from the server',
          'Overwhelm system resources to make services unavailable',
          'Install malware on user devices',
          'Bypass authentication systems'
        ],
        correct: 1,
        explanation: 'DDoS (Distributed Denial of Service) attacks aim to overwhelm a system with traffic from multiple sources, making legitimate services unavailable to users.'
      },
      {
        id: 'ns4',
        question: 'What is the purpose of network segmentation?',
        options: [
          'To increase internet speed',
          'To isolate different parts of a network and limit breach impact',
          'To reduce hardware costs',
          'To simplify network configuration'
        ],
        correct: 1,
        explanation: 'Network segmentation divides a network into smaller segments to contain security breaches, reduce attack surface, and improve overall security posture.'
      }
    ],
    advanced: [
      {
        id: 'ns5',
        question: 'Which technique would best detect a zero-day exploit in network traffic?',
        options: [
          'Signature-based IDS only',
          'Behavioral analysis and anomaly detection',
          'Static firewall rules',
          'Regular password rotation'
        ],
        correct: 1,
        explanation: 'Behavioral analysis and anomaly detection can identify unusual patterns that may indicate zero-day exploits, which lack known signatures for traditional detection methods.'
      }
    ]
  },
  'secure-coding': {
    beginner: [
      {
        id: 'sc1',
        question: 'What is SQL injection?',
        options: [
          'A method to optimize database queries',
          'An attack that inserts malicious SQL code into application queries',
          'A database backup technique',
          'A way to encrypt SQL databases'
        ],
        correct: 1,
        explanation: 'SQL injection is an attack where malicious SQL statements are inserted into application queries, potentially allowing attackers to view, modify, or delete database data.'
      },
      {
        id: 'sc2',
        question: 'Why should user passwords be hashed rather than encrypted?',
        options: [
          'Hashing is faster than encryption',
          'Hashed passwords are easier to recover',
          'Hashing is one-way, preventing password recovery even if data is breached',
          'Encryption is not supported by modern databases'
        ],
        correct: 2,
        explanation: 'Hashing is a one-way function that cannot be reversed, ensuring that even if the database is compromised, original passwords cannot be recovered.'
      }
    ],
    intermediate: [
      {
        id: 'sc3',
        question: 'What is the OWASP Top 10?',
        options: [
          'A list of the ten best security tools',
          'The ten most critical web application security risks',
          'Ten programming languages ranked by security',
          'A certification program for developers'
        ],
        correct: 1,
        explanation: 'The OWASP Top 10 is a regularly updated list of the most critical security risks facing web applications, serving as a baseline for secure development practices.'
      },
      {
        id: 'sc4',
        question: 'What does input validation primarily prevent?',
        options: [
          'Performance issues',
          'Code injection attacks and malformed data processing',
          'User interface errors',
          'Database connection failures'
        ],
        correct: 1,
        explanation: 'Input validation ensures that only properly formatted data enters the system, preventing injection attacks, buffer overflows, and other malicious input exploitation.'
      }
    ],
    advanced: [
      {
        id: 'sc5',
        question: 'In secure coding, what is the principle of "defense in depth"?',
        options: [
          'Writing extensive code documentation',
          'Implementing multiple layers of security controls',
          'Using only the most secure programming language',
          'Focusing exclusively on perimeter security'
        ],
        correct: 1,
        explanation: 'Defense in depth implements multiple layers of security controls throughout an application, ensuring that if one layer fails, others still provide protection.'
      }
    ]
  },
  'incident-response': {
    beginner: [
      {
        id: 'ir1',
        question: 'What is the first step in incident response?',
        options: [
          'Delete all suspicious files',
          'Identification and detection of the incident',
          'Restore from backup immediately',
          'Notify the media'
        ],
        correct: 1,
        explanation: 'The first step is identifying and detecting that a security incident has occurred, which triggers the incident response process.'
      },
      {
        id: 'ir2',
        question: 'Why is evidence preservation important in incident response?',
        options: [
          'It speeds up system recovery',
          'It enables forensic analysis and potential legal action',
          'It reduces storage costs',
          'It prevents future attacks automatically'
        ],
        correct: 1,
        explanation: 'Preserving evidence maintains the integrity of data for forensic investigation and supports potential legal proceedings or compliance requirements.'
      }
    ],
    intermediate: [
      {
        id: 'ir3',
        question: 'What does "containment" mean in incident response?',
        options: [
          'Deleting all affected systems',
          'Limiting the scope and impact of an incident',
          'Notifying all stakeholders immediately',
          'Creating backup copies of data'
        ],
        correct: 1,
        explanation: 'Containment involves taking action to limit the spread and impact of a security incident while preserving evidence and maintaining business operations where possible.'
      },
      {
        id: 'ir4',
        question: 'What is a runbook in incident response?',
        options: [
          'A financial report of incident costs',
          'A predefined procedure for handling specific incident types',
          'A tool for running automated scans',
          'A log of all security incidents'
        ],
        correct: 1,
        explanation: 'A runbook provides step-by-step procedures for responding to specific types of incidents, ensuring consistent and effective response actions.'
      }
    ],
    advanced: [
      {
        id: 'ir5',
        question: 'In a sophisticated APT attack, what is the most critical factor in detection?',
        options: [
          'Having the latest antivirus software',
          'Monitoring for anomalous behavior over time',
          'Strong password policies',
          'Regular system updates'
        ],
        correct: 1,
        explanation: 'APT (Advanced Persistent Threat) attacks are stealthy and long-term, requiring continuous behavioral monitoring and correlation of indicators over time for detection.'
      }
    ]
  }
};

const domains = [
  {
    id: 'network-security',
    key: 'networkSecurity',
    descKey: 'networkDesc',
    icon: Shield,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'secure-coding',
    key: 'secureCoding',
    descKey: 'secureDesc',
    icon: Code,
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'incident-response',
    key: 'incidentResponse',
    descKey: 'incidentDesc',
    icon: Target,
    color: 'from-red-500 to-red-600',
  }
];

const badgeDefinitions = [
  { name: 'firstAssessment', icon: Award, threshold: 1 },
  { name: 'quickLearner', icon: TrendingUp, threshold: 70 },
  { name: 'securityExpert', icon: Award, threshold: 90 },
];

export default function CyberAssessmentTool() {
  const [lang, setLang] = useState('en');
  const t = useTranslation(lang);
  const [screen, setScreen] = useState('home');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [userLevel, setUserLevel] = useState('beginner');
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [confidenceLevel, setConfidenceLevel] = useState(3);
  const [startTime, setStartTime] = useState(null);
  const [results, setResults] = useState({});
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  
  // AI Questions hook
  const { apiKey, isEnabled: aiEnabled, saveApiKey, fetchAIQuestions, fetchFeedbackAndLearningPath, error: aiError } = useAIQuestions();

  useEffect(() => {
    if (screen === 'assessment' && questions.length > 0) {
      setStartTime(Date.now());
    }
  }, [currentQuestion, screen]);

  useEffect(() => {
    const saved = localStorage.getItem('cyberhubs-progress');
    if (saved) {
      const data = JSON.parse(saved);
      setEarnedBadges(data.badges || []);
      setTotalAssessments(data.total || 0);
    }
  }, []);

  const saveProgress = (badges, total) => {
    localStorage.setItem('cyberhubs-progress', JSON.stringify({ badges, total }));
  };

  const startAssessment = async (domainId) => {
    const domain = questionBank[domainId];
    
    // Mix regular questions with scenario questions
    const beginnerQuestions = domain.beginner.slice(0, 2);
    const intermediateQuestion = domain.intermediate.slice(0, 1);
    
    // Add a scenario question for intermediate level
    const scenarioQuestion = getRandomScenario(domainId, 'intermediate');
    
    let initialQuestions = [
      ...beginnerQuestions,
      ...intermediateQuestion,
      ...(scenarioQuestion ? [scenarioQuestion] : [])
    ];
    
    // Try to add AI-generated questions if enabled
    if (aiEnabled) {
      setLoadingAI(true);
      try {
        const aiQuestions = await fetchAIQuestions(domainId, 'intermediate', 1);
        if (aiQuestions && aiQuestions.length > 0) {
          // Insert AI question after the first beginner question
          initialQuestions = [
            beginnerQuestions[0],
            ...aiQuestions,
            beginnerQuestions[1],
            ...intermediateQuestion,
            ...(scenarioQuestion ? [scenarioQuestion] : [])
          ];
        }
      } catch (error) {
        console.warn('Failed to fetch AI questions, using local questions only', error);
      } finally {
        setLoadingAI(false);
      }
    }
    
    setSelectedDomain(domainId);
    setQuestions(initialQuestions);
    setCurrentQuestion(0);
    setAnswers([]);
    setUserLevel('beginner');
    setScreen('assessment');
    setShowFeedback(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answerIndex) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    const responseTime = (Date.now() - startTime) / 1000;
    const isCorrect = answerIndex === questions[currentQuestion].correct;
    
    const answerData = {
      questionId: questions[currentQuestion].id,
      correct: isCorrect,
      responseTime,
      confidence: confidenceLevel
    };
    
    setAnswers([...answers, answerData]);
    setShowFeedback(true);
    setConfidenceLevel(3); // Reset for next question
    
    // Adaptive logic
    if (isCorrect && responseTime < 10 && userLevel === 'beginner') {
      setTimeout(() => setUserLevel('intermediate'), 1000);
    } else if (isCorrect && responseTime < 8 && userLevel === 'intermediate') {
      setTimeout(() => setUserLevel('advanced'), 1000);
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const recentAnswers = answers.slice(-2);
      const recentCorrect = recentAnswers.filter(a => a.correct).length;
      
      if (recentCorrect >= 2 && currentQuestion < 6) {
        const domain = questionBank[selectedDomain];
        const nextLevel = userLevel === 'beginner' ? 'intermediate' : 'advanced';
        const nextQuestions = domain[nextLevel]?.slice(0, 1) || [];
        
        // Add advanced scenario if performing well
        if (nextLevel === 'advanced') {
          const advancedScenario = getRandomScenario(selectedDomain, 'advanced');
          if (advancedScenario) {
            nextQuestions.push(advancedScenario);
          }
        }
        
        if (nextQuestions.length > 0) {
          setQuestions([...questions, ...nextQuestions]);
          setCurrentQuestion(currentQuestion + 1);
        } else {
          finishAssessment();
        }
      } else {
        finishAssessment();
      }
    }
  };

  const finishAssessment = () => {
    const totalQuestions = answers.length;
    const correctAnswers = answers.filter(a => a.correct).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const avgTime = answers.reduce((sum, a) => sum + a.responseTime, 0) / totalQuestions;
    const avgConfidence = answers.reduce((sum, a) => sum + a.confidence, 0) / totalQuestions;
    
    // Calculate confidence vs accuracy correlation
    const correctWithHighConfidence = answers.filter(a => a.correct && a.confidence >= 4).length;
    const correctWithLowConfidence = answers.filter(a => a.correct && a.confidence <= 2).length;
    const incorrectWithHighConfidence = answers.filter(a => !a.correct && a.confidence >= 4).length;
    const incorrectWithLowConfidence = answers.filter(a => !a.correct && a.confidence <= 2).length;
    
    // Per-question confidence analysis
    const questionConfidenceAnalysis = answers.map((answer, idx) => ({
      questionId: idx + 1,
      correct: answer.correct,
      confidence: answer.confidence,
      responseTime: answer.responseTime
    }));
    
    const finalLevel = score >= 80 ? 'Advanced' : score >= 60 ? 'Intermediate' : 'Beginner';
    
    const domainResults = {
      domain: selectedDomain,
      score,
      correctAnswers,
      totalQuestions,
      avgTime: Math.round(avgTime),
      avgConfidence: Math.round(avgConfidence * 10) / 10,
      level: finalLevel,
      confidenceMetrics: {
        correctWithHighConfidence,
        correctWithLowConfidence,
        incorrectWithHighConfidence,
        incorrectWithLowConfidence
      },
      questionConfidenceAnalysis
    };
    
    setResults(domainResults);
    const newTotal = totalAssessments + 1;
    setTotalAssessments(newTotal);
    
    // Check badges
    const newBadges = [...earnedBadges];
    if (totalAssessments === 0 && !newBadges.some(b => b.id === 'firstAssessment')) {
      newBadges.push({ id: 'firstAssessment', name: 'First Assessment' });
    }
    if (score >= 70 && !newBadges.some(b => b.id === 'quickLearner')) {
      newBadges.push({ id: 'quickLearner', name: 'Quick Learner' });
    }
    if (score >= 90 && !newBadges.some(b => b.id === 'securityExpert')) {
      newBadges.push({ id: 'securityExpert', name: 'Security Expert' });
    }
    
    setEarnedBadges(newBadges);
    saveProgress(newBadges, newTotal);
    setScreen('results');
  };

  const getLearningPath = () => {
    const score = results.score;
    const domain = domains.find(d => d.id === selectedDomain);
    const domainName = t[domain.key];
    
    if (score >= 80) {
      return {
        titleKey: 'advancedSpec',
        recommendations: [
          `Advanced ${domainName} certification (e.g., OSCP, CEH)`,
          'Capture The Flag (CTF) competitions',
          'Contribute to open-source security projects',
          'Mentor junior professionals in your area'
        ]
      };
    } else if (score >= 60) {
      return {
        titleKey: 'skillEnhance',
        recommendations: [
          `Intermediate ${domainName} online courses`,
          'Hands-on labs and practice environments',
          'Join CyberHubs community workshops',
          'Read industry whitepapers and case studies'
        ]
      };
    } else {
      return {
        titleKey: 'foundationBuild',
        recommendations: [
          `${domainName} fundamentals course`,
          'Interactive tutorials and guided exercises',
          'Study NIST and ENISA frameworks',
          'Connect with study groups in your country'
        ]
      };
    }
  };

  // Home Screen
  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Language Selector */}
          <div className="absolute top-4 right-4">
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 flex items-center gap-2"
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-12 h-12 text-cyan-400" />
              <h1 className="text-4xl font-bold text-white">{t.title}</h1>
            </div>
            <p className="text-slate-300 text-lg">{t.subtitle}</p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                {earnedBadges.length} {t.badgesEarned}
              </span>
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                {totalAssessments} {t.assessmentsCompleted}
              </span>
            </div>
            
            {/* AI Status & Config */}
            <div className="flex items-center justify-center gap-4 mt-6">
              {aiEnabled ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 rounded-lg">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 text-sm font-medium">AI Questions Enabled</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowApiConfig(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition"
                >
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300 text-sm">Enable AI Questions</span>
                </button>
              )}
              {aiEnabled && (
                <button
                  onClick={() => setShowApiConfig(true)}
                  className="text-slate-400 hover:text-slate-300 text-sm underline"
                >
                  Configure
                </button>
              )}
            </div>
          </div>

          {/* Domain Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {domains.map((domain) => {
              const Icon = domain.icon;
              return (
                <div
                  key={domain.id}
                  onClick={() => startAssessment(domain.id)}
                  className="bg-slate-800 rounded-xl p-6 cursor-pointer transform transition hover:scale-105 hover:shadow-xl border border-slate-700"
                >
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${domain.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t[domain.key]}</h3>
                  <p className="text-slate-400 text-sm mb-4">{t[domain.descKey]}</p>
                  <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium">
                    {t.startAssessment} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Features */}
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">{t.whyTakeThis}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{t.adaptiveTesting}</h3>
                  <p className="text-slate-400 text-sm">{t.adaptiveDesc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{t.personalizedLearning}</h3>
                  <p className="text-slate-400 text-sm">{t.personalizedDesc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{t.gamifiedExperience}</h3>
                  <p className="text-slate-400 text-sm">{t.gamifiedDesc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{t.euFrameworkAligned}</h3>
                  <p className="text-slate-400 text-sm">{t.euFrameworkDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* API Key Configuration Modal */}
        {showApiConfig && (
          <ApiKeyConfig
            currentKey={apiKey}
            onSave={(key) => {
              saveApiKey(key);
              setShowApiConfig(false);
            }}
            onClose={() => setShowApiConfig(false)}
          />
        )}
      </div>
    );
  }

  // Assessment Screen
  if (screen === 'assessment') {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const isScenario = question.type === 'scenario';
    const isAIGenerated = question.aiGenerated === true;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto py-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <span className="text-slate-300 text-sm">{t.questionOf} {currentQuestion + 1} {t.of} {questions.length}</span>
                {isAIGenerated && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 rounded text-xs text-cyan-400">
                    <Sparkles className="w-3 h-3" />
                    AI Generated
                  </span>
                )}
              </div>
              <span className="text-cyan-400 text-sm font-medium">{userLevel.toUpperCase()}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card - Scenario or Regular */}
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-6">
            {isScenario ? (
              <ScenarioQuestion
                scenario={question}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={handleAnswer}
                showExplanation={showFeedback}
                isCorrect={selectedAnswer === question.correct}
              />
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-6">{question.question}</h2>
                
                {/* Confidence Level Selector */}
                <div className="mb-8 p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-slate-200">{t.confidenceLevel || 'How confident are you?'}</label>
                    <span className="text-cyan-400 font-bold text-lg">{confidenceLevel}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(Number(e.target.value))}
                    disabled={showFeedback}
                    className="w-full h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>{t.notConfident || 'Not confident'}</span>
                    <span>{t.veryConfident || 'Very confident'}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === question.correct;
                    const showResult = showFeedback;
                    
                    let bgColor = 'bg-slate-700 hover:bg-slate-600';
                    if (showResult) {
                      if (isSelected && isCorrect) bgColor = 'bg-green-600';
                      else if (isSelected && !isCorrect) bgColor = 'bg-red-600';
                      else if (isCorrect) bgColor = 'bg-green-600/50';
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={showFeedback}
                        className={`w-full text-left p-4 rounded-lg ${bgColor} text-white transition flex items-center gap-3`}
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900/50 flex items-center justify-center font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {showResult && isCorrect && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div className="mt-6 p-4 bg-slate-700 rounded-lg">
                    <p className="text-slate-200">{question.explanation}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Next Button */}
          {showFeedback && (
            <button
              onClick={nextQuestion}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 rounded-lg font-bold hover:from-cyan-600 hover:to-purple-600 transition flex items-center justify-center gap-2"
            >
              {currentQuestion < questions.length - 1 ? t.nextQuestion : t.seeResults}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Results Screen
  if (screen === 'results') {
    const domainInfo = domains.find(d => d.id === selectedDomain);
    const learningPath = getLearningPath();
    const Icon = domainInfo.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto py-8">
          {/* Score Card */}
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-6">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${domainInfo.color} flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{t[domainInfo.key]} {t.assessmentComplete}</h1>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-1">{results.score}%</div>
                <div className="text-slate-400 text-sm">{t.overallScore}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">{results.correctAnswers}/{results.totalQuestions}</div>
                <div className="text-slate-400 text-sm">{t.correctAnswers}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-1">{results.avgTime}s</div>
                <div className="text-slate-400 text-sm">{t.avgTime}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-1">{results.level}</div>
                <div className="text-slate-400 text-sm">{t.skillLevel}</div>
              </div>
            </div>

            {/* New Badges */}
            {earnedBadges.length > 0 && (
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  {t.badgesEarnedTitle}
                </h3>
                <div className="flex gap-4 flex-wrap">
                  {earnedBadges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-medium">{t[badge.id] || badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confidence Analytics */}
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              {t.confidenceAnalytics || 'Confidence Analytics'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Confidence Metrics */}
              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">{t.confidenceMetrics || 'Your Confidence'}</h3>
                <div className="text-5xl font-bold text-cyan-400 mb-2">{results.avgConfidence}</div>
                <div className="text-slate-400 text-sm mb-4">{t.outOfFive || 'out of 5.0'}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Avg. Confidence Level:</span>
                    <span className="font-bold text-cyan-400">{results.avgConfidence}/5</span>
                  </div>
                </div>
              </div>

              {/* Confidence vs Accuracy */}
              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">{t.confidenceVsAccuracy || 'Accuracy Breakdown'}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-green-400">✓ {t.correctHighConfidence || 'Correct + High Confidence'}</span>
                    <span className="font-bold">{results.confidenceMetrics.correctWithHighConfidence}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{width: `${(results.confidenceMetrics.correctWithHighConfidence / results.totalQuestions) * 100}%`}} />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-yellow-400">✓ {t.correctLowConfidence || 'Correct + Low Confidence'}</span>
                    <span className="font-bold">{results.confidenceMetrics.correctWithLowConfidence}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{width: `${(results.confidenceMetrics.correctWithLowConfidence / results.totalQuestions) * 100}%`}} />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-red-400">✗ {t.incorrectHighConfidence || 'Incorrect + High Confidence'}</span>
                    <span className="font-bold">{results.confidenceMetrics.incorrectWithHighConfidence}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{width: `${(results.confidenceMetrics.incorrectWithHighConfidence / results.totalQuestions) * 100}%`}} />
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-white font-bold mb-3">{t.insights || 'Key Insights'}</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                {results.confidenceMetrics.correctWithHighConfidence >= results.confidenceMetrics.correctWithLowConfidence ? (
                  <li>✓ {t.insightAccurateConfidence || "Your confidence aligns well with your accuracy. You know what you know!"}</li>
                ) : (
                  <li>📈 {t.insightUnderestimating || "You might be underestimating yourself - you got many correct even with low confidence."}</li>
                )}
                {results.confidenceMetrics.incorrectWithHighConfidence > 0 ? (
                  <li>⚠️ {t.insightOverconfident || `Review the ${results.confidenceMetrics.incorrectWithHighConfidence} questions where you were confident but incorrect.`}</li>
                ) : (
                  <li>✓ {t.insightConfidentAndCorrect || "Great! You weren't overconfident on any incorrect answers."}</li>
                )}
              </ul>
            </div>
          </div>

          {/* Learning Path */}
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-cyan-400" />
              {t.yourLearningPath}
            </h2>
            <p className="text-slate-400 mb-6">{t[learningPath.titleKey]}</p>
            
            <div className="space-y-3">
              {learningPath.recommendations.map((rec, idx) => (
                <div key={idx} className="flex gap-3 p-4 bg-slate-700 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-slate-200">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => setScreen('home')}
              className="flex-1 bg-slate-700 text-white py-4 rounded-lg font-bold hover:bg-slate-600 transition"
            >
              {t.backToHome}
            </button>
            <button
              onClick={() => startAssessment(selectedDomain)}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 rounded-lg font-bold hover:from-cyan-600 hover:to-purple-600 transition"
            >
              {t.retakeAssessment}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
