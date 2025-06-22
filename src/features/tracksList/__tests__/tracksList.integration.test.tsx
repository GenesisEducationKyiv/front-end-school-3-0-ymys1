import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { O } from '@mobily/ts-belt';
import tracksSlice from '../tracksListSlice';

// Mock the API client
vi.mock('../../../api/client', () => ({
  tracksApi: {
    getTracks: vi.fn()
  },
  filesApi: {
    getFileUrl: vi.fn()
  }
}));

// Mock the useFilterParams hook
vi.mock('../../../shared/hooks/useFilterParams', () => ({
  useFilterParams: () => ({
    filters: {
      search: O.None,
      genre: O.None,
      artist: O.None,
      sortBy: O.None,
      sortOrder: O.None
    },
    updateFilters: vi.fn()
  })
}));

describe('TrackList Integration', () => {
  let mockGetTracks: any;
  let TrackList: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    const apiClient = await import('../../../api/client');
    mockGetTracks = vi.mocked(apiClient.tracksApi.getTracks);
    
    const trackListModule = await import('../tracksList');
    TrackList = trackListModule.TrackList;
  });

  const createTestStore = () => configureStore({
    reducer: { tracks: tracksSlice }
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <Provider store={createTestStore()}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    );
  };

  it('should fetch and display tracks', async () => {
    mockGetTracks.mockResolvedValue({
      isOk: () => true,
      value: {
        data: [{ id: '1', title: 'Test Track', artist: 'Test Artist', album: 'Test Album', genres: ['Rock'], slug: 'test', audioFile: 'test.mp3', createdAt: '2023-01-01', updatedAt: '2023-01-01' }],
        meta: { totalPages: 1, total: 1, page: 1, limit: 20 }
      }
    });

    renderWithProviders(<TrackList />);

    await waitFor(() => {
      expect(screen.getByText('Test Track')).toBeInTheDocument();
    });
  });

  it('should open create dialog when add button is clicked', async () => {
    mockGetTracks.mockResolvedValue({
      isOk: () => true,
      value: { data: [], meta: { totalPages: 1, total: 0, page: 1, limit: 20 } }
    });

    renderWithProviders(<TrackList />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add track/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /add track/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
}); 