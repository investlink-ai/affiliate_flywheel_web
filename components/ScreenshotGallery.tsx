'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface ScreenshotGalleryProps {
  /** Array of screenshot URLs */
  screenshots: string[];
  /** Tool name for alt text */
  toolName: string;
  /** Additional class names */
  className?: string;
}

/**
 * Screenshot gallery with lightbox for tool interfaces
 * Displays thumbnails in a grid with full-screen lightbox on click
 */
export function ScreenshotGallery({
  screenshots,
  toolName,
  className = '',
}: ScreenshotGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Open lightbox at specific index
  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }, []);

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Navigate to previous image
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  }, [screenshots.length]);

  // Navigate to next image
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  }, [screenshots.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, closeLightbox, goToPrevious, goToNext]);

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  return (
    <>
      {/* Thumbnail Grid */}
      <div className={`grid gap-4 ${screenshots.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'} ${className}`}>
        {screenshots.map((src, index) => (
          <button
            key={src}
            onClick={() => openLightbox(index)}
            className="group relative aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-100 transition-all hover:border-primary-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800"
            aria-label={`View ${toolName} screenshot ${index + 1} of ${screenshots.length}`}
          >
            <Image
              src={src}
              alt={`${toolName} interface screenshot ${index + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-colors group-hover:bg-slate-900/20">
              <span className="rounded-full bg-white/90 p-2 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-slate-800/90">
                <svg
                  className="h-5 w-5 text-slate-700 dark:text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                  />
                </svg>
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${toolName} screenshot ${currentIndex + 1} of ${screenshots.length}`}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close lightbox"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur">
            {currentIndex + 1} / {screenshots.length}
          </div>

          {/* Previous button */}
          {screenshots.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous screenshot"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {screenshots.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next screenshot"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* Main image */}
          <div className="relative h-full max-h-[85vh] w-full max-w-6xl">
            {screenshots[currentIndex] && (
              <Image
                src={screenshots[currentIndex]}
                alt={`${toolName} interface screenshot ${currentIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            )}
          </div>

          {/* Thumbnail strip */}
          {screenshots.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-lg bg-white/10 p-2 backdrop-blur">
              {screenshots.map((src, index) => (
                <button
                  key={src}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative h-12 w-16 overflow-hidden rounded transition-all ${
                    index === currentIndex
                      ? 'ring-2 ring-white'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Go to screenshot ${index + 1}`}
                  aria-current={index === currentIndex ? 'true' : undefined}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Click backdrop to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={closeLightbox}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
}
