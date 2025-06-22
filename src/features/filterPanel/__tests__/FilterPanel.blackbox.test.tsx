import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { O } from '@mobily/ts-belt';

// Mock the useFilterParams hook
const mockUpdateFilters = vi.fn();
const mockUseFilterParams = vi.fn();

vi.mock('../../../shared/hooks/useFilterParams', () => ({
  useFilterParams: mockUseFilterParams
}));

// Helper to render with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('FilterPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock setup
    mockUseFilterParams.mockReturnValue({
      filters: {
        search: O.None,
        genre: O.None,
        artist: O.None,
        sortBy: O.None,
        sortOrder: O.None
      },
      updateFilters: mockUpdateFilters
    });
  });

  it('should render search input', async () => {
    const { FilterPanel } = await import('../filterPanel');
    renderWithRouter(<FilterPanel />);

    expect(screen.getByPlaceholderText(/search by title, artist or album/i)).toBeInTheDocument();
  });

  it('should handle search input changes', async () => {
    const { FilterPanel } = await import('../filterPanel');
    renderWithRouter(<FilterPanel />);

    const searchInput = screen.getByPlaceholderText(/search by title, artist or album/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(mockUpdateFilters).toHaveBeenCalledWith({
      search: O.Some('test')
    });
  });
});