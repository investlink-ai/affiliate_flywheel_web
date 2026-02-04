/**
 * Server-compatible user type utilities
 * 
 * These functions can be used in both Server and Client Components.
 * For client-side hooks with localStorage, use lib/hooks/useUserType.ts
 */

import type { UserType } from './data';

const URL_PARAM = 'usertype';

/**
 * Valid user types
 */
const VALID_USER_TYPES: UserType[] = [
  'individual_investor',
  'trader',
  'fintech_professional',
  'financial_advisor',
  'quantitative_analyst',
];

/**
 * Validate user type string
 */
export function isValidUserType(type: string): type is UserType {
  return VALID_USER_TYPES.includes(type as UserType);
}

/**
 * Get user type from URL search params (for server components)
 * 
 * @param searchParams - URL search parameters object
 * @returns UserType if valid, null otherwise
 * 
 * @example
 * ```tsx
 * // In a Server Component
 * export default async function Page({ searchParams }) {
 *   const params = await searchParams;
 *   const userType = getUserTypeFromParams(params);
 *   // userType is 'marketer' | 'creator' | ... | null
 * }
 * ```
 */
export function getUserTypeFromParams(
  searchParams: Record<string, string | string[] | undefined>
): UserType | null {
  const param = searchParams[URL_PARAM];
  const value = Array.isArray(param) ? param[0] : param;
  
  if (value && isValidUserType(value)) {
    return value;
  }
  
  return null;
}
