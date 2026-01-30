'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  /** Position relative to trigger */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing (ms) */
  delay?: number;
  /** Max width of tooltip */
  maxWidth?: number;
  /** Whether tooltip is disabled */
  disabled?: boolean;
}

/**
 * Accessible tooltip component with portal rendering
 * 
 * - Renders via portal to avoid overflow issues
 * - Supports keyboard focus
 * - Auto-repositions if near viewport edge
 * - Configurable delay and position
 */
export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  maxWidth = 256,
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const padding = 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top + scrollY - padding;
        left = rect.left + scrollX + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + scrollY + padding;
        left = rect.left + scrollX + rect.width / 2;
        break;
      case 'left':
        top = rect.top + scrollY + rect.height / 2;
        left = rect.left + scrollX - padding;
        break;
      case 'right':
        top = rect.top + scrollY + rect.height / 2;
        left = rect.right + scrollX + padding;
        break;
    }

    // Clamp to viewport
    const viewportWidth = window.innerWidth;
    if (left - maxWidth / 2 < padding) {
      left = maxWidth / 2 + padding;
    } else if (left + maxWidth / 2 > viewportWidth - padding) {
      left = viewportWidth - maxWidth / 2 - padding;
    }

    setCoords({ top, left });
  }, [position, maxWidth]);

  const showTooltip = useCallback(() => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, delay);
  }, [delay, disabled, calculatePosition]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  const positionStyles: Record<string, string> = {
    top: '-translate-x-1/2 -translate-y-full',
    bottom: '-translate-x-1/2',
    left: '-translate-x-full -translate-y-1/2',
    right: '-translate-y-1/2',
  };

  const arrowStyles: Record<string, string> = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
    left: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rotate-45',
    right: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </span>

      {mounted && isVisible && (
        createPortal(
          <div
            role="tooltip"
            className={`fixed z-[100] ${positionStyles[position]}`}
            style={{
              top: coords.top,
              left: coords.left,
              maxWidth,
            }}
          >
            <div className="relative rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-slate-700">
              <span
                className={`absolute h-2 w-2 bg-slate-900 dark:bg-slate-700 ${arrowStyles[position]}`}
              />
              {content}
            </div>
          </div>,
          document.body
        )
      )}
    </>
  );
}

/**
 * Disclosure tooltip specifically for affiliate links
 */
export function DisclosureTooltip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip
      content={
        <span className="block">
          <strong className="font-semibold">Affiliate link.</strong>{' '}
          I may earn a commission at no extra cost to you.
        </span>
      }
      position="top"
      maxWidth={240}
    >
      {children}
    </Tooltip>
  );
}
