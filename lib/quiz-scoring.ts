/**
 * Quiz Scoring Algorithm
 * 
 * Calculates tool recommendations based on user quiz answers.
 * This module is extracted from QuizComponent for testability.
 * 
 * @module lib/quiz-scoring
 */

import type { Tool } from './data';

/**
 * Quiz option structure
 */
export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  tags: string[];
}

/**
 * Quiz question structure
 */
export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

/**
 * Result of scoring a tool against user answers
 */
export interface QuizResult {
  tool: Tool;
  score: number;
  matchReasons: string[];
}

/**
 * Tag-based scoring weights for each tool.
 * Higher values = stronger match for that tag.
 * 
 * Score meanings:
 * - 3: Excellent match
 * - 2: Good match  
 * - 1: Partial match
 */
export const toolScoring: Record<string, Record<string, number>> = {
  quantconnect: {
    'Quantitative Platforms': 3,
    'AI Investment Signals': 2,
    'idea-generation-research': 3,
    'data-fundamentals': 3,
    'technical-quantitative': 3,
    'execution-trading': 2,
    'multi-asset': 3,
    active: 3,
    aggressive: 2,
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
    active: 3,
    aggressive: 2,
    'moderate-budget': 2,
    premium: 3,
    'pro-features': 3,
  },
  polymarket: {
    'Crypto Tools': 3,
    'execution-trading': 3,
    'prediction-markets': 3,
    active: 3,
    aggressive: 2,
    'budget-friendly': 2,
    'free-tier': 2,
  },
  notion: {
    'AI Investment Signals': 3,
    'Fintech Infrastructure': 2,
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
  binance: {
    'Crypto Tools': 3,
    'execution-trading': 3,
    crypto: 3,
    active: 2,
    aggressive: 2,
    'budget-friendly': 2,
    'pro-features': 2,
  },
  wealthfront: {
    'Portfolio Management': 3,
    'portfolio-risk-management': 3,
    passive: 3,
    conservative: 3,
    'moderate-risk': 2,
    'stocks-etfs': 2,
    'budget-friendly': 3,
    'free-tier': 2,
  },
  betterment: {
    'Portfolio Management': 3,
    'portfolio-risk-management': 3,
    passive: 3,
    conservative: 3,
    'moderate-risk': 2,
    'stocks-etfs': 2,
    'budget-friendly': 3,
    'free-tier': 2,
  },
  robinhood: {
    'Portfolio Management': 3,
    'execution-trading': 2,
    'stocks-etfs': 3,
    crypto: 2,
    'budget-friendly': 3,
    'free-tier': 3,
    'moderate-risk': 2,
  },
};

/**
 * Base score bonus when tool category matches a selected tag
 */
export const CATEGORY_MATCH_BONUS = 5;

/**
 * Collects all tags from selected quiz answers
 * 
 * @param answers - Map of question ID to selected option ID
 * @param questions - Array of quiz questions
 * @returns Array of all tags from selected options
 * 
 * @example
 * ```ts
 * const answers = { 'use-case': 'marketing', 'team-size': 'solo' };
 * const tags = collectTagsFromAnswers(answers, questions);
 * // ['AI Writing', 'marketing', 'copy', 'solo', 'budget-friendly']
 * ```
 */
export function collectTagsFromAnswers(
  answers: Record<string, string>,
  questions: QuizQuestion[]
): string[] {
  const tags: string[] = [];
  
  Object.values(answers).forEach((answerId) => {
    questions.forEach((q) => {
      const option = q.options.find((o) => o.id === answerId);
      if (option) {
        tags.push(...option.tags);
      }
    });
  });
  
  return tags;
}

/**
 * Generates match reasons based on high-scoring tag matches
 * 
 * @param scoring - Tool's scoring weights
 * @param selectedTags - Tags selected by user
 * @param toolCategory - Tool's category
 * @returns Array of human-readable match reasons
 */
export function generateMatchReasons(
  scoring: Record<string, number>,
  selectedTags: string[],
  toolCategory: string
): string[] {
  const reasons: string[] = [];

  // Category match reason
  if (selectedTags.includes(toolCategory)) {
    reasons.push(`Matches your ${toolCategory.toLowerCase()} needs`);
  }

  // Specific feature match reasons
  if (scoring['free-tier'] && selectedTags.includes('free-tier')) {
    reasons.push('Offers a free tier');
  }
  if (scoring['budget-friendly'] && selectedTags.includes('budget-friendly')) {
    reasons.push('Budget-friendly option');
  }
  if (scoring['execution-trading'] && selectedTags.includes('execution-trading')) {
    reasons.push('Strong execution & trading');
  }
  if (scoring['portfolio-risk-management'] && selectedTags.includes('portfolio-risk-management')) {
    reasons.push('Portfolio & risk management');
  }
  if (scoring['technical-quantitative'] && selectedTags.includes('technical-quantitative')) {
    reasons.push('Technical & quantitative analysis');
  }
  if (scoring['ai-powered-tools'] && selectedTags.includes('ai-powered-tools')) {
    reasons.push('AI-powered workflow');
  }

  return reasons.slice(0, 3); // Limit to top 3 reasons
}

/**
 * Calculates score for a single tool based on selected tags
 * 
 * @param tool - The tool to score
 * @param selectedTags - Tags selected by user from quiz answers
 * @returns Score and match reasons for the tool
 * 
 * @example
 * ```ts
 * const selectedTags = ['AI Writing', 'marketing', 'solo', 'budget-friendly'];
 * const result = calculateToolScore(jasperTool, selectedTags);
 * // { score: 14, matchReasons: ['Matches your ai writing needs'] }
 * ```
 */
export function calculateToolScore(
  tool: Tool,
  selectedTags: string[]
): { score: number; matchReasons: string[] } {
  const scoring = toolScoring[tool.slug] || {};
  let score = 0;

  // Base score from category match
  if (selectedTags.includes(tool.category)) {
    score += CATEGORY_MATCH_BONUS;
  }

  // Score from tag matches
  selectedTags.forEach((tag) => {
    if (scoring[tag]) {
      score += scoring[tag];
    }
  });

  const matchReasons = generateMatchReasons(scoring, selectedTags, tool.category);

  return { score, matchReasons };
}

/**
 * Calculates recommendations for all tools based on quiz answers
 * 
 * @param tools - Array of all available tools
 * @param answers - Map of question ID to selected option ID
 * @param questions - Array of quiz questions
 * @returns Array of tools sorted by score (highest first)
 * 
 * @example
 * ```ts
 * const answers = { 
 *   'use-case': 'marketing', 
 *   'team-size': 'solo', 
 *   'budget': 'free' 
 * };
 * const results = calculateQuizResults(tools, answers, questions);
 * // [{ tool: copyAi, score: 18, matchReasons: [...] }, ...]
 * ```
 */
export function calculateQuizResults(
  tools: Tool[],
  answers: Record<string, string>,
  questions: QuizQuestion[]
): QuizResult[] {
  // Collect all tags from answers
  const selectedTags = collectTagsFromAnswers(answers, questions);

  // Score each tool
  const results: QuizResult[] = tools.map((tool) => {
    const { score, matchReasons } = calculateToolScore(tool, selectedTags);
    return { tool, score, matchReasons };
  });

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Gets the top N recommendations from quiz results
 * 
 * @param results - Scored quiz results
 * @param count - Number of top results to return (default: 3)
 * @returns Top N results
 */
export function getTopRecommendations(
  results: QuizResult[],
  count: number = 3
): QuizResult[] {
  return results.slice(0, count);
}
