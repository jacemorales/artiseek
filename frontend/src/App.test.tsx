import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from './components/HomePage';

test('renders welcome message', () => {
  render(
    <Router>
      <HomePage />
    </Router>
  );
  const linkElement = screen.getByText(/Welcome to Artiseek/i);
  expect(linkElement).toBeInTheDocument();
});
