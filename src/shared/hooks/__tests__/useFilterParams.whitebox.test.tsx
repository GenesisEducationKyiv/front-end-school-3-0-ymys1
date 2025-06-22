import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { O } from '@mobily/ts-belt';
import { useFilterParams } from '../useFilterParams';

// Mock react-router-dom
const mockSetSearchParams = vi.fn();
let mockSearchParams: URLSearchParams;

vi.mock('react-router-dom', () => ({
  useSearchParams: () => [mockSearchParams, mockSetSearchParams]
}));

describe('useFilterParams', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it('should initialize with default None values', () => {
    const { result } = renderHook(() => useFilterParams());

    expect(result.current.filters.search).toEqual(O.None);
    expect(result.current.filters.genre).toEqual(O.None);
    expect(result.current.filters.artist).toEqual(O.None);
    expect(typeof result.current.updateFilters).toBe('function');
  });

  it('should parse URL parameters on initialization', () => {
    mockSearchParams.set('search', 'test query');
    mockSearchParams.set('genre', 'Rock');

    const { result } = renderHook(() => useFilterParams());

    expect(result.current.filters.search).toEqual(O.Some('test query'));
    expect(result.current.filters.genre).toEqual(O.Some('Rock'));
  });

  it('should update URL when filters change', () => {
    const { result } = renderHook(() => useFilterParams());

    act(() => {
      result.current.updateFilters({
        search: O.Some('new search')
      });
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
  });
}); 