import { describe, it, expect } from 'vitest';
import {
  collectTagsFromAnswers,
  calculateToolScore,
  calculateQuizResults,
  generateMatchReasons,
  getTopRecommendations,
  toolScoring,
  CATEGORY_MATCH_BONUS,
  NOTES_WORKFLOW_FIT,
  type QuizQuestion,
} from '@/lib/quiz-scoring';
import { tools, type Tool } from '@/lib/data';

import { quizQuestions as testQuestions } from '@/lib/quiz-questions';
import nonNotesTop3 from './fixtures/quiz-top3-non-notes.json';

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
      const scoring = toolScoring['quantconnect']!;
      const tags = ['execution-trading'];
      
      const reasons = generateMatchReasons(scoring, tags, 'Quantitative Platforms');
      
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
      
      expect(['quantconnect', 'etoro']).toEqual(expect.arrayContaining(topSlugs.slice(0, 2)));
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
      
      const top3 = getTopRecommendations(results, 3);
      
      expect(top3).toHaveLength(3);
    });

    it('should handle count larger than results', () => {
      const answers = { 'investment-style': 'active' };
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      const topAll = getTopRecommendations(results, 100);
      
      expect(topAll).toHaveLength(results.length);
    });
  });

  describe('toolScoring weights', () => {
    it('should have scoring weights for reviewed tools', () => {
      const expectedTools = ['quantconnect', 'etoro', 'notion', 'tradingview'];
      
      expectedTools.forEach((slug) => {
        expect(toolScoring[slug]).toBeDefined();
        expect(Object.keys(toolScoring[slug]!).length).toBeGreaterThan(0);
      });
    });

    it('should have weights between 1 and 3 (except the single notes workflow fit weight)', () => {
      Object.entries(toolScoring).forEach(([slug, weights]) => {
        Object.entries(weights!).forEach(([tag, weight]) => {
          if (slug === 'notion' && tag === 'notes-organisation') {
            expect(weight).toBe(NOTES_WORKFLOW_FIT);
            return;
          }
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

    it('has no scoring entry for removed tools (Polymarket, Binance)', () => {
      expect(toolScoring['polymarket']).toBeUndefined();
      expect(toolScoring['binance']).toBeUndefined();
      expect(tools.map((t) => t.slug)).not.toContain('polymarket');
    });

    it('scores by fit only: no tool is weighted on another category\'s tag', () => {
      const categories = new Set(tools.map((t) => t.category));
      ['Quantitative Platforms', 'AI Investment Signals', 'Crypto Tools', 'Fintech Infrastructure', 'Portfolio Management'].forEach((c) => categories.add(c));
      tools.forEach((tool) => {
        const weights = toolScoring[tool.slug] ?? {};
        Object.keys(weights)
          .filter((tag) => categories.has(tag))
          .forEach((tag) => expect(`${tool.slug}:${tag}`).toBe(`${tool.slug}:${tool.category}`));
      });
    });

    it('ignores commercial fields entirely when scoring', () => {
      const base = getToolBySlug('etoro');
      const tags = ['Quantitative Platforms', 'budget-friendly', 'free-tier'];
      const withCommercial = { ...base, commissionRate: '50%', hasExclusiveDeal: true, cookieDuration: 90 } as typeof base;
      expect(calculateToolScore(withCommercial, tags)).toEqual(calculateToolScore(base, tags));
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
      const tradingview = getToolBySlug('tradingview');
      const tags = ['Portfolio Management', 'passive'];
      
      const { score } = calculateToolScore(tradingview, tags);
      
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
      const scoring = toolScoring['quantconnect']!;
      const tags = ['execution-trading'];
      
      const reasons = generateMatchReasons(scoring, tags, 'Quantitative Platforms');
      
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

    it('does not select Notion for the AI-powered tools workflow (notes option only)', () => {
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
      expect(notionResult!.score).toBe(0);
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

    it('selects Notion only via the notes option', () => {
      const notion = getToolBySlug('notion');
      for (const q of testQuestions) {
        for (const o of q.options) {
          const { score } = calculateToolScore(notion, o.tags);
          if (o.id === 'notes-research') expect(score).toBeGreaterThan(0);
          else expect(`${q.id}/${o.id}:${score}`).toBe(`${q.id}/${o.id}:0`);
        }
      }
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


describe('CPO quiz decisions', () => {
  for (const question of testQuestions) {
    for (const option of question.options) {
      it(`${question.id}/${option.id} matches at least one reviewed tool`, () => {
        expect(tools.some((tool) => calculateToolScore(tool, option.tags).score > 0)).toBe(true);
      });
    }
  }

  it('Research Workflow never receives a category bonus or category reason', () => {
    const researchTools = tools.filter((tool) => tool.category === 'Research Workflow');
    expect(researchTools.length).toBeGreaterThan(0);
    for (const tool of researchTools) {
      expect(calculateToolScore(tool, ['Research Workflow'])).toEqual({ score: 0, matchReasons: [] });
      const fitTags = ['notes-organisation', 'idea-generation-research'];
      expect(calculateToolScore(tool, [...fitTags, 'Research Workflow'])).toEqual(
        calculateToolScore(tool, fitTags)
      );
    }
    expect(generateMatchReasons({}, ['Research Workflow'], 'Research Workflow')).toEqual([]);
  });

  it('Notion has only the approved research workflow weights', () => {
    const categories = new Set([
      ...tools.map((tool) => tool.category),
      'AI Investment Signals', 'Quantitative Platforms', 'Fintech Infrastructure',
      'Crypto Tools', 'Portfolio Management', 'Research Workflow',
    ]);
    const forbidden = [...categories, 'execution-trading', 'technical-quantitative',
      ...testQuestions.flatMap((q) => q.options.flatMap((o) => o.tags)).filter((tag) => /signal/i.test(tag)),
    ];
    for (const tag of forbidden) expect(toolScoring.notion).not.toHaveProperty(tag);
    expect(toolScoring.notion).toEqual({ 'notes-organisation': NOTES_WORKFLOW_FIT });
    expect(calculateToolScore(getToolBySlug('notion'), ['notes-organisation']).matchReasons)
      .toEqual(['Notes & research organisation']);
  });

  it('has no crypto option or crypto tag, and the notes option label is exact', () => {
    const options = testQuestions.flatMap((q) => q.options);
    expect(options.map((o) => o.id)).not.toContain('crypto');
    expect(options.flatMap((o) => o.tags)).not.toContain('crypto');
    expect(Object.values(toolScoring).some((w) => 'crypto' in w)).toBe(false);
    expect(options.find((o) => o.id === 'notes-research')?.label).toBe('Notes, research logs and checklists');
  });

  it('has no prediction-markets option, tag or copy', () => {
    expect(JSON.stringify(testQuestions)).not.toMatch(/prediction[- ]markets?/i);
    expect(JSON.stringify(toolScoring)).not.toContain('prediction-markets');
  });

  describe('Notion on the notes paths (Reviewer P2-2)', () => {
    function* allPaths(i = 0, acc: Record<string, string> = {}): Generator<Record<string, string>> {
      if (i === testQuestions.length) { yield { ...acc }; return; }
      const q = testQuestions[i]!;
      for (const o of q.options) { acc[q.id] = o.id; yield* allPaths(i + 1, acc); }
    }
    const paths = [...allPaths()];
    const isNotes = (a: Record<string, string>) => a['workflow-stage'] === 'notes-research';
    const key = (a: Record<string, string>) => testQuestions.map((q) => a[q.id]).join('|');
    const top3 = (a: Record<string, string>) =>
      getTopRecommendations(calculateQuizResults(tools, a, testQuestions)).map((r) => r.tool.slug);

    it('every one of the 54 notes paths has Notion in the top 3, strictly ahead of the 4th tool', () => {
      const notes = paths.filter(isNotes);
      expect(notes).toHaveLength(54);
      for (const a of notes) {
        const results = calculateQuizResults(tools, a, testQuestions);
        expect(top3(a), key(a)).toContain('notion');
        const notion = results.find((r) => r.tool.slug === 'notion')!;
        const others = results.filter((r) => r.tool.slug !== 'notion').map((r) => r.score);
        // Strictly beats the third-best other tool, so the result does not hang on sort order.
        expect(notion.score, key(a)).toBeGreaterThan(others[2]!);
      }
    });

    it('non-notes paths are unchanged: top 3 matches the snapshot taken before the fix, and never has Notion', () => {
      const snapshot = nonNotesTop3 as Record<string, string>;
      const nonNotes = paths.filter((a) => !isNotes(a));
      expect(nonNotes).toHaveLength(Object.keys(snapshot).length);
      for (const a of nonNotes) {
        expect(top3(a).join(','), key(a)).toBe(snapshot[key(a)]);
        expect(top3(a), key(a)).not.toContain('notion');
      }
    });

    it('Notion is reached through its fit weight only (no category bonus, no other weights)', () => {
      expect(Object.keys(toolScoring.notion!)).toEqual(['notes-organisation']);
      expect(testQuestions.flatMap((q) => q.options).filter((o) => o.tags.includes('notes-organisation')).map((o) => o.id))
        .toEqual(['notes-research']);
      expect(calculateToolScore(getToolBySlug('notion'), ['notes-organisation', 'Research Workflow']).score)
        .toBe(NOTES_WORKFLOW_FIT);
    });
  });
});
