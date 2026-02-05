import { describe, it, expect } from 'vitest';
import {
  collectTagsFromAnswers,
  calculateToolScore,
  calculateQuizResults,
  generateMatchReasons,
  getTopRecommendations,
  toolScoring,
  CATEGORY_MATCH_BONUS,
  type QuizQuestion,
} from '@/lib/quiz-scoring';
import { tools, type Tool } from '@/lib/data';

// Test questions matching investment-focused quiz structure
const testQuestions: QuizQuestion[] = [
  {
    id: 'investment-style',
    question: 'What best describes your investment style?',
    options: [
      { id: 'passive', label: 'Passive / Long-term', tags: ['passive', 'portfolio-risk-management', 'Portfolio Management'] },
      { id: 'active', label: 'Active / Short-term', tags: ['active', 'execution-trading', 'Quantitative Platforms'] },
      { id: 'hybrid', label: 'Hybrid', tags: ['passive', 'active', 'portfolio-risk-management', 'execution-trading'] },
    ],
  },
  {
    id: 'risk-tolerance',
    question: 'What is your risk tolerance?',
    options: [
      { id: 'conservative', label: 'Conservative', tags: ['conservative', 'portfolio-risk-management', 'Portfolio Management'] },
      { id: 'moderate', label: 'Moderate', tags: ['moderate-risk', 'Portfolio Management', 'AI Investment Signals'] },
      { id: 'aggressive', label: 'Aggressive', tags: ['aggressive', 'execution-trading', 'Crypto Tools', 'Quantitative Platforms'] },
    ],
  },
  {
    id: 'asset-focus',
    question: 'Where do you focus your investments?',
    options: [
      { id: 'stocks-etfs', label: 'Stocks & ETFs', tags: ['stocks-etfs', 'Quantitative Platforms', 'Portfolio Management', 'AI Investment Signals'] },
      { id: 'crypto', label: 'Crypto', tags: ['crypto', 'Crypto Tools', 'execution-trading'] },
      { id: 'multi-asset', label: 'Multi-asset', tags: ['multi-asset', 'Quantitative Platforms', 'data-fundamentals', 'technical-quantitative'] },
      { id: 'prediction-markets', label: 'Prediction markets', tags: ['prediction-markets', 'Crypto Tools', 'execution-trading'] },
    ],
  },
  {
    id: 'budget',
    question: "What's your monthly budget for tools?",
    options: [
      { id: 'free', label: 'Free / Minimal', tags: ['free-tier', 'budget-friendly'] },
      { id: 'moderate', label: '$20–100/month', tags: ['moderate-budget', 'pro-features'] },
      { id: 'premium', label: '$100+/month', tags: ['premium', 'pro-features'] },
    ],
  },
  {
    id: 'workflow-stage',
    question: "What's your primary workflow stage right now?",
    options: [
      { id: 'idea-research', label: 'Idea generation & research', tags: ['idea-generation-research', 'data-fundamentals', 'Quantitative Platforms', 'AI Investment Signals'] },
      { id: 'data-fundamentals', label: 'Data & fundamentals', tags: ['data-fundamentals', 'technical-quantitative', 'Quantitative Platforms', 'Fintech Infrastructure'] },
      { id: 'technical-quant', label: 'Technical & quantitative analysis', tags: ['technical-quantitative', 'Quantitative Platforms', 'AI Investment Signals'] },
      { id: 'execution', label: 'Execution & trading', tags: ['execution-trading', 'Quantitative Platforms', 'Crypto Tools'] },
      { id: 'ai-tools', label: 'AI-powered tools', tags: ['ai-powered-tools', 'AI Investment Signals', 'Fintech Infrastructure'] },
      { id: 'portfolio-risk', label: 'Portfolio & risk management', tags: ['portfolio-risk-management', 'Portfolio Management'] },
    ],
  },
];

// Helper to get a tool by slug
function getToolBySlug(slug: string): Tool {
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) throw new Error(`Tool not found: ${slug}`);
  return tool;
}

