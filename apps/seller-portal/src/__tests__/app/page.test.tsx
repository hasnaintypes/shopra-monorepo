import { render, screen } from '@testing-library/react';
import Home from '@/app/(public)/page';

describe('Home Page', () => {
  it('renders the heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /welcome to shopra/i })).toBeInTheDocument();
  });
});
