import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Create hoisted mock functions
const { mockMkdir, mockReadFile, mockWriteFile, mockUnlink } = vi.hoisted(() => ({
  mockMkdir: vi.fn().mockResolvedValue(undefined),
  mockReadFile: vi.fn(),
  mockWriteFile: vi.fn().mockResolvedValue(undefined),
  mockUnlink: vi.fn().mockResolvedValue(undefined),
}));

// Mock the fs module
vi.mock('fs', () => ({
  default: {
    promises: {
      mkdir: mockMkdir,
      readFile: mockReadFile,
      writeFile: mockWriteFile,
      unlink: mockUnlink,
    },
  },
  promises: {
    mkdir: mockMkdir,
    readFile: mockReadFile,
    writeFile: mockWriteFile,
    unlink: mockUnlink,
  },
}));

import {
  createDecision,
  getDecision,
  getDecisions,
  startMeasuring,
  recordOutcome,
  deleteDecision,
  getDecisionStats,
  getLearnings,
  CORE_VALUE_LABELS,
  DECISION_PRINCIPLE_LABELS,
  BOUNDARY_CONSTRAINT_LABELS,
  type CreateDecisionInput,
  type CoreValue,
  type DecisionPrinciple,
  type BoundaryConstraint,
} from '@/lib/decision-log';

// In-memory storage for tests
let mockStorage: Record<string, string> = {};
let mockIndex: string[] = [];

