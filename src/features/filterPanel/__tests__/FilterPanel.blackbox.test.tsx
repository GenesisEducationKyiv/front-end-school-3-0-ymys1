import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { O } from '@mobily/ts-belt';

const mockUpdateFilters = vi.fn();
const mockUseFilterParams = vi.fn();

vi.mock('../../../shared/hooks/useFilterParams', () => ({
  useFilterParams: mockUseFilterParams
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('FilterPanel', () => {
  let FilterPanel: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
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

    const module = await import('../filterPanel');
    FilterPanel = module.FilterPanel;
  });

  it('should render search input', () => {
    renderWithRouter(<FilterPanel />);

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('should handle search input changes', () => {
    renderWithRouter(<FilterPanel />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(mockUpdateFilters).toHaveBeenCalledWith({
      search: O.Some('test search')
    });
  });

  it('should render genre filter', () => {
    renderWithRouter(<FilterPanel genres={['Rock', 'Jazz', 'Pop']} />);

    expect(screen.getByTestId('filter-genre')).toBeInTheDocument();
  });

  it('should handle genre selection changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FilterPanel genres={['Rock', 'Jazz', 'Pop']} />);

    const genreSelect = screen.getByTestId('filter-genre');
    await user.click(genreSelect);

    const rockOption = await screen.findByText('Rock');
    await user.click(rockOption);

    expect(mockUpdateFilters).toHaveBeenCalledWith({
      genre: O.Some('Rock')
    });
  });
});
