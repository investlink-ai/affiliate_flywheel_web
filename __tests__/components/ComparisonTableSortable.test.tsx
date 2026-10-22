import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockTool } from '../../vitest.setup';
import { ComparisonTableSortable } from '@/components/ComparisonTableSortable';

vi.mock('@/lib/hooks', () => ({
  useABTest: () => ({
    value: 'default',
    variantId: 'control',
    isReady: true,
    trackConversion: vi.fn(),
  }),
}));

const tools = [
  createMockTool({ slug: 'tool-a', name: 'Tool A', pricing: '$10/mo', websiteUrl: 'https://tool-a.com' }),
  createMockTool({ slug: 'tool-b', name: 'Tool B', pricing: '$20/mo', websiteUrl: 'https://tool-b.com' }),
];

const features = ['Feature X', 'Feature Y', 'Feature Z'];

const featureMatrix: Record<string, Record<string, boolean | string>> = {
  'Feature X': { 'tool-a': true, 'tool-b': false },
  'Feature Y': { 'tool-a': 'Partial', 'tool-b': true },
  'Feature Z': { 'tool-a': false, 'tool-b': true },
};

describe('ComparisonTableSortable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table with tool names and features', () => {
    render(
      <ComparisonTableSortable
        tools={tools}
        features={features}
        featureMatrix={featureMatrix}
      />
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('Tool A')).toBeInTheDocument();
    expect(screen.getByText('Tool B')).toBeInTheDocument();
    expect(screen.getByText('Feature X')).toBeInTheDocument();
    expect(screen.getByText('Feature Y')).toBeInTheDocument();
    expect(screen.getByText('Feature Z')).toBeInTheDocument();
  });

  it('renders feature column header with sort button', () => {
    render(
      <ComparisonTableSortable
        tools={tools}
        features={features}
        featureMatrix={featureMatrix}
      />
    );

    const featureHeader = screen.getByRole('button', { name: /sort by feature name/i });
    expect(featureHeader).toBeInTheDocument();
  });

  it('renders Websites row with outbound links for each tool', () => {
    render(
      <ComparisonTableSortable
        tools={tools}
        features={features}
        featureMatrix={featureMatrix}
      />
    );

    expect(screen.getByRole('link', { name: /visit tool a website/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /visit tool b website/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /visit tool a website/i })).toHaveAttribute(
      'href',
      expect.stringContaining('tool-a.com')
    );
  });

  it('renders Winner badge when winnerId is provided', () => {
    render(
      <ComparisonTableSortable
        tools={tools}
        features={features}
        featureMatrix={featureMatrix}
        winnerId="tool-b"
      />
    );

    expect(screen.getByText('Winner')).toBeInTheDocument();
  });

  it('feature column header is clickable and updates sort state', async () => {
    const user = userEvent.setup();
    render(
      <ComparisonTableSortable
        tools={tools}
        features={features}
        featureMatrix={featureMatrix}
      />
    );

    const featureHeader = screen.getByRole('button', { name: /sort by feature name/i });
    await user.click(featureHeader);
    await user.click(featureHeader);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('Feature X')).toBeInTheDocument();
  });

  it('displays checkmarks and text values in cells', () => {
    render(
      <ComparisonTableSortable
        tools={tools}
        features={features}
        featureMatrix={featureMatrix}
      />
    );

    expect(screen.getByText('Partial')).toBeInTheDocument();
    const yesLabels = screen.getAllByLabelText('Yes');
    const noLabels = screen.getAllByLabelText('No');
    expect(yesLabels.length).toBeGreaterThan(0);
    expect(noLabels.length).toBeGreaterThan(0);
  });

  it('shows sort hint text', () => {
    render(
      <ComparisonTableSortable
        tools={tools}
        features={features}
        featureMatrix={featureMatrix}
      />
    );

    expect(screen.getByText(/click column headers to sort/i)).toBeInTheDocument();
    expect(screen.getByText(/green checkmarks indicate available features/i)).toBeInTheDocument();
  });
});