describe('Decision Log Utility', () => {
  beforeEach(() => {
    // Reset mock storage
    mockStorage = {};
    mockIndex = [];
    
    // Setup fs mocks
    mockReadFile.mockImplementation(async (filePath: string) => {
      const pathStr = filePath.toString();
      if (pathStr.endsWith('index.json')) {
        return JSON.stringify(mockIndex);
      }
      const id = pathStr.split('/').pop()?.replace('.json', '');
      if (id && mockStorage[id]) {
        return mockStorage[id];
      }
      throw new Error('File not found');
    });
    
    mockWriteFile.mockImplementation(async (filePath: string, data: string) => {
      const pathStr = filePath.toString();
      if (pathStr.endsWith('index.json')) {
        mockIndex = JSON.parse(data);
      } else {
        const id = pathStr.split('/').pop()?.replace('.json', '');
        if (id) {
          mockStorage[id] = data;
          // Don't update index here - let the actual code handle it via writeIndex
        }
      }
    });
    
    mockUnlink.mockImplementation(async (filePath: string) => {
      const pathStr = filePath.toString();
      const id = pathStr.split('/').pop()?.replace('.json', '');
      if (id) {
        delete mockStorage[id];
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const sampleInput: CreateDecisionInput = {
    type: 'experiment',
    title: 'CTA Button Color Test',
    description: 'Testing green vs blue CTA buttons on review pages',
    philosophy: {
      coreValue: 'self-adaptation',
      principle: 'impact-leverage',
    },
    hypothesis: 'Green buttons will increase click-through by 15%',
    metrics: ['cta_clicks', 'conversion_rate'],
    successCriteria: '10% improvement in CTR with statistical significance',
    tags: ['a/b-test', 'cta', 'conversion'],
  };

  describe('createDecision', () => {
    it('should create a new decision with generated ID and timestamp', async () => {
      const decision = await createDecision(sampleInput);
      
      expect(decision.id).toMatch(/^dec_[a-z0-9]+_[a-z0-9]+$/);
      expect(decision.timestamp).toBeDefined();
      expect(new Date(decision.timestamp).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should set initial status to pending', async () => {
      const decision = await createDecision(sampleInput);
      expect(decision.status).toBe('pending');
    });

    it('should include all input fields', async () => {
      const decision = await createDecision(sampleInput);
      
      expect(decision.type).toBe(sampleInput.type);
      expect(decision.title).toBe(sampleInput.title);
      expect(decision.description).toBe(sampleInput.description);
      expect(decision.philosophy).toEqual(sampleInput.philosophy);
      expect(decision.hypothesis).toBe(sampleInput.hypothesis);
      expect(decision.metrics).toEqual(sampleInput.metrics);
      expect(decision.successCriteria).toBe(sampleInput.successCriteria);
      expect(decision.tags).toEqual(sampleInput.tags);
    });

    it('should not include outcome initially', async () => {
      const decision = await createDecision(sampleInput);
      expect(decision.outcome).toBeUndefined();
    });

    it('should handle optional tags', async () => {
      const inputWithoutTags = { ...sampleInput };
      delete inputWithoutTags.tags;
      
      const decision = await createDecision(inputWithoutTags);
      expect(decision.tags).toBeUndefined();
    });

    it('should handle optional boundary constraint', async () => {
      const inputWithConstraint: CreateDecisionInput = {
        ...sampleInput,
        philosophy: {
          ...sampleInput.philosophy,
          constraint: 'efficiency',
        },
      };
      
      const decision = await createDecision(inputWithConstraint);
      expect(decision.philosophy.constraint).toBe('efficiency');
    });
  });

  describe('getDecision', () => {
    it('should retrieve a decision by ID', async () => {
      const created = await createDecision(sampleInput);
      const retrieved = await getDecision(created.id);
      
      expect(retrieved).toEqual(created);
    });

    it('should return null for non-existent ID', async () => {
      const result = await getDecision('dec_nonexistent_123');
      expect(result).toBeNull();
    });
  });

  describe('getDecisions', () => {
    beforeEach(async () => {
      // Create multiple decisions for filtering tests
      await createDecision({
        ...sampleInput,
        type: 'experiment',
        title: 'Experiment 1',
        philosophy: { coreValue: 'self-adaptation', principle: 'impact-leverage' },
        tags: ['a/b-test'],
      });
      
      await createDecision({
        ...sampleInput,
        type: 'feature',
        title: 'Feature 1',
        philosophy: { coreValue: 'reusability', principle: 'automation-first' },
        tags: ['ui'],
      });
      
      await createDecision({
        ...sampleInput,
        type: 'content',
        title: 'Content 1',
        philosophy: { coreValue: 'value-centric', principle: 'enduring-practice' },
        tags: ['seo'],
      });
    });

    it('should return all decisions when no filter provided', async () => {
      const decisions = await getDecisions();
      expect(decisions).toHaveLength(3);
    });

    it('should filter by type', async () => {
      const experiments = await getDecisions({ type: 'experiment' });
      expect(experiments).toHaveLength(1);
      expect(experiments[0]!.type).toBe('experiment');
    });

    it('should filter by status', async () => {
      const pending = await getDecisions({ status: 'pending' });
      expect(pending).toHaveLength(3);
    });

    it('should filter by core value', async () => {
      const reusability = await getDecisions({ coreValue: 'reusability' });
      expect(reusability).toHaveLength(1);
      expect(reusability[0]!.philosophy.coreValue).toBe('reusability');
    });

    it('should filter by principle', async () => {
      const automationFirst = await getDecisions({ principle: 'automation-first' });
      expect(automationFirst).toHaveLength(1);
      expect(automationFirst[0]!.philosophy.principle).toBe('automation-first');
    });

    it('should filter by tags', async () => {
      const abTests = await getDecisions({ tags: ['a/b-test'] });
      expect(abTests).toHaveLength(1);
      expect(abTests[0]!.tags).toContain('a/b-test');
    });

    it('should handle multiple filters', async () => {
      const filtered = await getDecisions({
        type: 'experiment',
        status: 'pending',
      });
      expect(filtered).toHaveLength(1);
    });

    it('should return empty array when no matches', async () => {
      const none = await getDecisions({ type: 'optimization' });
      expect(none).toHaveLength(0);
    });
  });

  describe('startMeasuring', () => {
    it('should update status to measuring', async () => {
      const created = await createDecision(sampleInput);
      const updated = await startMeasuring(created.id);
      
      expect(updated?.status).toBe('measuring');
    });

    it('should return null for non-existent ID', async () => {
      const result = await startMeasuring('dec_nonexistent_123');
      expect(result).toBeNull();
    });
  });

  describe('recordOutcome', () => {
    it('should record outcome and set status to completed', async () => {
      const created = await createDecision(sampleInput);
      
      const updated = await recordOutcome(created.id, {
        result: 'success',
        metrics: { cta_clicks: 1250, conversion_rate: 0.12 },
        learnings: ['Green buttons outperformed by 18.5%'],
        nextActions: ['Roll out green buttons site-wide'],
      });
      
      expect(updated?.status).toBe('completed');
      expect(updated?.outcome?.result).toBe('success');
      expect(updated?.outcome?.metrics.cta_clicks).toBe(1250);
      expect(updated?.outcome?.learnings).toContain('Green buttons outperformed by 18.5%');
      expect(updated?.outcome?.measuredAt).toBeDefined();
    });

    it('should return null for non-existent ID', async () => {
      const result = await recordOutcome('dec_nonexistent_123', {
        result: 'failure',
        metrics: {},
        learnings: [],
        nextActions: [],
      });
      expect(result).toBeNull();
    });

    it('should handle partial outcome', async () => {
      const created = await createDecision(sampleInput);
      
      const updated = await recordOutcome(created.id, {
        result: 'partial',
        metrics: { conversion_rate: 0.08 },
        learnings: ['Inconclusive results'],
        nextActions: ['Extend test duration'],
      });
      
      expect(updated?.outcome?.result).toBe('partial');
    });
  });

  describe('deleteDecision', () => {
    it('should delete a decision', async () => {
      const created = await createDecision(sampleInput);
      const deleted = await deleteDecision(created.id);
      
      expect(deleted).toBe(true);
      
      const retrieved = await getDecision(created.id);
      expect(retrieved).toBeNull();
    });

    it('should return false for non-existent ID', async () => {
      mockUnlink.mockRejectedValueOnce(new Error('File not found'));
      const result = await deleteDecision('dec_nonexistent_123');
      expect(result).toBe(false);
    });
  });

  describe('getDecisionStats', () => {
    it('should calculate statistics correctly', async () => {
      // Create decisions with different types and outcomes
      const d1 = await createDecision({ ...sampleInput, type: 'experiment' });
      const d2 = await createDecision({ ...sampleInput, type: 'feature' });
      await createDecision({ ...sampleInput, type: 'experiment' });
      
      // Record outcomes
      await recordOutcome(d1.id, {
        result: 'success',
        metrics: {},
        learnings: [],
        nextActions: [],
      });
      
      await recordOutcome(d2.id, {
        result: 'failure',
        metrics: {},
        learnings: [],
        nextActions: [],
      });
      
      const stats = await getDecisionStats();
      
      expect(stats.total).toBe(3);
      expect(stats.byStatus.completed).toBe(2);
      expect(stats.byStatus.pending).toBe(1);
      expect(stats.byType.experiment).toBe(2);
      expect(stats.byType.feature).toBe(1);
      expect(stats.byOutcome.success).toBe(1);
      expect(stats.byOutcome.failure).toBe(1);
      expect(stats.successRate).toBe(50);
    });

    it('should handle empty decisions', async () => {
      const stats = await getDecisionStats();
      
      expect(stats.total).toBe(0);
      expect(stats.successRate).toBe(0);
    });
  });

  describe('getLearnings', () => {
    it('should categorize learnings by outcome', async () => {
      const d1 = await createDecision({ ...sampleInput, title: 'Success Test' });
      const d2 = await createDecision({ ...sampleInput, title: 'Failure Test' });
      
      await recordOutcome(d1.id, {
        result: 'success',
        metrics: {},
        learnings: ['This worked great'],
        nextActions: [],
      });
      
      await recordOutcome(d2.id, {
        result: 'failure',
        metrics: {},
        learnings: ['This did not work'],
        nextActions: [],
      });
      
      const learnings = await getLearnings();
      
      expect(learnings.successes).toHaveLength(1);
      expect(learnings.successes[0]!.title).toBe('Success Test');
      expect(learnings.successes[0]!.learnings).toContain('This worked great');
      
      expect(learnings.failures).toHaveLength(1);
      expect(learnings.failures[0]!.title).toBe('Failure Test');
    });
  });

  describe('Type definitions', () => {
    it('should have all core value labels', () => {
      const coreValues: CoreValue[] = [
        'ai-empowerment',
        'reusability',
        'self-adaptation',
        'value-centric',
      ];
      
      coreValues.forEach(value => {
        expect(CORE_VALUE_LABELS[value]).toBeDefined();
        expect(typeof CORE_VALUE_LABELS[value]).toBe('string');
      });
    });

    it('should have all decision principle labels', () => {
      const principles: DecisionPrinciple[] = [
        'automation-first',
        'impact-leverage',
        'dynamic-adaptation',
        'excellence-benchmark',
        'enduring-practice',
      ];
      
      principles.forEach(principle => {
        expect(DECISION_PRINCIPLE_LABELS[principle]).toBeDefined();
      });
    });

    it('should have all boundary constraint labels', () => {
      const constraints: BoundaryConstraint[] = [
        'efficiency',
        'progressive-autonomy',
        'risk-integrity',
        'modular-integrity',
      ];
      
      constraints.forEach(constraint => {
        expect(BOUNDARY_CONSTRAINT_LABELS[constraint]).toBeDefined();
      });
    });
  });

  describe('Decision types', () => {
    it('should accept all valid decision types', async () => {
      const types = ['feature', 'content', 'optimization', 'experiment'] as const;
      
      for (const type of types) {
        const decision = await createDecision({ ...sampleInput, type });
        expect(decision.type).toBe(type);
      }
    });
  });
});
