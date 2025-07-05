import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FilterPanel } from '../filterPanel';
import { O } from '@mobily/ts-belt';
import { vi } from 'vitest';

// Mock the useFilterParams hook
const mockUpdateFilters = vi.fn();
vi.mock('../../../shared/hooks/useFilterParams', () => ({
  useFilterParams: vi.fn(() => ({
    filters: {
      search: O.None,
      genre: O.None,
      artist: O.None,
      sortBy: O.Some('title'),
      sortOrder: O.Some('asc')
    },
    updateFilters: mockUpdateFilters
  }))
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('FilterPanel', () => {
  beforeEach(() => {
    mockUpdateFilters.mockClear();
  });

  it('should render search input', () => {
    renderWithRouter(<FilterPanel />);
    
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by title, artist or album...')).toBeInTheDocument();
  });
});
