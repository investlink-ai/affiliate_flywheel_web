import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserTestimonials, placeholderTestimonials } from '@/components/UserTestimonials';

describe('UserTestimonials (CPO: no testimonials)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders nothing by default (no placeholder default)', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { container } = render(<UserTestimonials />);
    expect(container.innerHTML).toBe('');
  });

  it('cannot render placeholder testimonials in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { container } = render(<UserTestimonials testimonials={placeholderTestimonials} />);
    expect(container.innerHTML).toBe('');
    placeholderTestimonials.forEach((t) => expect(screen.queryByText(t.name)).toBeNull());
  });

  it('cannot render copied placeholder quotes in production either', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const copies = placeholderTestimonials.map((t) => ({ ...t }));
    const { container } = render(<UserTestimonials testimonials={copies} />);
    expect(container.innerHTML).toBe('');
  });

  it('still renders placeholders in development for local work', () => {
    vi.stubEnv('NODE_ENV', 'development');
    render(<UserTestimonials testimonials={placeholderTestimonials} limit={1} />);
    expect(screen.getByText(placeholderTestimonials[0]!.name)).toBeTruthy();
  });
});
