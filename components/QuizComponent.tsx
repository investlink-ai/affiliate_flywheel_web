'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { tools, type Tool, type UserType } from '@/lib/data';

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

interface QuizOption {
  id: string;
  label: string;
  description?: string;
  /** Tags that influence recommendations */
  tags: string[];
  /** User type association */
  userType?: UserType;
}

interface QuizResult {
  tool: Tool;
  score: number;
  matchReasons: string[];
}

/** Investment workflow stages – maps to reviewed tools */
const quizQuestions: QuizQuestion[] = [
  {
    id: 'investment-style',
    question: 'What best describes your investment style?',
    options: [
      {
        id: 'passive',
        label: 'Passive / Long-term',
        description: 'Buy and hold, index funds, robo-advisors',
        tags: ['passive', 'portfolio-risk-management', 'Portfolio Management'],
        userType: 'individual_investor',
      },
      {
        id: 'active',
        label: 'Active / Short-term',
        description: 'Day trading, swing trading, frequent rebalancing',
        tags: ['active', 'execution-trading', 'Quantitative Platforms'],
        userType: 'trader',
      },
      {
        id: 'hybrid',
        label: 'Hybrid',
        description: 'Core-satellite: passive core + active satellite',
        tags: ['passive', 'active', 'portfolio-risk-management', 'execution-trading'],
        userType: 'individual_investor',
      },
    ],
  },
  {
    id: 'risk-tolerance',
    question: 'What is your risk tolerance?',
    options: [
      {
        id: 'conservative',
        label: 'Conservative',
        description: 'Capital preservation, low volatility',
        tags: ['conservative', 'portfolio-risk-management', 'Portfolio Management'],
        userType: 'individual_investor',
      },
      {
        id: 'moderate',
        label: 'Moderate',
        description: 'Balanced growth with some volatility',
        tags: ['moderate-risk', 'Portfolio Management', 'AI Investment Signals'],
        userType: 'individual_investor',
      },
      {
        id: 'aggressive',
        label: 'Aggressive',
        description: 'High growth, comfortable with volatility',
        tags: ['aggressive', 'execution-trading', 'Crypto Tools', 'Quantitative Platforms'],
        userType: 'trader',
      },
    ],
  },
  {
    id: 'asset-focus',
    question: 'Where do you focus your investments?',
    options: [
      {
        id: 'stocks-etfs',
        label: 'Stocks & ETFs',
        description: 'Equities, index funds, traditional markets',
        tags: ['stocks-etfs', 'Quantitative Platforms', 'Portfolio Management', 'AI Investment Signals'],
        userType: 'individual_investor',
      },
      {
        id: 'crypto',
        label: 'Crypto',
        description: 'Bitcoin, altcoins, tokenized assets',
        tags: ['crypto', 'Crypto Tools', 'execution-trading'],
        userType: 'trader',
      },
      {
        id: 'multi-asset',
        label: 'Multi-asset',
        description: 'Stocks, options, futures, forex, crypto',
        tags: ['multi-asset', 'Quantitative Platforms', 'data-fundamentals', 'technical-quantitative'],
        userType: 'quantitative_analyst',
      },
      {
        id: 'prediction-markets',
        label: 'Prediction markets',
        description: 'Event-based outcomes, political/sports/finance',
        tags: ['prediction-markets', 'Crypto Tools', 'execution-trading'],
        userType: 'trader',
      },
    ],
  },
  {
    id: 'budget',
    question: "What's your monthly budget for tools?",
    options: [
      {
        id: 'free',
        label: 'Free / Minimal',
        description: 'Free tiers or under $20/mo',
        tags: ['free-tier', 'budget-friendly'],
      },
      {
        id: 'moderate',
        label: '$20–100/month',
        description: 'Willing to invest in quality',
        tags: ['moderate-budget', 'pro-features'],
      },
      {
        id: 'premium',
        label: '$100+/month',
        description: 'Premium features and support',
        tags: ['premium', 'pro-features'],
      },
    ],
  },
  {
    id: 'workflow-stage',
    question: "What's your primary workflow stage right now?",
    options: [
      {
        id: 'idea-research',
        label: 'Idea generation & research',
        description: 'Finding ideas, screening, due diligence',
        tags: ['idea-generation-research', 'data-fundamentals', 'Quantitative Platforms', 'AI Investment Signals'],
        userType: 'financial_advisor',
      },
      {
        id: 'data-fundamentals',
        label: 'Data & fundamentals',
        description: 'Financial data, fundamentals, alternative data',
        tags: ['data-fundamentals', 'technical-quantitative', 'Quantitative Platforms', 'Fintech Infrastructure'],
        userType: 'quantitative_analyst',
      },
      {
        id: 'technical-quant',
        label: 'Technical & quantitative analysis',
        description: 'Charts, backtesting, strategy development',
        tags: ['technical-quantitative', 'Quantitative Platforms', 'AI Investment Signals'],
        userType: 'trader',
      },
      {
        id: 'execution',
        label: 'Execution & trading',
        description: 'Order execution, live trading, APIs',
        tags: ['execution-trading', 'Quantitative Platforms', 'Crypto Tools'],
        userType: 'trader',
      },
      {
        id: 'ai-tools',
        label: 'AI-powered tools',
        description: 'Automation, AI assistants, workflow',
        tags: ['ai-powered-tools', 'AI Investment Signals', 'Fintech Infrastructure'],
        userType: 'fintech_professional',
      },
      {
        id: 'portfolio-risk',
        label: 'Portfolio & risk management',
        description: 'Rebalancing, tax optimization, risk monitoring',
        tags: ['portfolio-risk-management', 'Portfolio Management'],
        userType: 'individual_investor',
      },
    ],
  },
];

