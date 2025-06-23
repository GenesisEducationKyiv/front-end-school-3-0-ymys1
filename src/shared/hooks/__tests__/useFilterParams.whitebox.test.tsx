import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { O } from '@mobily/ts-belt';
import { useFilterParams } from '../useFilterParams';

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

  describe('Initialization', () => {
    it('should initialize with default None values', () => {
      const { result } = renderHook(() => useFilterParams());

      expect(result.current.filters.search).toEqual(O.None);
      expect(result.current.filters.genre).toEqual(O.None);
      expect(result.current.filters.artist).toEqual(O.None);
      expect(result.current.filters.sortBy).toEqual(O.None);
      expect(result.current.filters.sortOrder).toEqual(O.None);
      expect(typeof result.current.updateFilters).toBe('function');
    });

    it('should parse URL parameters on initialization', () => {
      mockSearchParams.set('search', 'test query');
      mockSearchParams.set('genre', 'Rock');
      mockSearchParams.set('sortBy', 'title');

      const { result } = renderHook(() => useFilterParams());

      expect(result.current.filters.search).toEqual(O.Some('test query'));
      expect(result.current.filters.genre).toEqual(O.Some('Rock'));
      expect(result.current.filters.sortBy).toEqual(O.Some('title'));
    });

    it('should handle empty string parameters as None', () => {
      mockSearchParams.set('search', '');
      mockSearchParams.set('genre', 'Rock');

      const { result } = renderHook(() => useFilterParams());

      expect(result.current.filters.search).toEqual(O.None);
      expect(result.current.filters.genre).toEqual(O.Some('Rock'));
    });
  });

  describe('Filter Updates', () => {
    it('should set URL parameters when updating with Some values', () => {
      const { result } = renderHook(() => useFilterParams());

      act(() => {
        result.current.updateFilters({
          search: O.Some('new search'),
          genre: O.Some('Jazz')
        });
      });

      expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
      const newParams = mockSetSearchParams.mock.calls[0][0];
      expect(newParams.get('search')).toBe('new search');
      expect(newParams.get('genre')).toBe('Jazz');
    });

    it('should delete URL parameters when updating with None values', () => {
      mockSearchParams.set('search', 'existing');
      mockSearchParams.set('genre', 'Rock');

      const { result } = renderHook(() => useFilterParams());

      act(() => {
        result.current.updateFilters({
          search: O.None,
          genre: O.Some('Jazz')
        });
      });

      const newParams = mockSetSearchParams.mock.calls[0][0];
      expect(newParams.has('search')).toBe(false);
      expect(newParams.get('genre')).toBe('Jazz');
    });

    it('should handle multiple filter updates', () => {
      const { result } = renderHook(() => useFilterParams());

      act(() => {
        result.current.updateFilters({
          search: O.Some('test'),
          genre: O.Some('Rock'),
          sortBy: O.Some('title'),
          sortOrder: O.Some('asc')
        });
      });

      const newParams = mockSetSearchParams.mock.calls[0][0];
      expect(newParams.get('search')).toBe('test');
      expect(newParams.get('genre')).toBe('Rock');
      expect(newParams.get('sortBy')).toBe('title');
      expect(newParams.get('sortOrder')).toBe('asc');
    });

    it('should handle special characters in filter values', () => {
      const { result } = renderHook(() => useFilterParams());

      act(() => {
        result.current.updateFilters({
          search: O.Some('test & query with spaces'),
          artist: O.Some('AC/DC')
        });
      });

      const newParams = mockSetSearchParams.mock.calls[0][0];
      expect(newParams.get('search')).toBe('test & query with spaces');
      expect(newParams.get('artist')).toBe('AC/DC');
    });
  });

  describe('Edge Cases', () => {
    it('should preserve existing parameters when updating subset', () => {
      mockSearchParams.set('search', 'existing');
      mockSearchParams.set('genre', 'Rock');

      const { result } = renderHook(() => useFilterParams());

      act(() => {
        result.current.updateFilters({
          artist: O.Some('New Artist')
        });
      });

      const newParams = mockSetSearchParams.mock.calls[0][0];
      expect(newParams.get('search')).toBe('existing');
      expect(newParams.get('genre')).toBe('Rock');
      expect(newParams.get('artist')).toBe('New Artist');
    });

    it('should handle empty update object', () => {
      mockSearchParams.set('search', 'existing');

      const { result } = renderHook(() => useFilterParams());

      act(() => {
        result.current.updateFilters({});
      });

      const newParams = mockSetSearchParams.mock.calls[0][0];
      expect(newParams.get('search')).toBe('existing');
    });
  });
});
