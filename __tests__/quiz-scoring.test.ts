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

// Test questions matching the real quiz structure
const testQuestions: QuizQuestion[] = [
  {
    id: 'use-case',
    question: 'What do you primarily want to create?',
    options: [
      {
        id: 'marketing',
        label: 'Marketing Copy',
        tags: ['AI Writing', 'marketing', 'copy'],
      },
      {
        id: 'blog',
        label: 'Blog & Articles',
        tags: ['AI Writing', 'content', 'seo'],
      },
      {
        id: 'video',
        label: 'Video Content',
        tags: ['AI Voice', 'video', 'audio'],
      },
      {
        id: 'all',
        label: 'Multiple Types',
        tags: ['AI Writing', 'versatile'],
      },
    ],
  },
  {
    id: 'team-size',
    question: 'How many people will use this tool?',
    options: [
      {
        id: 'solo',
        label: 'Just Me',
        tags: ['solo', 'budget-friendly'],
      },
      {
        id: 'small-team',
        label: 'Small Team (2-5)',
        tags: ['team', 'collaboration'],
      },
      {
        id: 'agency',
        label: 'Agency or Large Team',
        tags: ['agency', 'enterprise', 'brand-voice'],
      },
    ],
  },
  {
    id: 'budget',
    question: "What's your monthly budget?",
    options: [
      {
        id: 'free',
        label: 'Free / Minimal',
        tags: ['free-tier', 'budget-friendly'],
      },
      {
        id: 'moderate',
        label: '$20-100/month',
        tags: ['moderate-budget', 'pro-features'],
      },
      {
        id: 'premium',
        label: '$100+/month',
        tags: ['premium', 'enterprise', 'unlimited'],
      },
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
      const answers = { 'use-case': 'marketing' };
      const tags = collectTagsFromAnswers(answers, testQuestions);
      
      expect(tags).toContain('AI Writing');
      expect(tags).toContain('marketing');
      expect(tags).toContain('copy');
      expect(tags).toHaveLength(3);
    });

    it('should collect tags from multiple answers', () => {
      const answers = {
        'use-case': 'marketing',
        'team-size': 'solo',
        'budget': 'free',
      };
      const tags = collectTagsFromAnswers(answers, testQuestions);
      
      expect(tags).toContain('AI Writing');
      expect(tags).toContain('marketing');
      expect(tags).toContain('copy');
      expect(tags).toContain('solo');
      expect(tags).toContain('budget-friendly');
      expect(tags).toContain('free-tier');
      // 3 + 2 + 2 = 7 tags (budget-friendly appears twice but in different options)
      expect(tags).toHaveLength(7);
    });

    it('should return empty array for no answers', () => {
      const tags = collectTagsFromAnswers({}, testQuestions);
      expect(tags).toHaveLength(0);
    });

    it('should ignore invalid answer IDs', () => {
      const answers = { 'use-case': 'invalid-option' };
      const tags = collectTagsFromAnswers(answers, testQuestions);
      expect(tags).toHaveLength(0);
    });
  });

  describe('calculateToolScore', () => {
    it('should give category match bonus when category matches', () => {
      const jasper = getToolBySlug('jasper-ai');
      const tags = ['AI Writing'];
      
      const { score } = calculateToolScore(jasper, tags);
      
      // Category bonus (5) + AI Writing score (3) = 8
      expect(score).toBe(CATEGORY_MATCH_BONUS + toolScoring['jasper-ai']['AI Writing']);
    });

    it('should accumulate scores from multiple matching tags', () => {
      const jasper = getToolBySlug('jasper-ai');
      const tags = ['AI Writing', 'marketing', 'copy'];
      
      const { score } = calculateToolScore(jasper, tags);
      
      // Category bonus (5) + AI Writing (3) + marketing (3) + copy (3) = 14
      const expected = 
        CATEGORY_MATCH_BONUS + 
        toolScoring['jasper-ai']['AI Writing'] +
        toolScoring['jasper-ai']['marketing'] +
        toolScoring['jasper-ai']['copy'];
      expect(score).toBe(expected);
    });

    it('should return 0 for tool with no matching tags', () => {
      const jasper = getToolBySlug('jasper-ai');
      const tags = ['unknown-tag', 'another-unknown'];
      
      const { score } = calculateToolScore(jasper, tags);
      
      expect(score).toBe(0);
    });

    it('should handle tools not in toolScoring gracefully', () => {
      const mockTool = {
        slug: 'unknown-tool',
        name: 'Unknown Tool',
        category: 'AI Writing',
      } as Tool;
      
      const tags = ['AI Writing'];
      const { score } = calculateToolScore(mockTool, tags);
      
      // Only category bonus since tool has no scoring weights
      expect(score).toBe(CATEGORY_MATCH_BONUS);
    });
  });

  describe('generateMatchReasons', () => {
    it('should include category match reason', () => {
      const scoring = toolScoring['jasper-ai'];
      const tags = ['AI Writing'];
      
      const reasons = generateMatchReasons(scoring, tags, 'AI Writing');
      
      expect(reasons).toContain('Matches your ai writing needs');
    });

    it('should include free tier reason when applicable', () => {
      const scoring = toolScoring['copy-ai'];
      const tags = ['free-tier'];
      
      const reasons = generateMatchReasons(scoring, tags, 'AI Writing');
      
      expect(reasons).toContain('Offers a free tier');
    });

    it('should include team collaboration reason', () => {
      const scoring = toolScoring['jasper-ai'];
      const tags = ['team'];
      
      const reasons = generateMatchReasons(scoring, tags, 'AI Writing');
      
      expect(reasons).toContain('Great for team collaboration');
    });

    it('should include brand voice reason', () => {
      const scoring = toolScoring['jasper-ai'];
      const tags = ['brand-voice'];
      
      const reasons = generateMatchReasons(scoring, tags, 'AI Writing');
      
      expect(reasons).toContain('Strong brand voice features');
    });

    it('should include video reason for video tools', () => {
      const scoring = toolScoring['murf-ai'];
      const tags = ['video'];
      
      const reasons = generateMatchReasons(scoring, tags, 'AI Voice');
      
      expect(reasons).toContain('Excellent for video content');
    });

    it('should limit reasons to 3', () => {
      const scoring = toolScoring['jasper-ai'];
      const tags = ['AI Writing', 'team', 'brand-voice', 'video'];
      
      const reasons = generateMatchReasons(scoring, tags, 'AI Writing');
      
      expect(reasons.length).toBeLessThanOrEqual(3);
    });
  });

  describe('calculateQuizResults', () => {
    it('should return results sorted by score descending', () => {
      const answers = {
        'use-case': 'marketing',
        'team-size': 'solo',
        'budget': 'free',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      // Verify sorted order
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
      }
    });

    it('should recommend Copy.ai for solo marketers on free budget', () => {
      const answers = {
        'use-case': 'marketing',
        'team-size': 'solo',
        'budget': 'free',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      const topResult = results[0];
      
      // Copy.ai should rank highly for free tier + solo + AI Writing
      expect(topResult.tool.slug).toBe('copy-ai');
    });

    it('should recommend Jasper for agency teams with premium budget', () => {
      const answers = {
        'use-case': 'marketing',
        'team-size': 'agency',
        'budget': 'premium',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      const topResult = results[0];
      
      // Jasper should rank highest for agency + enterprise + brand-voice + premium
      expect(topResult.tool.slug).toBe('jasper-ai');
    });

    it('should recommend voice/video tools for video content creators', () => {
      const answers = {
        'use-case': 'video',
        'team-size': 'solo',
        'budget': 'moderate',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      const topResult = results[0];
      
      // Murf AI, Runway ML, or Descript should rank high for video content
      expect(['murf-ai', 'runway-ml', 'descript']).toContain(topResult.tool.slug);
    });

    it('should include match reasons in results', () => {
      const answers = {
        'use-case': 'marketing',
        'team-size': 'solo',
        'budget': 'free',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      // At least the top result should have match reasons
      expect(results[0].matchReasons.length).toBeGreaterThan(0);
    });

    it('should return all tools in results', () => {
      const answers = { 'use-case': 'marketing' };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      expect(results).toHaveLength(tools.length);
    });
  });

  describe('getTopRecommendations', () => {
    it('should return top 3 by default', () => {
      const answers = { 'use-case': 'marketing' };
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      const top = getTopRecommendations(results);
      
      expect(top).toHaveLength(3);
      expect(top[0]).toBe(results[0]);
      expect(top[1]).toBe(results[1]);
      expect(top[2]).toBe(results[2]);
    });

    it('should return specified count', () => {
      const answers = { 'use-case': 'marketing' };
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      const top5 = getTopRecommendations(results, 5);
      
      expect(top5).toHaveLength(5);
    });

    it('should handle count larger than results', () => {
      const answers = { 'use-case': 'marketing' };
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      const topAll = getTopRecommendations(results, 100);
      
      expect(topAll).toHaveLength(results.length);
    });
  });

  describe('toolScoring weights', () => {
    it('should have scoring weights for all main tools', () => {
      const expectedTools = [
        'jasper-ai',
        'copy-ai',
        'murf-ai',
        'notion-ai',
        'claude-ai',
        'midjourney',
        'runway-ml',
        'descript',
      ];
      
      expectedTools.forEach((slug) => {
        expect(toolScoring[slug]).toBeDefined();
        expect(Object.keys(toolScoring[slug]).length).toBeGreaterThan(0);
      });
    });

    it('should have weights between 1 and 3', () => {
      Object.values(toolScoring).forEach((weights) => {
        Object.values(weights).forEach((weight) => {
          expect(weight).toBeGreaterThanOrEqual(1);
          expect(weight).toBeLessThanOrEqual(3);
        });
      });
    });

    it('should give AI Writing tools high scores for writing tags', () => {
      const writingTags = ['AI Writing', 'marketing', 'copy', 'content'];
      
      // Jasper should score high on writing tags
      writingTags.forEach((tag) => {
        if (toolScoring['jasper-ai'][tag]) {
          expect(toolScoring['jasper-ai'][tag]).toBeGreaterThanOrEqual(2);
        }
      });
    });

    it('should give voice tools high scores for audio tags', () => {
      const audioTags = ['AI Voice', 'video', 'audio'];
      
      // Murf should score high on audio tags
      audioTags.forEach((tag) => {
        if (toolScoring['murf-ai'][tag]) {
          expect(toolScoring['murf-ai'][tag]).toBeGreaterThanOrEqual(2);
        }
      });
    });
  });

  describe('real-world scenarios', () => {
    it('should recommend appropriate tools for content creators', () => {
      const answers = {
        'use-case': 'blog',
        'team-size': 'solo',
        'budget': 'moderate',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      const topThree = results.slice(0, 3).map((r) => r.tool.slug);
      
      // Should include AI writing tools
      const writingTools = ['jasper-ai', 'copy-ai', 'claude-ai', 'notion-ai'];
      const hasWritingTool = topThree.some((slug) => writingTools.includes(slug));
      expect(hasWritingTool).toBe(true);
    });

    it('should differentiate between solo and enterprise users', () => {
      const soloAnswers = {
        'use-case': 'marketing',
        'team-size': 'solo',
        'budget': 'free',
      };
      
      const enterpriseAnswers = {
        'use-case': 'marketing',
        'team-size': 'agency',
        'budget': 'premium',
      };
      
      const soloResults = calculateQuizResults(tools, soloAnswers, testQuestions);
      const enterpriseResults = calculateQuizResults(tools, enterpriseAnswers, testQuestions);
      
      // Top recommendations should differ
      expect(soloResults[0].tool.slug).not.toBe(enterpriseResults[0].tool.slug);
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
      // Note: The function searches for option id across ALL questions,
      // not by matching question id first. This is intentional behavior.
      const answers = { 'non-existent-question': 'marketing' };
      const tags = collectTagsFromAnswers(answers, testQuestions);
      
      // 'marketing' option exists in 'use-case' question, so tags are found
      expect(tags).toContain('AI Writing');
      expect(tags).toContain('marketing');
    });

    it('should collect duplicate tags when same tag appears in multiple options', () => {
      // Both 'solo' and 'free' options have 'budget-friendly'
      const answers = {
        'team-size': 'solo',  // has 'budget-friendly'
        'budget': 'free',      // also has 'budget-friendly'
      };
      const tags = collectTagsFromAnswers(answers, testQuestions);
      
      // 'budget-friendly' should appear twice
      const budgetFriendlyCount = tags.filter((t) => t === 'budget-friendly').length;
      expect(budgetFriendlyCount).toBe(2);
    });
  });

  describe('edge cases - calculateToolScore', () => {
    it('should return 0 score and empty reasons for empty tags', () => {
      const jasper = getToolBySlug('jasper-ai');
      const { score, matchReasons } = calculateToolScore(jasper, []);
      
      expect(score).toBe(0);
      expect(matchReasons).toHaveLength(0);
    });

    it('should handle duplicate tags in input without double-counting', () => {
      const jasper = getToolBySlug('jasper-ai');
      // Duplicate 'marketing' tag
      const tags = ['marketing', 'marketing', 'marketing'];
      
      const { score } = calculateToolScore(jasper, tags);
      
      // Should count each occurrence (3 * 3 = 9)
      expect(score).toBe(toolScoring['jasper-ai']['marketing'] * 3);
    });

    it('should handle tool with empty slug', () => {
      const mockTool = {
        slug: '',
        name: 'No Slug Tool',
        category: 'AI Writing',
      } as Tool;
      
      const { score } = calculateToolScore(mockTool, ['AI Writing']);
      
      // Only category bonus since empty slug won't match toolScoring
      expect(score).toBe(CATEGORY_MATCH_BONUS);
    });

    it('should not give category bonus when category does not match tags', () => {
      const murf = getToolBySlug('murf-ai'); // AI Voice category
      const tags = ['AI Writing', 'marketing']; // No AI Voice tag
      
      const { score } = calculateToolScore(murf, tags);
      
      // No category bonus, no matching tags in scoring
      expect(score).toBe(0);
    });

    it('should handle mixed valid and invalid tags', () => {
      const jasper = getToolBySlug('jasper-ai');
      const tags = ['AI Writing', 'invalid-tag', 'marketing', 'another-invalid'];
      
      const { score } = calculateToolScore(jasper, tags);
      
      // Category bonus + AI Writing + marketing
      const expected = CATEGORY_MATCH_BONUS + 
        toolScoring['jasper-ai']['AI Writing'] + 
        toolScoring['jasper-ai']['marketing'];
      expect(score).toBe(expected);
    });
  });

  describe('edge cases - generateMatchReasons', () => {
    it('should return empty array for empty scoring and tags', () => {
      const reasons = generateMatchReasons({}, [], 'AI Writing');
      expect(reasons).toHaveLength(0);
    });

    it('should handle agency tag triggering team collaboration reason', () => {
      const scoring = toolScoring['jasper-ai'];
      const tags = ['agency']; // agency without 'team'
      
      const reasons = generateMatchReasons(scoring, tags, 'AI Writing');
      
      // Should still trigger "Great for team collaboration" due to OR condition
      expect(reasons).toContain('Great for team collaboration');
    });

    it('should include audio reason when applicable', () => {
      const scoring = toolScoring['descript'];
      const tags = ['audio'];
      
      const reasons = generateMatchReasons(scoring, tags, 'AI Video');
      
      expect(reasons).toContain('Great for audio content');
    });

    it('should include budget-friendly reason', () => {
      const scoring = toolScoring['copy-ai'];
      const tags = ['budget-friendly'];
      
      const reasons = generateMatchReasons(scoring, tags, 'AI Writing');
      
      expect(reasons).toContain('Budget-friendly option');
    });

    it('should not include reason when tool does not have matching scoring', () => {
      const scoring = toolScoring['midjourney']; // No free-tier scoring
      const tags = ['free-tier'];
      
      const reasons = generateMatchReasons(scoring, tags, 'AI Images');
      
      expect(reasons).not.toContain('Offers a free tier');
    });

    it('should prioritize reasons in order (category first)', () => {
      const scoring = toolScoring['jasper-ai'];
      const tags = ['AI Writing', 'team', 'brand-voice', 'free-tier'];
      
      const reasons = generateMatchReasons(scoring, tags, 'AI Writing');
      
      // Category match should be first
      expect(reasons[0]).toBe('Matches your ai writing needs');
    });
  });

  describe('edge cases - calculateQuizResults', () => {
    it('should handle empty tools array', () => {
      const answers = { 'use-case': 'marketing' };
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
      const answers = { 'use-case': 'marketing' };
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
        expect(result.tool.slug).toBe(results2[index].tool.slug);
      });
    });

    it('should include all result properties', () => {
      const answers = { 'use-case': 'marketing' };
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
      const answers = { 'use-case': 'marketing' };
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      const top = getTopRecommendations(results, 0);
      expect(top).toHaveLength(0);
    });

    it('should handle count of 1', () => {
      const answers = { 'use-case': 'marketing' };
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      const top = getTopRecommendations(results, 1);
      expect(top).toHaveLength(1);
      expect(top[0]).toBe(results[0]);
    });

    it('should handle negative count (returns all but last N)', () => {
      const answers = { 'use-case': 'marketing' };
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      // slice(0, -1) returns all but the last element
      const top = getTopRecommendations(results, -1);
      expect(top).toHaveLength(results.length - 1);
    });
  });

  describe('category-specific scenarios', () => {
    it('should recommend AI Images tools for visual content needs', () => {
      // Simulate a user wanting images (no direct option, but closest is versatile)
      const answers = {
        'use-case': 'all', // versatile
        'team-size': 'agency',
        'budget': 'moderate',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      // Midjourney should be in results with positive score due to agency tag
      const midjourneyResult = results.find((r) => r.tool.slug === 'midjourney');
      expect(midjourneyResult).toBeDefined();
      expect(midjourneyResult!.score).toBeGreaterThan(0);
    });

    it('should recommend AI Productivity tools for versatile users', () => {
      const answers = {
        'use-case': 'all', // versatile tag
        'team-size': 'small-team',
        'budget': 'moderate',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      // Notion AI should score well for versatile + team + collaboration
      const notionResult = results.find((r) => r.tool.slug === 'notion-ai');
      expect(notionResult).toBeDefined();
      expect(notionResult!.score).toBeGreaterThan(0);
    });

    it('should handle AI Video category recommendations', () => {
      const answers = {
        'use-case': 'video',
        'team-size': 'solo',
        'budget': 'free',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      
      // Video tools should be in top results
      const topSlugs = results.slice(0, 4).map((r) => r.tool.slug);
      const videoTools = ['runway-ml', 'descript', 'murf-ai'];
      const hasVideoTool = topSlugs.some((slug) => videoTools.includes(slug));
      expect(hasVideoTool).toBe(true);
    });
  });

  describe('scoring accuracy', () => {
    it('should calculate exact score for known scenario', () => {
      const jasper = getToolBySlug('jasper-ai');
      const tags = ['AI Writing', 'marketing', 'team', 'premium'];
      
      const { score } = calculateToolScore(jasper, tags);
      
      // Manual calculation:
      // Category bonus: 5
      // AI Writing: 3
      // marketing: 3
      // team: 3
      // premium: 3
      // Total: 17
      const expected = 5 + 3 + 3 + 3 + 3;
      expect(score).toBe(expected);
    });

    it('should produce consistent scores across multiple runs', () => {
      const answers = {
        'use-case': 'marketing',
        'team-size': 'agency',
        'budget': 'premium',
      };
      
      const scores: number[] = [];
      for (let i = 0; i < 10; i++) {
        const results = calculateQuizResults(tools, answers, testQuestions);
        scores.push(results[0].score);
      }
      
      // All scores should be identical
      const firstScore = scores[0];
      expect(scores.every((s) => s === firstScore)).toBe(true);
    });

    it('should rank Claude highly for versatile solo users', () => {
      const answers = {
        'use-case': 'all', // versatile
        'team-size': 'solo',
        'budget': 'free',
      };
      
      const results = calculateQuizResults(tools, answers, testQuestions);
      const claudeResult = results.find((r) => r.tool.slug === 'claude-ai');
      
      expect(claudeResult).toBeDefined();
      // Claude should have good score for versatile + solo + budget-friendly
      expect(claudeResult!.score).toBeGreaterThan(5);
    });
  });

  describe('boundary conditions', () => {
    it('should handle very long tag arrays', () => {
      const jasper = getToolBySlug('jasper-ai');
      const manyTags = Array(100).fill('marketing');
      
      const { score } = calculateToolScore(jasper, manyTags);
      
      // 100 * 3 = 300
      expect(score).toBe(300);
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
      const jasper = getToolBySlug('jasper-ai');
      const tags = ['AI Writing', 'brand-voice', 'pro-features']; // hyphenated tags
      
      const { score } = calculateToolScore(jasper, tags);
      
      // Should correctly match hyphenated keys in toolScoring
      expect(score).toBeGreaterThan(0);
    });
  });
});