/**
 * Tag-based scoring by fit only. A tool may carry a weight for its own category tag but never for
 * another category's tag; nothing here depends on any commercial relationship.
 */
const toolScoring: Record<string, Record<string, number>> = {
  quantconnect: {
    'Quantitative Platforms': 3,
    'idea-generation-research': 3,
    'data-fundamentals': 3,
    'technical-quantitative': 3,
    'execution-trading': 2,
    'multi-asset': 3,
    'active': 3,
    'aggressive': 2,
    'moderate-budget': 2,
    premium: 3,
    'pro-features': 3,
  },
  tradestation: {
    'Quantitative Platforms': 3,
    'execution-trading': 3,
    'technical-quantitative': 2,
    'stocks-etfs': 3,
    'multi-asset': 2,
    'active': 3,
    'aggressive': 2,
    'moderate-budget': 2,
    premium: 3,
    'pro-features': 3,
  },
  notion: {
    'AI Investment Signals': 3,
    'ai-powered-tools': 3,
    'idea-generation-research': 2,
    'budget-friendly': 2,
    'moderate-budget': 2,
    'pro-features': 2,
  },
  tradingview: {
    'AI Investment Signals': 3,
    'technical-quantitative': 3,
    'idea-generation-research': 2,
    'stocks-etfs': 2,
    'budget-friendly': 2,
    'moderate-budget': 3,
    'pro-features': 3,
  },
  alpaca: {
    'Fintech Infrastructure': 3,
    'execution-trading': 3,
    'technical-quantitative': 2,
    'stocks-etfs': 2,
    'budget-friendly': 3,
    'free-tier': 2,
    'pro-features': 2,
  },
  plaid: {
    'Fintech Infrastructure': 3,
    'data-fundamentals': 2,
    'pro-features': 2,
  },
  wealthfront: {
    'Portfolio Management': 3,
    'portfolio-risk-management': 3,
    'passive': 3,
    'conservative': 3,
    'moderate-risk': 2,
    'stocks-etfs': 2,
    'budget-friendly': 3,
    'free-tier': 2,
  },
  betterment: {
    'Portfolio Management': 3,
    'portfolio-risk-management': 3,
    'passive': 3,
    'conservative': 3,
    'moderate-risk': 2,
    'stocks-etfs': 2,
    'budget-friendly': 3,
    'free-tier': 2,
  },
  robinhood: {
    'Portfolio Management': 3,
    'execution-trading': 2,
    'stocks-etfs': 3,
    'crypto': 2,
    'budget-friendly': 3,
    'free-tier': 3,
    'moderate-risk': 2,
  },
};

interface QuizComponentProps {
  /** Custom title */
  title?: string;
  /** Custom description */
  description?: string;
  /** Callback when quiz is completed */
  onComplete?: (results: QuizResult[]) => void;
  /** Additional class names */
  className?: string;
}

