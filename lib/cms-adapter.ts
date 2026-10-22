/**
 * CMS Adapter Pattern
 * 
 * This module provides an abstraction layer for tool data that can switch
 * between local data.ts and future headless CMS (Sanity, Contentful, etc.)
 * 
 * Usage:
 *   import { toolRepository } from '@/lib/cms-adapter';
 *   const tools = await toolRepository.getAll();
 *   const tool = await toolRepository.getBySlug('jasper-ai');
 */

import {
  tools as localTools,
  type Tool,
  type Category,
  type UserType,
} from './data';

/**
 * Filter options for querying tools
 */
export interface ToolFilterOptions {
  /** Filter by category */
  category?: Category | string;
  /** Filter by user type recommendation */
  userType?: UserType;
  /** Search query for name/description/features */
  searchQuery?: string;
  /** Only return newly added tools */
  isNew?: boolean;
  /** Limit number of results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Sort field */
  sortBy?: 'rating' | 'name' | 'lastUpdated';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Repository interface for tool data
 * Implement this interface for different data sources (local, Sanity, Contentful, etc.)
 */
export interface ToolRepository {
  /**
   * Get all tools with optional filtering
   */
  getAll(options?: ToolFilterOptions): Promise<Tool[]>;

  /**
   * Get a single tool by slug
   */
  getBySlug(slug: string): Promise<Tool | null>;

  /**
   * Get tools by category
   */
  getByCategory(category: Category | string): Promise<Tool[]>;

  /**
   * Get all unique categories
   */
  getCategories(): Promise<string[]>;

  /**
   * Get all tool slugs (for static generation)
   */
  getAllSlugs(): Promise<string[]>;

  /**
   * Get featured tools (for homepage, etc.)
   */
  getFeatured(count?: number): Promise<Tool[]>;

  /**
   * Get recently updated tools
   */
  getRecentlyUpdated(count?: number): Promise<Tool[]>;

  /**
   * Get new tools (isNew flag)
   */
  getNew(): Promise<Tool[]>;

  /**
   * Get tools recommended for a user type
   */
  getByUserType(userType: UserType): Promise<Tool[]>;

  /**
   * Get related tools (same category, excluding current)
   */
  getRelated(slug: string, count?: number): Promise<Tool[]>;

  /**
   * Search tools by query
   */
  search(query: string): Promise<Tool[]>;
}

/**
 * Local implementation using data.ts
 * This is the default implementation that reads from static data
 */
export class LocalToolRepository implements ToolRepository {
  private tools: Tool[];

  constructor(tools: Tool[] = localTools) {
    this.tools = tools;
  }

  async getAll(options?: ToolFilterOptions): Promise<Tool[]> {
    let result = [...this.tools];

    // Apply filters
    if (options?.category && options.category !== 'All') {
      result = result.filter((t) => t.category === options.category);
    }

    if (options?.userType) {
      result = result.filter((t) => t.recommendations?.[options.userType!]);
    }

    if (options?.searchQuery) {
      const query = options.searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.tagline.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.features.some((f) => f.toLowerCase().includes(query))
      );
    }

    if (options?.isNew) {
      result = result.filter((t) => t.isNew);
    }

    // Apply sorting
    if (options?.sortBy) {
      result.sort((a, b) => {
        let comparison = 0;
        switch (options.sortBy) {
          case 'rating':
            comparison = a.rating - b.rating;
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'lastUpdated':
            comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
            break;
        }
        return options.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Apply pagination
    if (options?.offset) {
      result = result.slice(options.offset);
    }

    if (options?.limit) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  async getBySlug(slug: string): Promise<Tool | null> {
    return this.tools.find((t) => t.slug === slug) ?? null;
  }

  async getByCategory(category: Category | string): Promise<Tool[]> {
    if (category === 'All') {
      return [...this.tools];
    }
    return this.tools.filter((t) => t.category === category);
  }

  async getCategories(): Promise<string[]> {
    return [...new Set(this.tools.map((t) => t.category))];
  }

  async getAllSlugs(): Promise<string[]> {
    return this.tools.map((t) => t.slug);
  }

  async getFeatured(count: number = 3): Promise<Tool[]> {
    // Rank by rating, then name for ties.
    const sorted = [...this.tools].sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
    return sorted.slice(0, count);
  }

  async getRecentlyUpdated(count: number = 5): Promise<Tool[]> {
    return [...this.tools]
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, count);
  }

  async getNew(): Promise<Tool[]> {
    return this.tools.filter((t) => t.isNew);
  }

  async getByUserType(userType: UserType): Promise<Tool[]> {
    return this.tools.filter((t) => t.recommendations?.[userType]);
  }

  async getRelated(slug: string, count: number = 3): Promise<Tool[]> {
    const tool = await this.getBySlug(slug);
    if (!tool) return [];

    return this.tools
      .filter((t) => t.category === tool.category && t.slug !== slug)
      .slice(0, count);
  }

  async search(query: string): Promise<Tool[]> {
    return this.getAll({ searchQuery: query });
  }
}

/**
 * Default repository instance
 * Switch this to a different implementation for CMS integration
 */
export const toolRepository: ToolRepository = new LocalToolRepository();

/**
 * Factory function to create repository based on environment
 * Useful for switching between local and CMS in different environments
 */
export function createToolRepository(type: 'local' | 'sanity' | 'contentful' = 'local'): ToolRepository {
  switch (type) {
    case 'local':
    default:
      return new LocalToolRepository();
    // Future implementations:
    // case 'sanity':
    //   return new SanityToolRepository();
    // case 'contentful':
    //   return new ContentfulToolRepository();
  }
}

/**
 * Example Sanity implementation (placeholder for future use)
 * 
 * export class SanityToolRepository implements ToolRepository {
 *   private client: SanityClient;
 * 
 *   constructor() {
 *     this.client = createClient({
 *       projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
 *       dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
 *       useCdn: true,
 *       apiVersion: '2024-01-01',
 *     });
 *   }
 * 
 *   async getAll(options?: ToolFilterOptions): Promise<Tool[]> {
 *     const query = `*[_type == "tool"] | order(rating desc)`;
 *     return this.client.fetch(query);
 *   }
 * 
 *   async getBySlug(slug: string): Promise<Tool | null> {
 *     const query = `*[_type == "tool" && slug.current == $slug][0]`;
 *     return this.client.fetch(query, { slug });
 *   }
 * 
 *   // ... implement other methods
 * }
 */
