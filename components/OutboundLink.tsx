'use client';

import type { ReactNode } from 'react';
import { trackOutboundClick } from '@/lib/analytics';

interface OutboundLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClickTrack?: () => void;
  size?: 'sm' | 'md' | 'lg';
  toolName?: string;
  toolSlug?: string;
  position?: string;
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

/** Opens the supplied URL verbatim and records a neutral outbound click. */
export function OutboundLink({
  href,
  children,
  className = '',
  onClickTrack,
  toolName = 'Unknown',
  toolSlug = 'unknown',
  position = 'content',
}: OutboundLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={className}
      onClick={() => {
        trackOutboundClick({ toolName, toolSlug, websiteUrl: href, position });
        onClickTrack?.();
      }}
    >
      {children}
    </a>
  );
}

export function OutboundLinkSimple(props: Pick<OutboundLinkProps, 'href' | 'children' | 'className'>) {
  return <OutboundLink {...props} />;
}

export function OutboundCTAButton({ size = 'md', className = '', ...props }: OutboundLinkProps) {
  return (
    <OutboundLink
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 font-semibold text-white shadow-sm transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${sizeStyles[size]} ${className}`}
    />
  );
}