export function QuizComponent({
  title = 'Find Your Perfect Investment Tool',
  description = 'Answer 5 quick questions to get personalized recommendations.',
  onComplete,
  className = '',
}: QuizComponentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizQuestions[currentStep];
  const totalSteps = quizQuestions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  /**
   * Calculate tool recommendations based on answers
   */
  const results = useMemo<QuizResult[]>(() => {
    if (!showResults) return [];

    // Collect all tags from answers
    const selectedTags: string[] = [];
    Object.values(answers).forEach((answerId) => {
      quizQuestions.forEach((q) => {
        const option = q.options.find((o) => o.id === answerId);
        if (option) {
          selectedTags.push(...option.tags);
        }
      });
    });

    // Score each tool
    const toolResults: QuizResult[] = tools.map((tool) => {
      const scoring = toolScoring[tool.slug] || {};
      let score = 0;
      const matchReasons: string[] = [];

      // Base score from category match
      if (selectedTags.includes(tool.category)) {
        score += 5;
        matchReasons.push(`Matches your ${tool.category.toLowerCase()} needs`);
      }

      // Score from tag matches
      selectedTags.forEach((tag) => {
        if (scoring[tag]) {
          score += scoring[tag];
        }
      });

      // Add match reasons based on high-scoring tags
      if (scoring['free-tier'] && selectedTags.includes('free-tier')) {
        matchReasons.push('Offers a free tier');
      }
      if (scoring['budget-friendly'] && selectedTags.includes('budget-friendly')) {
        matchReasons.push('Budget-friendly option');
      }
      if (scoring['execution-trading'] && selectedTags.includes('execution-trading')) {
        matchReasons.push('Strong execution & trading');
      }
      if (scoring['portfolio-risk-management'] && selectedTags.includes('portfolio-risk-management')) {
        matchReasons.push('Portfolio & risk management');
      }
      if (scoring['technical-quantitative'] && selectedTags.includes('technical-quantitative')) {
        matchReasons.push('Technical & quantitative analysis');
      }
      if (scoring['ai-powered-tools'] && selectedTags.includes('ai-powered-tools')) {
        matchReasons.push('AI-powered workflow');
      }

      return {
        tool,
        score,
        matchReasons: matchReasons.slice(0, 3), // Limit to top 3 reasons
      };
    });

    // Sort by score descending
    return toolResults.sort((a, b) => b.score - a.score);
  }, [answers, showResults]);

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;
      
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }));

      // Move to next step or show results
      if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setShowResults(true);
        onComplete?.(results);
      }
    },
    [currentQuestion, currentStep, totalSteps, onComplete, results]
  );

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleRestart = useCallback(() => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  }, []);

  // Results view
  const topResult = results[0];
  if (showResults && topResult) {
    const otherResults = results.slice(1, 3);

    return (
      <div 
        className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8 ${className}`}
        role="region"
        aria-label="Quiz results"
      >
        {/* Screen reader announcement for results */}
        <div className="sr-only" aria-live="assertive" aria-atomic="true">
          Quiz complete! Your top recommendation is {topResult.tool.name}, rated {topResult.tool.rating} out of 5.
          {topResult.matchReasons.length > 0 && ` Match reasons: ${topResult.matchReasons.join(', ')}.`}
        </div>
        
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30" aria-hidden="true">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Your Top Recommendation
          </h3>
        </div>

        {/* Top Result */}
        <div className="mt-6 rounded-lg border-2 border-primary-500 bg-primary-50 p-4 dark:bg-primary-900/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {topResult.tool.name}
                </h4>
                <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs font-medium text-white">
                  Best Match
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {topResult.tool.tagline}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {topResult.tool.pricing}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {topResult.tool.rating.toFixed(1)}
              </div>
              <div className="text-xs text-slate-500">rating</div>
            </div>
          </div>

          {topResult.matchReasons.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {topResult.matchReasons.map((reason) => (
                <span
                  key={reason}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                >
                  <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {reason}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <Link
              href={`/reviews/${topResult.tool.slug}`}
              className="btn-primary flex-1 justify-center text-sm"
            >
              Read Full Review
            </Link>
          </div>
        </div>

        {/* Other Results */}
        {otherResults.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Also Consider
            </h4>
            <div className="mt-3 space-y-3">
              {otherResults.map((result) => (
                <div
                  key={result.tool.slug}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {result.tool.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {result.tool.pricing}
                    </p>
                  </div>
                  <Link
                    href={`/reviews/${result.tool.slug}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleRestart}
          className="mt-6 w-full rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Take the quiz again"
        >
          Take Quiz Again
        </button>
      </div>
    );
  }

  // Guard for missing question
  if (!currentQuestion) {
    return null;
  }

  // Quiz view
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Question {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-primary-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Quiz progress: ${Math.round(progress)}% complete`}
          />
        </div>
        {/* Screen reader announcement for progress */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Question {currentStep + 1} of {totalSteps}. {Math.round(progress)}% complete.
        </div>
      </div>

      {/* Question */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
          {currentQuestion.question}
        </h4>

        <div className="mt-4 space-y-3" role="radiogroup" aria-label={currentQuestion.question}>
          {currentQuestion.options.map((option) => {
            const isSelected = answers[currentQuestion.id] === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                role="radio"
                aria-checked={isSelected}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {option.label}
                    </p>
                    {option.description && (
                      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        {option.description}
                      </p>
                    )}
                  </div>
                  <div
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      {currentStep > 0 && (
        <button
          onClick={handleBack}
          className="mt-6 flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          aria-label="Go back to previous question"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
      )}
    </div>
  );
}
