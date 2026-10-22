import type { QuizQuestion } from './quiz-scoring';

/**
 * The quiz shown on the site. Every option must be able to match at least one
 * reviewed tool (tested in __tests__/quiz-scoring.test.ts).
 */
export const quizQuestions: QuizQuestion[] = [
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
        id: 'multi-asset',
        label: 'Multi-asset',
        description: 'Stocks, options, futures, forex, crypto',
        tags: ['multi-asset', 'Quantitative Platforms', 'data-fundamentals', 'technical-quantitative'],
        userType: 'quantitative_analyst',
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
        id: 'notes-research',
        label: 'Notes, research logs and checklists',
        description: 'Keeping research notes, logs and checklists organised',
        tags: ['notes-organisation', 'idea-generation-research'],
        userType: 'individual_investor',
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
