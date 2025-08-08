import { render, screen } from '@testing-library/react';
import { Test } from './Test';

it('renders the test component', () => {
  render(<Test />);
  expect(screen.getByText('TSX works!')).toBeInTheDocument();
});
