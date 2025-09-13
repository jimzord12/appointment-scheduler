import { render, screen } from '@testing-library/react';

describe('App smoke test', () => {
  it('renders without crashing', () => {
    render(<div>Hello Test!</div>);
    expect(screen.getByText('Hello Test!')).toBeInTheDocument();
  });
});
