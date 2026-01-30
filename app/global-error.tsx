'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-slate-900">
        <div className="mx-auto max-w-md text-center">
          <p className="text-6xl font-bold text-red-600">!</p>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Something went wrong
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
          {error.digest && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
              Error ID: {error.digest}
            </p>
          )}
          <div className="mt-8">
            <button
              onClick={reset}
              aria-label="Try again to reload the page"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
