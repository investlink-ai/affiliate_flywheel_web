import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md">
        <p className="text-6xl font-bold text-primary-600 dark:text-primary-400">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or
          deleted.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/" className="btn-primary w-full sm:w-auto">
            Go Home
          </Link>
          <Link href="/reviews" className="btn-secondary w-full sm:w-auto">
            Browse Reviews
          </Link>
        </div>
      </div>
    </div>
  );
}
