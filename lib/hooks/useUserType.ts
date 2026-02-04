'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserType } from '@/lib/data';
import { isValidUserType } from '@/lib/user-type';

const STORAGE_KEY = 'user_type';
const URL_PARAM = 'usertype';

// Re-export for backward compatibility (but prefer importing from lib/user-type.ts in Server Components)
export { getUserTypeFromParams } from '@/lib/user-type';

export interface UseUserTypeResult {
  /** Current user type (null if not set) */
  userType: UserType | null;
  /** Whether the hook has initialized (for hydration) */
  isReady: boolean;
  /** Set the user type */
  setUserType: (type: UserType | null) => void;
  /** Clear the user type */
  clearUserType: () => void;
}

/**
 * Hook for managing user type personalization
 * 
 * Priority order:
 * 1. URL query parameter (?usertype=individual_investor)
 * 2. localStorage persisted value
 * 
 * @example
 * ```tsx
 * const { userType, setUserType, isReady } = useUserType();
 * 
 * // Show personalized content
 * if (userType === 'individual_investor') {
 *   return <MarketingFeatures />;
 * }
 * 
 * // Let user select their type
 * <select onChange={(e) => setUserType(e.target.value as UserType)}>
 *   <option value="individual_investor">Individual Investor</option>
 *   <option value="trader">Trader</option>
 * </select>
 * ```
 */
export function useUserType(): UseUserTypeResult {
  const [userType, setUserTypeState] = useState<UserType | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check URL param first (highest priority)
    const urlParams = new URLSearchParams(window.location.search);
    const urlUserType = urlParams.get(URL_PARAM) as UserType | null;

    if (urlUserType && isValidUserType(urlUserType)) {
      setUserTypeState(urlUserType);
      // Persist URL param to localStorage
      localStorage.setItem(STORAGE_KEY, urlUserType);
      setIsReady(true);
      return;
    }

    // Fall back to localStorage
    const stored = localStorage.getItem(STORAGE_KEY) as UserType | null;
    if (stored && isValidUserType(stored)) {
      setUserTypeState(stored);
    }

    setIsReady(true);
  }, []);

  const setUserType = useCallback((type: UserType | null) => {
    if (typeof window === 'undefined') return;

    if (type && isValidUserType(type)) {
      localStorage.setItem(STORAGE_KEY, type);
      setUserTypeState(type);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setUserTypeState(null);
    }
  }, []);

  const clearUserType = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    setUserTypeState(null);
  }, []);

  return {
    userType,
    isReady,
    setUserType,
    clearUserType,
  };
}

