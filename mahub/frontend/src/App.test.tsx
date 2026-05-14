import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from './App';

describe('App', () => {
  it('renders the KTD-9 scaffold status', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Boundary' })).toBeInTheDocument();
    expect(screen.getByText('React + Vite + TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Java 21 + Spring Boot')).toBeInTheDocument();
  });
});
