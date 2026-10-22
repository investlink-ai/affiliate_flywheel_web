import { OutboundLink } from './OutboundLink';
import type { Tool } from '@/lib/data';

interface ComparisonTableProps {
  tools: Tool[];
  features: string[];
  featureMatrix: Record<string, Record<string, boolean | string>>;
  winnerId?: string;
}

export function ComparisonTable({ tools, features, featureMatrix, winnerId }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr>
            <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              Feature
            </th>
            {tools.map((tool) => (
              <th
                key={tool.slug}
                className="relative border-b border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {winnerId === tool.slug && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-medium text-white">
                    Winner
                  </span>
                )}
                <div className="flex flex-col items-center gap-1">
                  <span>{tool.name}</span>
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    {tool.pricing}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={feature} className={index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/50'}>
              <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300">
                {feature}
              </td>
              {tools.map((tool) => {
                const value = featureMatrix[feature]?.[tool.slug];
                return (
                  <td
                    key={tool.slug}
                    className="border-b border-slate-200 px-4 py-3 text-center dark:border-slate-700"
                  >
                    {typeof value === 'boolean' ? (
                      value ? (
                        <svg
                          className="mx-auto h-5 w-5 text-green-600 dark:text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          aria-label="Yes"
                          role="img"
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
                          role="img"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )
                    ) : (
                      <span className="text-sm text-slate-700 dark:text-slate-300">{value}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
          {/* CTA Row */}
          <tr>
            <td className="px-4 py-4 text-sm font-semibold text-slate-900 dark:text-white">
              Websites
            </td>
            {tools.map((tool) => (
              <td key={tool.slug} className="px-4 py-4 text-center">
                <OutboundLink
                  href={tool.websiteUrl}
                  className="btn-primary inline-flex text-sm"
                >
                  Visit {tool.name} website
                </OutboundLink>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
