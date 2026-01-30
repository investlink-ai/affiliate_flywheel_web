'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table';
import { AffiliateLink } from './AffiliateLink';
import type { Tool } from '@/lib/data';

interface ComparisonRow {
  feature: string;
  [toolSlug: string]: boolean | string;
}

interface ComparisonTableSortableProps {
  tools: Tool[];
  features: string[];
  featureMatrix: Record<string, Record<string, boolean | string>>;
  winnerId?: string;
}

/**
 * Sort icon component
 */
function SortIcon({ direction }: { direction: 'asc' | 'desc' | false }) {
  if (!direction) {
    return (
      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
      </svg>
    );
  }

  return direction === 'asc' ? (
    <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  ) : (
    <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

/**
 * Cell renderer for feature values
 */
function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <svg
        className="mx-auto h-5 w-5 text-green-600 dark:text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-label="Yes"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ) : (
      <svg
        className="mx-auto h-5 w-5 text-slate-300 dark:text-slate-600"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-label="No"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  return <span className="text-sm text-slate-700 dark:text-slate-300">{value}</span>;
}

/**
 * Sortable comparison table using TanStack Table
 */
export function ComparisonTableSortable({
  tools,
  features,
  featureMatrix,
  winnerId,
}: ComparisonTableSortableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Transform data for table
  const data = useMemo<ComparisonRow[]>(() => {
    return features.map((feature) => {
      const row: ComparisonRow = { feature };
      tools.forEach((tool) => {
        row[tool.slug] = featureMatrix[feature]?.[tool.slug] ?? false;
      });
      return row;
    });
  }, [features, featureMatrix, tools]);

  // Create column helper
  const columnHelper = createColumnHelper<ComparisonRow>();

  // Define columns dynamically based on tools
  const columns = useMemo<ColumnDef<ComparisonRow, unknown>[]>(() => {
    const cols: ColumnDef<ComparisonRow, unknown>[] = [
      columnHelper.accessor('feature', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 text-left"
            aria-label={`Sort by feature name ${column.getIsSorted() ? (column.getIsSorted() === 'asc' ? '(ascending)' : '(descending)') : ''}`}
          >
            Feature
            <SortIcon direction={column.getIsSorted()} />
          </button>
        ),
        cell: (info) => (
          <span className="text-sm text-slate-700 dark:text-slate-300">
            {info.getValue()}
          </span>
        ),
      }) as ColumnDef<ComparisonRow, unknown>,
    ];

    // Add tool columns
    tools.forEach((tool) => {
      cols.push(
        columnHelper.accessor(tool.slug, {
          header: ({ column }) => (
            <div className="relative">
              {winnerId === tool.slug && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-medium text-white">
                  Winner
                </span>
              )}
              <button
                onClick={() => column.toggleSorting()}
                className="flex w-full flex-col items-center gap-1"
                aria-label={`Sort by ${tool.name} ${column.getIsSorted() ? (column.getIsSorted() === 'asc' ? '(ascending)' : '(descending)') : ''}`}
              >
                <div className="flex items-center gap-1">
                  <span>{tool.name}</span>
                  <SortIcon direction={column.getIsSorted()} />
                </div>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  {tool.pricing}
                </span>
              </button>
            </div>
          ),
          cell: (info) => <FeatureCell value={info.getValue() as boolean | string} />,
          // Custom sorting: true > string > false
          sortingFn: (rowA, rowB, columnId) => {
            const a = rowA.getValue(columnId);
            const b = rowB.getValue(columnId);
            
            // Score: true = 2, string = 1, false = 0
            const scoreA = a === true ? 2 : typeof a === 'string' ? 1 : 0;
            const scoreB = b === true ? 2 : typeof b === 'string' ? 1 : 0;
            
            return scoreA - scoreB;
          },
        }) as ColumnDef<ComparisonRow, unknown>
      );
    });

    return cols;
  }, [tools, winnerId, columnHelper]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse" role="grid">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  style={{ textAlign: header.index === 0 ? 'left' : 'center' }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className={index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/50'}
            >
              {row.getVisibleCells().map((cell, cellIndex) => (
                <td
                  key={cell.id}
                  className="border-b border-slate-200 px-4 py-3 dark:border-slate-700"
                  style={{ textAlign: cellIndex === 0 ? 'left' : 'center' }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {/* CTA Row */}
          <tr>
            <td className="px-4 py-4 text-sm font-semibold text-slate-900 dark:text-white">
              Try Now
            </td>
            {tools.map((tool) => (
              <td key={tool.slug} className="px-4 py-4 text-center">
                <AffiliateLink
                  href={tool.affiliateUrl}
                  className="btn-primary inline-flex text-sm"
                  showDisclosure={false}
                  toolName={tool.name}
                  toolSlug={tool.slug}
                  position="comparison-table"
                >
                  Try {tool.name}
                </AffiliateLink>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      
      {/* Sort hint */}
      <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        Click column headers to sort • Green checkmarks indicate available features
      </p>
    </div>
  );
}
