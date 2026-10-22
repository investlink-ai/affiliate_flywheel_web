'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { tools } from '@/lib/data';
import { calculateQuizResults, type QuizResult } from '@/lib/quiz-scoring';
import { quizQuestions } from '@/lib/quiz-questions';


interface QuizComponentProps {
  /** Custom title */
  title?: string;
  /** Custom description */
  description?: string;
  /** Callback when quiz is completed */
  onComplete?: (results: QuizResult[]) => void;
  /** Additional class names */
  className?: string;
}

export function QuizComponent({
  title = 'Find Investment Tools That May Suit You',
  description = 'Answer 5 quick questions for tool suggestions based on your answers.',
  onComplete,
  className = '',
}: QuizComponentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizQuestions[currentStep];
  const totalSteps = quizQuestions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  /**
   * Calculate tool recommendations based on answers
   */
  const results = useMemo<QuizResult[]>(() => {
    if (!showResults) return [];

    return calculateQuizResults(tools, answers, quizQuestions);
  }, [answers, showResults]);

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;
      
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }));

      // Move to next step or show results
      if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setShowResults(true);
        onComplete?.(results);
      }
    },
    [currentQuestion, currentStep, totalSteps, onComplete, results]
  );

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleRestart = useCallback(() => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  }, []);

  // Results view
  const topResult = results[0];
  if (showResults && topResult) {
    const otherResults = results.slice(1, 3);

    return (
      <div 
        className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8 ${className}`}
        role="region"
        aria-label="Quiz results"
      >
        {/* Screen reader announcement for results */}
        <div className="sr-only" aria-live="assertive" aria-atomic="true">
          Quiz complete! Suggested tool based on your answers: {topResult.tool.name}.
          {topResult.matchReasons.length > 0 && ` Match reasons: ${topResult.matchReasons.join(', ')}.`}
        </div>
        
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30" aria-hidden="true">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Suggested Based on Your Answers
          </h3>
        </div>

        {/* Top Result */}
        <div className="mt-6 rounded-lg border-2 border-primary-500 bg-primary-50 p-4 dark:bg-primary-900/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {topResult.tool.name}
                </h4>
                <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs font-medium text-white">
                  Suggested
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {topResult.tool.tagline}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {topResult.tool.pricing}
              </p>
            </div>
          </div>

          {topResult.matchReasons.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {topResult.matchReasons.map((reason) => (
                <span
                  key={reason}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                >
                  <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {reason}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <Link
              href={`/reviews/${topResult.tool.slug}`}
              className="btn-primary flex-1 justify-center text-sm"
            >
              Read Full Review
            </Link>
          </div>
        </div>

        {/* Other Results */}
        {otherResults.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Also Consider
            </h4>
            <div className="mt-3 space-y-3">
              {otherResults.map((result) => (
                <div
                  key={result.tool.slug}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {result.tool.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {result.tool.pricing}
                    </p>
                  </div>
                  <Link
                    href={`/reviews/${result.tool.slug}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleRestart}
          className="mt-6 w-full rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Take the quiz again"
        >
          Take Quiz Again
        </button>
      </div>
    );
  }

  // Guard for missing question
  if (!currentQuestion) {
    return null;
  }

  // Quiz view
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Question {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-primary-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Quiz progress: ${Math.round(progress)}% complete`}
          />
        </div>
        {/* Screen reader announcement for progress */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Question {currentStep + 1} of {totalSteps}. {Math.round(progress)}% complete.
        </div>
      </div>

      {/* Question */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
          {currentQuestion.question}
        </h4>

        <div className="mt-4 space-y-3" role="radiogroup" aria-label={currentQuestion.question}>
          {currentQuestion.options.map((option) => {
            const isSelected = answers[currentQuestion.id] === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                role="radio"
                aria-checked={isSelected}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {option.label}
                    </p>
                    {option.description && (
                      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        {option.description}
                      </p>
                    )}
                  </div>
                  <div
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      {currentStep > 0 && (
        <button
          onClick={handleBack}
          className="mt-6 flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          aria-label="Go back to previous question"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
      )}
    </div>
  );
}
