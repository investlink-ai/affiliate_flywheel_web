/**
 * Decision Log Utility
 * 
 * Implements the Progress Tracking Schema from system_design.md section 11.4.
 * Records decisions, hypotheses, and outcomes for learning infrastructure.
 * 
 * Storage: JSON files in /logs/decisions/ (gitignored)
 * 
 * @module lib/decision-log
 */

import { promises as fs } from 'fs';
import path from 'path';

// ============================================================================
// Type Definitions (from philosophy_framework.md)
// ============================================================================

/**
 * Core Values - Foundational beliefs that anchor the system
 */
export type CoreValue =
  | 'ai-empowerment'      // AI Empowerment & Human Augmentation
  | 'reusability'         // Reusability & Leverage
  | 'self-adaptation'     // Self-Adaptation & Continuous Improvement
  | 'value-centric';      // Value-Centric & Sustainable Growth

/**
 * Decision Principles - Judgment guidelines for evaluating opportunities
 */
export type DecisionPrinciple =
  | 'automation-first'    // Automation Feasibility First
  | 'impact-leverage'     // Impact & Leverage Prioritization
  | 'dynamic-adaptation'  // Dynamic Adaptation & Opportunity Alignment
  | 'excellence-benchmark'// Excellence Benchmarking
  | 'enduring-practice';  // Enduring Practice Alignment

/**
 * Boundary Constraints - Non-negotiable guardrails
 */
export type BoundaryConstraint =
  | 'efficiency'          // Efficiency & Resource Discipline
  | 'progressive-autonomy'// Progressive Autonomy
  | 'risk-integrity'      // Risk & Ethical Integrity
  | 'modular-integrity';  // Modular Integrity

/**
 * Decision types
 */
export type DecisionType = 'feature' | 'content' | 'optimization' | 'experiment';

/**
 * Outcome result status
 */
export type OutcomeResult = 'success' | 'partial' | 'failure';

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Philosophy alignment for a decision
 */
export interface PhilosophyAlignment {
  coreValue: CoreValue;
  principle: DecisionPrinciple;
  constraint?: BoundaryConstraint;
}

/**
 * Outcome data (filled after measurement period)
 */
export interface DecisionOutcome {
  result: OutcomeResult;
  measuredAt: string;
  metrics: Record<string, number>;
  learnings: string[];
  nextActions: string[];
}

/**
 * Complete decision log entry
 */
export interface DecisionLog {
  id: string;
  timestamp: string;
  
  // Decision context
  type: DecisionType;
  title: string;
  description: string;
  
  // Philosophy alignment
  philosophy: PhilosophyAlignment;
  
  // Expected outcome
  hypothesis: string;
  metrics: string[];
  successCriteria: string;
  
  // Actual outcome (filled after measurement)
  outcome?: DecisionOutcome;
  
  // Metadata
  status: 'pending' | 'measuring' | 'completed';
  tags?: string[];
}

/**
 * Input for creating a new decision
 */
export interface CreateDecisionInput {
  type: DecisionType;
  title: string;
  description: string;
  philosophy: PhilosophyAlignment;
  hypothesis: string;
  metrics: string[];
  successCriteria: string;
  tags?: string[];
}

/**
 * Input for recording an outcome
 */
export interface RecordOutcomeInput {
  result: OutcomeResult;
  metrics: Record<string, number>;
  learnings: string[];
  nextActions: string[];
}

/**
 * Filter options for querying decisions
 */
export interface DecisionFilter {
  type?: DecisionType;
  status?: DecisionLog['status'];
  coreValue?: CoreValue;
  principle?: DecisionPrinciple;
  tags?: string[];
  fromDate?: string;
  toDate?: string;
}

// ============================================================================
// Configuration
// ============================================================================

const LOGS_DIR = path.join(process.cwd(), 'logs', 'decisions');
const INDEX_FILE = path.join(LOGS_DIR, 'index.json');

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a unique ID for a decision
 */
function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `dec_${timestamp}_${random}`;
}

/**
 * Get the file path for a decision
 */
function getDecisionPath(id: string): string {
  return path.join(LOGS_DIR, `${id}.json`);
}

/**
 * Ensure the logs directory exists
 */
async function ensureLogsDir(): Promise<void> {
  try {
    await fs.mkdir(LOGS_DIR, { recursive: true });
  } catch {
    // Directory already exists
  }
}

/**
 * Read the decision index
 */
