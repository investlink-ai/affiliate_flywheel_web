import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizComponent } from '@/components/QuizComponent';

describe('QuizComponent', () => {
  it('renders title and first question', () => {
    render(<QuizComponent />);

    expect(screen.getByRole('heading', { name: /find investment tools that may suit you/i })).toBeInTheDocument();
    expect(screen.getByText(/answer 5 quick questions/i)).toBeInTheDocument();
    expect(screen.getAllByText(/question 1 of 5/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('radiogroup', { name: /what best describes your investment style/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /passive \/ long-term/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /active \/ short-term/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /hybrid/i })).toBeInTheDocument();
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

    const progressbar = screen.getByRole('progressbar', { name: /quiz progress: 20% complete/i });
    const valueNow = progressbar.getAttribute('aria-valuenow');
    expect(Number(valueNow)).toBeCloseTo(20, 1);
  });

  it('advances to next question when an option is selected', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /passive \/ long-term/i }));

    expect(screen.getAllByText(/question 2 of 5/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('radiogroup', { name: /what is your risk tolerance/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /conservative/i })).toBeInTheDocument();
  });

  it('shows Back button after first question', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /passive \/ long-term/i }));

    expect(screen.getByRole('button', { name: /go back to previous question/i })).toBeInTheDocument();
  });

  it('goes back to previous question when Back is clicked', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /passive \/ long-term/i }));
    expect(screen.getAllByText(/question 2 of 5/i).length).toBeGreaterThanOrEqual(1);

    await user.click(screen.getByRole('button', { name: /go back to previous question/i }));

    expect(screen.getAllByText(/question 1 of 5/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('radiogroup', { name: /what best describes your investment style/i })).toBeInTheDocument();
  });

  it('shows results view after answering all five questions', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /passive \/ long-term/i }));
    await user.click(screen.getByRole('radio', { name: /conservative/i }));
    await user.click(screen.getByRole('radio', { name: /stocks & etfs/i }));
    await user.click(screen.getByRole('radio', { name: /free \/ minimal/i }));
    await user.click(screen.getByRole('radio', { name: /portfolio & risk management/i }));

    expect(screen.getByRole('region', { name: /quiz results/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /suggested based on your answers/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /take the quiz again/i })).toBeInTheDocument();
  });

  it('displays the suggested tool with name and match reasons', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /passive \/ long-term/i }));
    await user.click(screen.getByRole('radio', { name: /conservative/i }));
    await user.click(screen.getByRole('radio', { name: /stocks & etfs/i }));
    await user.click(screen.getByRole('radio', { name: /free \/ minimal/i }));
    await user.click(screen.getByRole('radio', { name: /portfolio & risk management/i }));

    const resultsRegion = screen.getByRole('region', { name: /quiz results/i });
    expect(within(resultsRegion).getByText(/^suggested$/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /read full review/i })).toBeInTheDocument();
  });

  it('displays "Also Consider" section with other results', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /passive \/ long-term/i }));
    await user.click(screen.getByRole('radio', { name: /conservative/i }));
    await user.click(screen.getByRole('radio', { name: /stocks & etfs/i }));
    await user.click(screen.getByRole('radio', { name: /free \/ minimal/i }));
    await user.click(screen.getByRole('radio', { name: /portfolio & risk management/i }));

    expect(screen.getByText(/also consider/i)).toBeInTheDocument();
    const viewLinks = screen.getAllByRole('link', { name: /view →/i });
    expect(viewLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('restarts quiz when Take Quiz Again is clicked', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /passive \/ long-term/i }));
    await user.click(screen.getByRole('radio', { name: /conservative/i }));
    await user.click(screen.getByRole('radio', { name: /stocks & etfs/i }));
    await user.click(screen.getByRole('radio', { name: /free \/ minimal/i }));
    await user.click(screen.getByRole('radio', { name: /portfolio & risk management/i }));

    expect(screen.getByRole('region', { name: /quiz results/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /take the quiz again/i }));

    expect(screen.getAllByText(/question 1 of 5/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('radiogroup', { name: /what best describes your investment style/i })).toBeInTheDocument();
  });

  it('links to correct review pages from results', async () => {
    const user = userEvent.setup();
    render(<QuizComponent />);

    await user.click(screen.getByRole('radio', { name: /passive \/ long-term/i }));
    await user.click(screen.getByRole('radio', { name: /conservative/i }));
    await user.click(screen.getByRole('radio', { name: /stocks & etfs/i }));
    await user.click(screen.getByRole('radio', { name: /free \/ minimal/i }));
    await user.click(screen.getByRole('radio', { name: /portfolio & risk management/i }));

    const readReviewLink = screen.getByRole('link', { name: /read full review/i });
    expect(readReviewLink).toHaveAttribute('href', expect.stringMatching(/^\/reviews\/[a-z0-9-]+$/));
  });
});
