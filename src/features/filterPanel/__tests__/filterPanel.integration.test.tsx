import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (component: React.ReactElement, initialUrl = '/') => {
  window.history.pushState({}, 'Test page', initialUrl);
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('FilterPanel Integration', () => {
  beforeEach(() => {
    window.history.pushState({}, 'Test page', '/');
  });

  it('should integrate FilterPanel with useFilterParams and URL synchronization', async () => {
    const { FilterPanel } = await import('../filterPanel');
    renderWithRouter(<FilterPanel />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'integration test' } });

    expect(window.location.search).toContain('search=integration+test');
  });

  it('should load filters from URL on mount', async () => {
    const { FilterPanel } = await import('../filterPanel');
    
    renderWithRouter(<FilterPanel />, '/?search=url-test&genre=Rock');

    const searchInput = screen.getByTestId('search-input') as HTMLInputElement;
    
    expect(searchInput.value).toBe('url-test');
  });

  it('should set empty search parameter when input is cleared', async () => {
    const { FilterPanel } = await import('../filterPanel');
    
    renderWithRouter(<FilterPanel />, '/?search=test');

    const searchInput = screen.getByTestId('search-input');
    
    fireEvent.change(searchInput, { target: { value: '' } });

    expect(window.location.search).toBe('?search=');
  });
});