async function readIndex(): Promise<string[]> {
  try {
    const data = await fs.readFile(INDEX_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Write the decision index
 */
async function writeIndex(ids: string[]): Promise<void> {
  await fs.writeFile(INDEX_FILE, JSON.stringify(ids, null, 2));
}

// ============================================================================
// Core API Functions
// ============================================================================

/**
 * Create a new decision log entry
 * 
 * @param input - Decision details
 * @returns The created decision log entry
 * 
 * @example
 * ```ts
 * const decision = await createDecision({
 *   type: 'experiment',
 *   title: 'CTA Button Color Test',
 *   description: 'Testing green vs blue CTA buttons on review pages',
 *   philosophy: {
 *     coreValue: 'self-adaptation',
 *     principle: 'impact-leverage',
 *   },
 *   hypothesis: 'Green buttons will increase click-through by 15%',
 *   metrics: ['cta_clicks', 'conversion_rate'],
 *   successCriteria: '10% improvement in CTR with statistical significance',
 *   tags: ['a/b-test', 'cta', 'conversion'],
 * });
 * ```
 */
export async function createDecision(input: CreateDecisionInput): Promise<DecisionLog> {
  await ensureLogsDir();
  
  const decision: DecisionLog = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    type: input.type,
    title: input.title,
    description: input.description,
    philosophy: input.philosophy,
    hypothesis: input.hypothesis,
    metrics: input.metrics,
    successCriteria: input.successCriteria,
    status: 'pending',
    tags: input.tags,
  };
  
  // Save decision file
  await fs.writeFile(
    getDecisionPath(decision.id),
    JSON.stringify(decision, null, 2)
  );
  
  // Update index
  const index = await readIndex();
  index.unshift(decision.id); // Add to beginning (most recent first)
  await writeIndex(index);
  
  return decision;
}

/**
 * Get a decision by ID
 * 
 * @param id - Decision ID
 * @returns The decision log entry or null if not found
 */
export async function getDecision(id: string): Promise<DecisionLog | null> {
  try {
    const data = await fs.readFile(getDecisionPath(id), 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Get all decisions, optionally filtered
 * 
 * @param filter - Optional filter criteria
 * @returns Array of matching decision log entries
 * 
 * @example
 * ```ts
 * // Get all pending experiments
 * const experiments = await getDecisions({
 *   type: 'experiment',
 *   status: 'pending',
 * });
 * 
 * // Get decisions for a specific core value
 * const adaptationDecisions = await getDecisions({
 *   coreValue: 'self-adaptation',
 * });
 * ```
 */
export async function getDecisions(filter?: DecisionFilter): Promise<DecisionLog[]> {
  const index = await readIndex();
  const decisions: DecisionLog[] = [];
  
  for (const id of index) {
    const decision = await getDecision(id);
    if (decision && matchesFilter(decision, filter)) {
      decisions.push(decision);
    }
  }
  
  return decisions;
}

/**
 * Check if a decision matches the filter criteria
 */
function matchesFilter(decision: DecisionLog, filter?: DecisionFilter): boolean {
  if (!filter) return true;
  
  if (filter.type && decision.type !== filter.type) return false;
  if (filter.status && decision.status !== filter.status) return false;
  if (filter.coreValue && decision.philosophy.coreValue !== filter.coreValue) return false;
  if (filter.principle && decision.philosophy.principle !== filter.principle) return false;
  
  if (filter.tags && filter.tags.length > 0) {
    const hasMatchingTag = filter.tags.some(tag => decision.tags?.includes(tag));
    if (!hasMatchingTag) return false;
  }
  
  if (filter.fromDate && decision.timestamp < filter.fromDate) return false;
  if (filter.toDate && decision.timestamp > filter.toDate) return false;
  
  return true;
}

/**
 * Update a decision's status to 'measuring'
 * Call this when starting to collect outcome data
 * 
 * @param id - Decision ID
 * @returns Updated decision or null if not found
 */
export async function startMeasuring(id: string): Promise<DecisionLog | null> {
  const decision = await getDecision(id);
  if (!decision) return null;
  
  decision.status = 'measuring';
  
  await fs.writeFile(
    getDecisionPath(id),
    JSON.stringify(decision, null, 2)
  );
  
  return decision;
}

/**
 * Record the outcome of a decision
 * 
 * @param id - Decision ID
 * @param outcome - Outcome data
 * @returns Updated decision or null if not found
 * 
 * @example
 * ```ts
 * await recordOutcome('dec_abc123', {
 *   result: 'success',
 *   metrics: {
 *     cta_clicks: 1250,
 *     conversion_rate: 0.12,
 *     improvement_percent: 18.5,
 *   },
 *   learnings: [
 *     'Green buttons outperformed by 18.5%',
 *     'Effect stronger on mobile devices',
 *   ],
 *   nextActions: [
 *     'Roll out green buttons site-wide',
 *     'Test button size variations next',
 *   ],
 * });
 * ```
 */
export async function recordOutcome(
  id: string,
  outcome: RecordOutcomeInput
): Promise<DecisionLog | null> {
  const decision = await getDecision(id);
  if (!decision) return null;
  
  decision.status = 'completed';
  decision.outcome = {
    ...outcome,
    measuredAt: new Date().toISOString(),
  };
  
  await fs.writeFile(
    getDecisionPath(id),
    JSON.stringify(decision, null, 2)
  );
  
  return decision;
}

/**
 * Delete a decision
 * 
 * @param id - Decision ID
 * @returns true if deleted, false if not found
 */
export async function deleteDecision(id: string): Promise<boolean> {
  try {
    await fs.unlink(getDecisionPath(id));
    
    // Update index
    const index = await readIndex();
    const newIndex = index.filter(i => i !== id);
    await writeIndex(newIndex);
    
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// Analytics & Reporting Functions
// ============================================================================

/**
 * Get summary statistics for decisions
 */
export async function getDecisionStats(): Promise<{
  total: number;
  byStatus: Record<DecisionLog['status'], number>;
  byType: Record<DecisionType, number>;
  byOutcome: Record<OutcomeResult, number>;
  successRate: number;
}> {
  const decisions = await getDecisions();
  
  const byStatus: Record<DecisionLog['status'], number> = {
    pending: 0,
    measuring: 0,
    completed: 0,
  };
  
  const byType: Record<DecisionType, number> = {
    feature: 0,
    content: 0,
    optimization: 0,
    experiment: 0,
  };
  
  const byOutcome: Record<OutcomeResult, number> = {
    success: 0,
    partial: 0,
    failure: 0,
  };
  
  for (const decision of decisions) {
    byStatus[decision.status]++;
    byType[decision.type]++;
    
    if (decision.outcome) {
      byOutcome[decision.outcome.result]++;
    }
  }
  
  const completed = byStatus.completed;
  const successRate = completed > 0 
    ? (byOutcome.success / completed) * 100 
    : 0;
  
  return {
    total: decisions.length,
    byStatus,
    byType,
    byOutcome,
    successRate: Math.round(successRate * 10) / 10,
  };
}

/**
 * Get decisions that need outcome recording
 * (Status is 'measuring' or 'pending' and older than specified days)
 */
export async function getPendingOutcomes(
  daysOld: number = 14
): Promise<DecisionLog[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const decisions = await getDecisions({
    status: 'measuring',
  });
  
  // Also get pending decisions older than cutoff
  const pendingOld = await getDecisions({
    status: 'pending',
    toDate: cutoffDate.toISOString(),
  });
  
  return [...decisions, ...pendingOld];
}

/**
 * Get learnings from completed decisions
 */
export async function getLearnings(): Promise<{
  successes: Array<{ title: string; learnings: string[] }>;
  failures: Array<{ title: string; learnings: string[] }>;
}> {
  const completed = await getDecisions({ status: 'completed' });
  
  const successes: Array<{ title: string; learnings: string[] }> = [];
  const failures: Array<{ title: string; learnings: string[] }> = [];
  
  for (const decision of completed) {
    if (!decision.outcome) continue;
    
    const entry = {
      title: decision.title,
      learnings: decision.outcome.learnings,
    };
    
    if (decision.outcome.result === 'success') {
      successes.push(entry);
    } else if (decision.outcome.result === 'failure') {
      failures.push(entry);
    }
  }
  
  return { successes, failures };
}

// ============================================================================
// Human-Readable Mappings
// ============================================================================

export const CORE_VALUE_LABELS: Record<CoreValue, string> = {
  'ai-empowerment': 'AI Empowerment & Human Augmentation',
  'reusability': 'Reusability & Leverage',
  'self-adaptation': 'Self-Adaptation & Continuous Improvement',
  'value-centric': 'Value-Centric & Sustainable Growth',
};

export const DECISION_PRINCIPLE_LABELS: Record<DecisionPrinciple, string> = {
  'automation-first': 'Automation Feasibility First',
  'impact-leverage': 'Impact & Leverage Prioritization',
  'dynamic-adaptation': 'Dynamic Adaptation & Opportunity Alignment',
  'excellence-benchmark': 'Excellence Benchmarking',
  'enduring-practice': 'Enduring Practice Alignment',
};

export const BOUNDARY_CONSTRAINT_LABELS: Record<BoundaryConstraint, string> = {
  'efficiency': 'Efficiency & Resource Discipline',
  'progressive-autonomy': 'Progressive Autonomy',
  'risk-integrity': 'Risk & Ethical Integrity',
  'modular-integrity': 'Modular Integrity',
};
