import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizComponent } from '@/components/QuizComponent';

describe('QuizComponent', () => {
  it('renders title and first question', () => {
    render(<QuizComponent />);

    expect(screen.getByRole('heading', { name: /find your perfect ai tool/i })).toBeInTheDocument();
    expect(screen.getByText(/answer 3 quick questions/i)).toBeInTheDocument();
    expect(screen.getAllByText(/question 1 of 3/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('radiogroup', { name: /what do you primarily want to create/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /marketing copy/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /blog & articles/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /video content/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /multiple types/i })).toBeInTheDocument();
  });

  it('renders custom title and description when provided', () => {
    render(
      <QuizComponent
        title="Custom Quiz Title"
        description="Custom description text"
      />
    );

    expect(screen.getByRole('heading', { name: /custom quiz title/i })).toBeInTheDocument();
    expect(screen.getByText(/custom description text/i)).toBeInTheDocument();
  });

  it('shows progress bar with correct percentage', () => {
    render(<QuizComponent />);

    const progressbar = screen.getByRole('progressbar', { name: /quiz progress: 33% complete/i });
    const valueNow = progressbar.getAttribute('aria-valuenow');
    expect(Number(valueNow)).toBeCloseTo(33.33, 1);
  });

  it('advances to next question when an option is selected', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /marketing copy/i }));

    expect(screen.getAllByText(/question 2 of 3/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('radiogroup', { name: /how many people will use this tool/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /just me/i })).toBeInTheDocument();
  });

  it('shows Back button after first question', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /marketing copy/i }));

    expect(screen.getByRole('button', { name: /go back to previous question/i })).toBeInTheDocument();
  });

  it('goes back to previous question when Back is clicked', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /marketing copy/i }));
    expect(screen.getAllByText(/question 2 of 3/i).length).toBeGreaterThanOrEqual(1);

    await user.click(screen.getByRole('button', { name: /go back to previous question/i }));

    expect(screen.getAllByText(/question 1 of 3/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('radiogroup', { name: /what do you primarily want to create/i })).toBeInTheDocument();
  });

  it('shows results view after answering all three questions', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /marketing copy/i }));
    await user.click(screen.getByRole('radio', { name: /just me/i }));
    await user.click(screen.getByRole('radio', { name: /free \/ minimal/i }));

    expect(screen.getByRole('region', { name: /quiz results/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /your top recommendation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /take the quiz again/i })).toBeInTheDocument();
  });

  it('displays top recommendation with tool name and match reasons', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /marketing copy/i }));
    await user.click(screen.getByRole('radio', { name: /just me/i }));
    await user.click(screen.getByRole('radio', { name: /free \/ minimal/i }));

    const resultsRegion = screen.getByRole('region', { name: /quiz results/i });
    expect(within(resultsRegion).getByText(/best match/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /read full review/i })).toBeInTheDocument();
  });

  it('displays "Also Consider" section with other results', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /marketing copy/i }));
    await user.click(screen.getByRole('radio', { name: /just me/i }));
    await user.click(screen.getByRole('radio', { name: /free \/ minimal/i }));

    expect(screen.getByText(/also consider/i)).toBeInTheDocument();
    const viewLinks = screen.getAllByRole('link', { name: /view →/i });
    expect(viewLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('restarts quiz when Take Quiz Again is clicked', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /marketing copy/i }));
    await user.click(screen.getByRole('radio', { name: /just me/i }));
    await user.click(screen.getByRole('radio', { name: /free \/ minimal/i }));

    expect(screen.getByRole('region', { name: /quiz results/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /take the quiz again/i }));

    expect(screen.getAllByText(/question 1 of 3/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('radiogroup', { name: /what do you primarily want to create/i })).toBeInTheDocument();
  });

  it('links to correct review pages from results', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /marketing copy/i }));
    await user.click(screen.getByRole('radio', { name: /just me/i }));
    await user.click(screen.getByRole('radio', { name: /free \/ minimal/i }));

    const readReviewLink = screen.getByRole('link', { name: /read full review/i });
    expect(readReviewLink).toHaveAttribute('href', expect.stringMatching(/^\/reviews\/[a-z0-9-]+$/));
  });
});
