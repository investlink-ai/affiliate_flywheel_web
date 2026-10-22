'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface VideoEmbedProps {
  /** YouTube video URL or video ID */
  videoUrl: string;
  /** Video title for accessibility */
  title: string;
  /** Optional custom thumbnail URL */
  thumbnail?: string;
  /** Aspect ratio (default: 16/9) */
  aspectRatio?: '16/9' | '4/3' | '1/1';
  /** Additional class names */
  className?: string;
  /** Autoplay when clicked (default: true) */
  autoplay?: boolean;
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url: string): string | null {
  // Already just an ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  // Standard YouTube URLs
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Get YouTube thumbnail URL from video ID
 */
function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault',
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Responsive YouTube video embed with privacy-friendly lazy loading
 * Only loads iframe when user clicks play button (GDPR-friendly)
 */
export function VideoEmbed({
  videoUrl,
  title,
  thumbnail,
  aspectRatio = '16/9',
  className = '',
  autoplay = true,
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = extractYouTubeId(videoUrl);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  if (!videoId) {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-slate-100 p-8 text-slate-500 dark:bg-slate-800 dark:text-slate-400 ${className}`}>
        <p>Invalid video URL</p>
      </div>
    );
  }

  const thumbnailUrl = thumbnail || getYouTubeThumbnail(videoId, 'maxres');
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?${autoplay ? 'autoplay=1&' : ''}rel=0&modestbranding=1`;

  const aspectRatioClass = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
  }[aspectRatio];

  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-900 ${aspectRatioClass} ${className}`}>
      {isPlaying ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          loading="lazy"
        />
      ) : (
        <button
          onClick={handlePlay}
          className="group absolute inset-0 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          aria-label={`Play video: ${title}`}
        >
          {/* Thumbnail */}
          <Image
            src={thumbnailUrl}
            alt={`Video thumbnail: ${title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
            className="object-cover transition-transform group-hover:scale-105"
            priority={false}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />

          {/* Play button */}
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110 sm:h-20 sm:w-20">
            <svg
              className="h-7 w-7 translate-x-0.5 text-white sm:h-8 sm:w-8"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          {/* Video title overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-sm font-medium text-white sm:text-base">{title}</p>
          </div>
        </button>
      )}
    </div>
  );
}

/**
 * Video review section for tool review pages
 */
interface VideoReviewSectionProps {
  /** Tool name */
  toolName: string;
  /** YouTube video URL */
  videoUrl: string;
  /** Optional video title override */
  videoTitle?: string;
  /** Additional class names */
  className?: string;
}

export function VideoReviewSection({
  toolName,
  videoUrl,
  videoTitle,
  className = '',
}: VideoReviewSectionProps) {
  return (
    <section className={`mt-12 ${className}`}>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        {toolName} Video Review
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        A third-party video walkthrough of {toolName}&apos;s features and interface.
      </p>
      <div className="mt-6">
        <VideoEmbed
          videoUrl={videoUrl}
          title={videoTitle || `${toolName} video walkthrough`}
        />
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Video loads from YouTube when you click play. See our{' '}
        <Link href="/privacy" className="underline hover:text-primary-600 dark:hover:text-primary-400">
          privacy policy
        </Link>{' '}
        for details.
      </p>
    </section>
  );
}
