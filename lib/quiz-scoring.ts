/**
 * Quiz Scoring Algorithm
 * 
 * Calculates tool recommendations based on user quiz answers.
 * This module is extracted from QuizComponent for testability.
 * 
 * @module lib/quiz-scoring
 */

import type { Tool, UserType } from './data';

/**
 * Quiz option structure
 */
export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  tags: string[];
  /** User type association */
  userType?: UserType;
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
 * Tag-based scoring weights for each tool. Quiz scores reflect fit only;
 * commission and former partner status have no effect.
 * Higher values = stronger match for that tag.
 * 
 * Score meanings (NOTES_WORKFLOW_FIT is the one exception):
 * - 3: Excellent match
 * - 2: Good match  
 * - 1: Partial match
 */
/**
 * Fit weight for a direct match on the notes workflow answer. Picking "Notes,
 * research logs and checklists" says the primary need is a notes tool, so that
 * single fit tag must outweigh what the other tools collect incidentally from the
 * other four answers (up to 23 points on a notes path; 3 for each tag plus the
 * category bonus). 24 puts Notion strictly in the top 3 on every notes path; the
 * margin is tested in __tests__/quiz-scoring.test.ts. It does not change any
 * path without the notes answer, because no other option carries this tag.
 */
export const NOTES_WORKFLOW_FIT = 24;

export const toolScoring: Record<string, Record<string, number>> = {
  quantconnect: {
    'Quantitative Platforms': 3,
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
  etoro: {
    'Quantitative Platforms': 3,
    'execution-trading': 2,
    'stocks-etfs': 3,
    'portfolio-risk-management': 2,
    passive: 2,
    conservative: 2,
    'moderate-risk': 2,
    'budget-friendly': 3,
    'free-tier': 2,
  },
  // Research Workflow: selected only via the notes option. No research, AI,
  // signals, execution or pricing weights, and no category bonus.
  notion: {
    'notes-organisation': NOTES_WORKFLOW_FIT,
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
};

/**
 * Base score bonus when tool category matches a selected tag
 */
export const CATEGORY_MATCH_BONUS = 5;

/** Categories that never earn the category bonus; their tools score on fit tags only. */
export const NO_BONUS_CATEGORIES: readonly string[] = ['Research Workflow'];

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
 * // ['Quantitative Platforms', 'technical-quantitative', 'budget-friendly']
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
  if (selectedTags.includes(toolCategory) && !NO_BONUS_CATEGORIES.includes(toolCategory)) {
    reasons.push(`Matches your ${toolCategory.toLowerCase()} needs`);
  }

  if (scoring['notes-organisation'] && selectedTags.includes('notes-organisation')) {
    reasons.push('Notes & research organisation');
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
 * const selectedTags = ['Quantitative Platforms', 'technical-quantitative', 'budget-friendly'];
 * const result = calculateToolScore(quantconnectTool, selectedTags);
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
  if (selectedTags.includes(tool.category) && !NO_BONUS_CATEGORIES.includes(tool.category)) {
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
