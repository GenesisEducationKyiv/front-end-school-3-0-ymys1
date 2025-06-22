import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const mockUpdateFilters = vi.fn();

vi.mock('../../shared/hooks/useFilterParams', () => ({
  useFilterParams: () => ({
    filters: { search: { _tag: 'None' } },
    updateFilters: mockUpdateFilters
  })
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('FilterPanel Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should integrate with useFilterParams hook', async () => {
    const { FilterPanel } = await import('../filterPanel');
    renderWithRouter(<FilterPanel />);

    const searchInput = screen.getByPlaceholderText(/search by title, artist or album/i);
    fireEvent.change(searchInput, { target: { value: 'integration test' } });

    expect(mockUpdateFilters).toHaveBeenCalledWith({
      search: { _tag: 'Some', value: 'integration test' }
    });
  });
}); 