describe('Quiz Scoring Algorithm', () => {
  describe('collectTagsFromAnswers', () => {
    it('should collect tags from single answer', () => {
      const answers = { 'investment-style': 'active' };
      const tags = collectTagsFromAnswers(answers, testQuestions);
      
      expect(tags).toContain('active');
      expect(tags).toContain('execution-trading');
      expect(tags).toContain('Quantitative Platforms');
      expect(tags).toHaveLength(3);
    });

    it('should collect tags from multiple answers', () => {
      const answers = {
        'investment-style': 'passive',
        'risk-tolerance': 'conservative',
        'budget': 'free',
      };
      const tags = collectTagsFromAnswers(answers, testQuestions);
      
      expect(tags).toContain('passive');
      expect(tags).toContain('portfolio-risk-management');
      expect(tags).toContain('Portfolio Management');
      expect(tags).toContain('conservative');
      expect(tags).toContain('budget-friendly');
      expect(tags).toContain('free-tier');
      expect(tags.length).toBeGreaterThanOrEqual(6);
    });

    it('should return empty array for no answers', () => {
      const tags = collectTagsFromAnswers({}, testQuestions);
      expect(tags).toHaveLength(0);
    });

    it('should ignore invalid answer IDs', () => {
      const answers = { 'investment-style': 'invalid-option' };
      const tags = collectTagsFromAnswers(answers, testQuestions);
      expect(tags).toHaveLength(0);
    });
  });

  describe('calculateToolScore', () => {
    it('should give category match bonus when category matches', () => {
      const quantconnect = getToolBySlug('quantconnect');
      const tags = ['Quantitative Platforms', 'technical-quantitative'];
      
      const { score } = calculateToolScore(quantconnect, tags);
      
      // Category bonus (5) + Quantitative Platforms tag (3) + technical-quantitative (3) = 11
      expect(score).toBe(CATEGORY_MATCH_BONUS + toolScoring['quantconnect']!['Quantitative Platforms']! + toolScoring['quantconnect']!['technical-quantitative']!);
    });

    it('should accumulate scores from multiple matching tags', () => {
      const quantconnect = getToolBySlug('quantconnect');
      const tags = ['Quantitative Platforms', 'idea-generation-research', 'data-fundamentals', 'technical-quantitative'];
      
      const { score } = calculateToolScore(quantconnect, tags);
      
      // Category bonus + all 4 tag scores (Quantitative Platforms counts as both category and tag)
      const expected =
        CATEGORY_MATCH_BONUS +
        toolScoring['quantconnect']!['Quantitative Platforms']! +
        toolScoring['quantconnect']!['idea-generation-research']! +
        toolScoring['quantconnect']!['data-fundamentals']! +
        toolScoring['quantconnect']!['technical-quantitative']!;
      expect(score).toBe(expected);
    });

    it('should return 0 for tool with no matching tags', () => {
      const quantconnect = getToolBySlug('quantconnect');
      const tags = ['unknown-tag', 'another-unknown'];
      
      const { score } = calculateToolScore(quantconnect, tags);
      
      expect(score).toBe(0);
    });

    it('should handle tools not in toolScoring gracefully', () => {
      const mockTool = {
        slug: 'unknown-tool',
        name: 'Unknown Tool',
        category: 'AI Investment Signals',
      } as Tool;
      
      const tags = ['AI Investment Signals'];
      const { score } = calculateToolScore(mockTool, tags);
      
      expect(score).toBe(CATEGORY_MATCH_BONUS);
    });
  });

  describe('generateMatchReasons', () => {
    it('should include category match reason', () => {
      const scoring = toolScoring['quantconnect']!;
      const tags = ['Quantitative Platforms'];
      
      const reasons = generateMatchReasons(scoring, tags, 'Quantitative Platforms');
      
      expect(reasons).toContain('Matches your quantitative platforms needs');
    });

    it('should include free tier reason when applicable', () => {
      const scoring = toolScoring['etoro']!;
      const tags = ['free-tier'];
      
      const reasons = generateMatchReasons(scoring, tags, 'Quantitative Platforms');
      
      expect(reasons).toContain('Offers a free tier');
    });

    it('should include execution trading reason', () => {
      const scoring = toolScoring['polymarket']!;
      const tags = ['execution-trading'];
      
      const reasons = generateMatchReasons(scoring, tags, 'Crypto Tools');
      
      expect(reasons).toContain('Strong execution & trading');
    });

    it('should include portfolio risk management reason', () => {
      const scoring = toolScoring['etoro']!;
      const tags = ['portfolio-risk-management'];
      
      const reasons = generateMatchReasons(scoring, tags, 'Quantitative Platforms');
      
      expect(reasons).toContain('Portfolio & risk management');
    });

    it('should include technical quantitative reason', () => {
      const scoring = toolScoring['quantconnect']!;
      const tags = ['technical-quantitative'];
      
      const reasons = generateMatchReasons(scoring, tags, 'Quantitative Platforms');
      
      expect(reasons).toContain('Technical & quantitative analysis');
    });

    it('should limit reasons to 3', () => {
      const scoring = toolScoring['quantconnect']!;
      const tags = ['Quantitative Platforms', 'execution-trading', 'portfolio-risk-management', 'technical-quantitative'];
      
      const reasons = generateMatchReasons(scoring, tags, 'Quantitative Platforms');
      
      expect(reasons.length).toBeLessThanOrEqual(3);
    });
  });

  describe('calculateQuizResults', () => {
    it('should return results sorted by score descending', () => {
      const answers = {
        'investment-style': 'passive',
        'risk-tolerance': 'conservative',
        'budget': 'free',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i]!.score).toBeGreaterThanOrEqual(results[i + 1]!.score);
      }
    });

    it('should recommend eToro/tradingview for passive conservative investors on free budget', () => {
      const answers = {
        'investment-style': 'passive',
        'risk-tolerance': 'conservative',
        'asset-focus': 'stocks-etfs',
        'budget': 'free',
        'workflow-stage': 'portfolio-risk',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      const topSlugs = results.slice(0, 3).map((r) => r.tool.slug);
      
      expect(['etoro', 'tradingview', 'notion']).toEqual(expect.arrayContaining(topSlugs.slice(0, 2)));
    });

    it('should recommend QuantConnect/eToro for active execution-focused users', () => {
      const answers = {
        'investment-style': 'active',
        'risk-tolerance': 'aggressive',
        'asset-focus': 'multi-asset',
        'budget': 'premium',
        'workflow-stage': 'execution',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      const topSlugs = results.slice(0, 3).map((r) => r.tool.slug);
      
      expect(['quantconnect', 'etoro', 'polymarket', 'binance']).toEqual(expect.arrayContaining(topSlugs.slice(0, 2)));
    });

    it('should recommend Polymarket for prediction market focus', () => {
      const answers = {
        'investment-style': 'active',
        'risk-tolerance': 'aggressive',
        'asset-focus': 'prediction-markets',
        'budget': 'free',
        'workflow-stage': 'execution',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      const topResult = results[0]!;
      
      expect(['polymarket', 'binance']).toContain(topResult.tool.slug);
    });

    it('should include match reasons in results', () => {
      const answers = {
        'investment-style': 'passive',
        'risk-tolerance': 'conservative',
        'budget': 'free',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      expect(results[0]!.matchReasons.length).toBeGreaterThan(0);
    });

    it('should return all tools in results', () => {
      const answers = { 'investment-style': 'active' };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      expect(results).toHaveLength(tools.length);
    });
  });

  describe('getTopRecommendations', () => {
    it('should return top 3 by default', () => {
      const answers = { 'investment-style': 'active' };
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      const top = getTopRecommendations(results);
      
      expect(top).toHaveLength(3);
      expect(top[0]).toBe(results[0]);
      expect(top[1]).toBe(results[1]);
      expect(top[2]).toBe(results[2]);
    });

    it('should return specified count', () => {
      const answers = { 'investment-style': 'active' };
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      const top5 = getTopRecommendations(results, 5);
      
      expect(top5).toHaveLength(5);
    });

    it('should handle count larger than results', () => {
      const answers = { 'investment-style': 'active' };
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      const topAll = getTopRecommendations(results, 100);
      
      expect(topAll).toHaveLength(results.length);
    });
  });

  describe('toolScoring weights', () => {
    it('should have scoring weights for high-priority affiliate tools', () => {
      const expectedTools = ['quantconnect', 'etoro', 'polymarket', 'notion'];
      
      expectedTools.forEach((slug) => {
        expect(toolScoring[slug]).toBeDefined();
        expect(Object.keys(toolScoring[slug]!).length).toBeGreaterThan(0);
      });
    });

    it('should have weights between 1 and 3', () => {
      Object.values(toolScoring).forEach((weights) => {
        Object.values(weights!).forEach((weight) => {
          expect(weight).toBeGreaterThanOrEqual(1);
          expect(weight).toBeLessThanOrEqual(3);
        });
      });
    });

    it('should give QuantConnect high scores for workflow stage tags', () => {
      const workflowTags = ['idea-generation-research', 'data-fundamentals', 'technical-quantitative'];
      
      workflowTags.forEach((tag) => {
        if (toolScoring['quantconnect']![tag]) {
          expect(toolScoring['quantconnect']![tag]).toBeGreaterThanOrEqual(2);
        }
      });
    });

    it('should give Polymarket high scores for prediction/execution tags', () => {
      const tags = ['prediction-markets', 'execution-trading'];
      
      tags.forEach((tag) => {
        if (toolScoring['polymarket']![tag]) {
          expect(toolScoring['polymarket']![tag]).toBeGreaterThanOrEqual(2);
        }
      });
    });
  });

  describe('real-world scenarios', () => {
    it('should recommend appropriate tools for passive investors', () => {
      const answers = {
        'investment-style': 'passive',
        'risk-tolerance': 'conservative',
        'asset-focus': 'stocks-etfs',
        'budget': 'free',
        'workflow-stage': 'portfolio-risk',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      const topThree = results.slice(0, 3).map((r) => r.tool.slug);
      
      const passiveFriendlyTools = ['etoro', 'tradingview', 'notion'];
      const hasPassiveTool = topThree.some((slug) => passiveFriendlyTools.includes(slug));
      expect(hasPassiveTool).toBe(true);
    });

    it('should differentiate between passive and active investors', () => {
      const passiveAnswers = {
        'investment-style': 'passive',
        'risk-tolerance': 'conservative',
        'budget': 'free',
      };
      
      const activeAnswers = {
        'investment-style': 'active',
        'risk-tolerance': 'aggressive',
        'budget': 'premium',
      };
      
      const passiveResults = calculateQuizResults(tools, passiveAnswers, testQuestions);
      const activeResults = calculateQuizResults(tools, activeAnswers, testQuestions);
      
      expect(passiveResults[0]!.tool.slug).not.toBe(activeResults[0]!.tool.slug);
    });
  });

  // =========================================================================
  // ADDITIONAL EDGE CASES AND COMPREHENSIVE COVERAGE
  // =========================================================================

  describe('edge cases - collectTagsFromAnswers', () => {
    it('should handle empty questions array', () => {
      const answers = { 'use-case': 'marketing' };
      const tags = collectTagsFromAnswers(answers, []);
      expect(tags).toHaveLength(0);
    });

    it('should handle question with empty options', () => {
      const questionsWithEmpty: QuizQuestion[] = [
        { id: 'empty', question: 'Empty?', options: [] },
      ];
      const answers = { 'empty': 'any' };
      const tags = collectTagsFromAnswers(answers, questionsWithEmpty);
      expect(tags).toHaveLength(0);
    });

    it('should handle options with empty tags array', () => {
      const questionsWithEmptyTags: QuizQuestion[] = [
        {
          id: 'test',
          question: 'Test?',
          options: [{ id: 'opt1', label: 'Option 1', tags: [] }],
        },
      ];
      const answers = { 'test': 'opt1' };
      const tags = collectTagsFromAnswers(answers, questionsWithEmptyTags);
      expect(tags).toHaveLength(0);
    });

    it('should find option by id across all questions (not by question id)', () => {
      const answers = { 'non-existent-question': 'active' };
      const tags = collectTagsFromAnswers(answers, testQuestions);
      
      expect(tags).toContain('active');
      expect(tags).toContain('execution-trading');
    });

    it('should collect duplicate tags when same tag appears in multiple options', () => {
      const answers = {
        'investment-style': 'passive',
        'budget': 'free',
      };
      const tags = collectTagsFromAnswers(answers, testQuestions);
      
      const budgetFriendlyCount = tags.filter((t) => t === 'budget-friendly').length;
      expect(budgetFriendlyCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('edge cases - calculateToolScore', () => {
    it('should return 0 score and empty reasons for empty tags', () => {
      const quantconnect = getToolBySlug('quantconnect');
      const { score, matchReasons } = calculateToolScore(quantconnect, []);
      
      expect(score).toBe(0);
      expect(matchReasons).toHaveLength(0);
    });

    it('should handle duplicate tags in input', () => {
      const quantconnect = getToolBySlug('quantconnect');
      const tags = ['technical-quantitative', 'technical-quantitative', 'technical-quantitative'];
      
      const { score } = calculateToolScore(quantconnect, tags);
      
      expect(score).toBe(toolScoring['quantconnect']!['technical-quantitative']! * 3);
    });

    it('should handle tool with empty slug', () => {
      const mockTool = {
        slug: '',
        name: 'No Slug Tool',
        category: 'Quantitative Platforms',
      } as Tool;
      
      const { score } = calculateToolScore(mockTool, ['Quantitative Platforms']);
      
      expect(score).toBe(CATEGORY_MATCH_BONUS);
    });

    it('should not give category bonus when category does not match tags', () => {
      const binance = getToolBySlug('binance');
      const tags = ['Portfolio Management', 'passive'];
      
      const { score } = calculateToolScore(binance, tags);
      
      expect(score).toBe(0);
    });

    it('should handle mixed valid and invalid tags', () => {
      const quantconnect = getToolBySlug('quantconnect');
      const tags = ['Quantitative Platforms', 'technical-quantitative', 'invalid-tag', 'data-fundamentals', 'another-invalid'];
      
      const { score } = calculateToolScore(quantconnect, tags);
      
      const expected =
        CATEGORY_MATCH_BONUS +
        toolScoring['quantconnect']!['Quantitative Platforms']! +
        toolScoring['quantconnect']!['technical-quantitative']! +
        toolScoring['quantconnect']!['data-fundamentals']!;
      expect(score).toBe(expected);
    });
  });

  describe('edge cases - generateMatchReasons', () => {
    it('should return empty array for empty scoring and tags', () => {
      const reasons = generateMatchReasons({}, [], 'Quantitative Platforms');
      expect(reasons).toHaveLength(0);
    });

    it('should include execution trading reason when applicable', () => {
      const scoring = toolScoring['polymarket']!;
      const tags = ['execution-trading'];
      
      const reasons = generateMatchReasons(scoring, tags, 'Crypto Tools');
      
      expect(reasons).toContain('Strong execution & trading');
    });

    it('should include budget-friendly reason', () => {
      const scoring = toolScoring['etoro']!;
      const tags = ['budget-friendly'];
      
      const reasons = generateMatchReasons(scoring, tags, 'Quantitative Platforms');
      
      expect(reasons).toContain('Budget-friendly option');
    });

    it('should not include reason when tool does not have matching scoring', () => {
      const scoring = toolScoring['notion']!;
      const tags = ['free-tier'];
      
      const reasons = generateMatchReasons(scoring, tags, 'AI Investment Signals');
      
      expect(reasons).not.toContain('Offers a free tier');
    });

    it('should prioritize reasons in order (category first)', () => {
      const scoring = toolScoring['quantconnect']!;
      const tags = ['Quantitative Platforms', 'execution-trading', 'technical-quantitative'];
      
      const reasons = generateMatchReasons(scoring, tags, 'Quantitative Platforms');
      
      expect(reasons[0]).toBe('Matches your quantitative platforms needs');
    });
  });

  describe('edge cases - calculateQuizResults', () => {
    it('should handle empty tools array', () => {
      const answers = { 'investment-style': 'active' };
      const results = calculateQuizResults([], answers, testQuestions);
      
      expect(results).toHaveLength(0);
    });

    it('should handle empty answers', () => {
      const results = calculateQuizResults(tools, {}, testQuestions);
      
      // All tools should have 0 score
      expect(results).toHaveLength(tools.length);
      results.forEach((result) => {
        expect(result.score).toBe(0);
      });
    });

    it('should handle empty questions', () => {
      const answers = { 'investment-style': 'active' };
      const results = calculateQuizResults(tools, answers, []);
      
      // All tools should have 0 score (no tags collected)
      expect(results).toHaveLength(tools.length);
      results.forEach((result) => {
        expect(result.score).toBe(0);
      });
    });

    it('should maintain stable sort for equal scores', () => {
      // Run multiple times to check stability
      const answers = {}; // All tools will have 0 score
      
      const results1 = calculateQuizResults(tools, answers, testQuestions);
      const results2 = calculateQuizResults(tools, answers, testQuestions);
      
      // Order should be consistent
      results1.forEach((result, index) => {
        expect(result.tool.slug).toBe(results2[index]!.tool.slug);
      });
    });

    it('should include all result properties', () => {
      const answers = { 'investment-style': 'active' };
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      results.forEach((result) => {
        expect(result).toHaveProperty('tool');
        expect(result).toHaveProperty('score');
        expect(result).toHaveProperty('matchReasons');
        expect(typeof result.score).toBe('number');
        expect(Array.isArray(result.matchReasons)).toBe(true);
      });
    });
  });

  describe('edge cases - getTopRecommendations', () => {
    it('should handle empty results array', () => {
      const top = getTopRecommendations([]);
      expect(top).toHaveLength(0);
    });

    it('should handle count of 0', () => {
      const answers = { 'investment-style': 'active' };
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      const top = getTopRecommendations(results, 0);
      expect(top).toHaveLength(0);
    });

    it('should handle count of 1', () => {
      const answers = { 'investment-style': 'active' };
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      const top = getTopRecommendations(results, 1);
      expect(top).toHaveLength(1);
      expect(top[0]).toBe(results[0]);
    });

    it('should handle negative count (returns all but last N)', () => {
      const answers = { 'investment-style': 'active' };
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      // slice(0, -1) returns all but the last element
      const top = getTopRecommendations(results, -1);
      expect(top).toHaveLength(results.length - 1);
    });
  });

  describe('category-specific scenarios', () => {
    it('should recommend QuantConnect for technical-quantitative workflow', () => {
      const answers = {
        'investment-style': 'active',
        'risk-tolerance': 'aggressive',
        'asset-focus': 'multi-asset',
        'budget': 'premium',
        'workflow-stage': 'technical-quant',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      const quantconnectResult = results.find((r) => r.tool.slug === 'quantconnect');
      expect(quantconnectResult).toBeDefined();
      expect(quantconnectResult!.score).toBeGreaterThan(0);
    });

    it('should recommend Notion for AI-powered tools workflow', () => {
      const answers = {
        'investment-style': 'hybrid',
        'risk-tolerance': 'moderate',
        'asset-focus': 'stocks-etfs',
        'budget': 'moderate',
        'workflow-stage': 'ai-tools',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      const notionResult = results.find((r) => r.tool.slug === 'notion');
      expect(notionResult).toBeDefined();
      expect(notionResult!.score).toBeGreaterThan(0);
    });

    it('should recommend crypto tools for crypto asset focus', () => {
      const answers = {
        'investment-style': 'active',
        'risk-tolerance': 'aggressive',
        'asset-focus': 'crypto',
        'budget': 'free',
        'workflow-stage': 'execution',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      const topSlugs = results.slice(0, 4).map((r) => r.tool.slug);
      const cryptoTools = ['polymarket', 'binance', 'robinhood'];
      const hasCryptoTool = topSlugs.some((slug) => cryptoTools.includes(slug));
      expect(hasCryptoTool).toBe(true);
    });
  });

  describe('scoring accuracy', () => {
    it('should calculate exact score for known scenario', () => {
      const quantconnect = getToolBySlug('quantconnect');
      const tags = ['Quantitative Platforms', 'idea-generation-research', 'data-fundamentals', 'technical-quantitative', 'premium'];
      
      const { score } = calculateToolScore(quantconnect, tags);
      
      const expected =
        5 +
        toolScoring['quantconnect']!['Quantitative Platforms']! +
        toolScoring['quantconnect']!['idea-generation-research']! +
        toolScoring['quantconnect']!['data-fundamentals']! +
        toolScoring['quantconnect']!['technical-quantitative']! +
        toolScoring['quantconnect']!['premium']!;
      expect(score).toBe(expected);
    });

    it('should produce consistent scores across multiple runs', () => {
      const answers = {
        'investment-style': 'active',
        'risk-tolerance': 'aggressive',
        'budget': 'premium',
      };
      
      const scores: number[] = [];
      for (let i = 0; i < 10; i++) {
        const results = calculateQuizResults(tools, answers, testQuestions);
        scores.push(results[0]!.score);
      }
      
      const firstScore = scores[0];
      expect(scores.every((s) => s === firstScore)).toBe(true);
    });

    it('should rank Notion highly for AI-powered workflow users', () => {
      const answers = {
        'investment-style': 'hybrid',
        'risk-tolerance': 'moderate',
        'asset-focus': 'stocks-etfs',
        'budget': 'moderate',
        'workflow-stage': 'ai-tools',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      const notionResult = results.find((r) => r.tool.slug === 'notion');
      
      expect(notionResult).toBeDefined();
      expect(notionResult!.score).toBeGreaterThan(5);
    });
  });

  describe('boundary conditions', () => {
    it('should handle very long tag arrays', () => {
      const quantconnect = getToolBySlug('quantconnect');
      const manyTags = Array(100).fill('technical-quantitative');
      
      const { score } = calculateToolScore(quantconnect, manyTags);
      
      expect(score).toBe(toolScoring['quantconnect']!['technical-quantitative']! * 100);
    });

    it('should handle unicode in tags', () => {
      const questionsWithUnicode: QuizQuestion[] = [
        {
          id: 'unicode',
          question: 'Test?',
          options: [{ id: 'opt', label: 'Option', tags: ['日本語', 'émoji 🎉'] }],
        },
      ];
      const answers = { 'unicode': 'opt' };
      const tags = collectTagsFromAnswers(answers, questionsWithUnicode);
      
      expect(tags).toContain('日本語');
      expect(tags).toContain('émoji 🎉');
    });

    it('should handle special characters in tags', () => {
      const quantconnect = getToolBySlug('quantconnect');
      const tags = ['Quantitative Platforms', 'execution-trading', 'pro-features'];
      
      const { score } = calculateToolScore(quantconnect, tags);
      
      expect(score).toBeGreaterThan(0);
    });
  });
});
