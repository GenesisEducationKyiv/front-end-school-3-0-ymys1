import {
    Track,
    CreateTrackDto,
    UpdateTrackDto,
    PaginatedResponse,
    TrackQueryParams,
    DeleteBulkResponse
  } from '../shared/types';
  
  const API_URL = 'http://localhost:8000';
  const API_ENDPOINTS = {
    tracks: `${API_URL}/api/tracks`,
    genres: `${API_URL}/api/genres`,
    files: `${API_URL}/api/files`,
  } as const;
  
  async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An error occurred');
    }
  
    if (response.status === 204) {
      return {} as T;
    }
  
    return response.json() as Promise<T>;
  }
  
  function buildQueryString(params: Record<string, unknown>): string {
    const query = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');
  
    return query ? `?${query}` : '';
  }
  
  // Files API
  export const filesApi = {
    getFileUrl: (filename: string | undefined): string | undefined => {
      if (!filename) return undefined;
      return `${API_ENDPOINTS.files}/${filename}`;
    }
  };
  
  // Tracks API
  export const tracksApi = {
    getTracks: async (params: Partial<TrackQueryParams> = {}): Promise<PaginatedResponse<Track>> => {
      const queryString = buildQueryString({
        page: params.page || 1,
        limit: params.pageSize || 20,
        sort: params.sortBy,
        order: params.sortOrder,
        search: params.search,
        genre: params.genre,
        artist: params.artist
      });
  
      const response = await fetch(`${API_ENDPOINTS.tracks}${queryString}`);
      return handleResponse<PaginatedResponse<Track>>(response);
    },
  
    getTrack: async (slug: string): Promise<Track> => {
      const response = await fetch(`${API_ENDPOINTS.tracks}/${slug}`);
      return handleResponse<Track>(response);
    },
  
    createTrack: async (data: CreateTrackDto): Promise<Track> => {
      const response = await fetch(API_ENDPOINTS.tracks, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return handleResponse<Track>(response);
    },
  
    updateTrack: async (id: string, data: UpdateTrackDto): Promise<Track> => {
      const response = await fetch(`${API_ENDPOINTS.tracks}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return handleResponse<Track>(response);
    },
  
    deleteTrack: async (id: string): Promise<void> => {
      const response = await fetch(`${API_ENDPOINTS.tracks}/${id}`, {
        method: 'DELETE'
      });
      return handleResponse<void>(response);
    },
  
    deleteBulk: async (ids: string[]): Promise<DeleteBulkResponse> => {
      const response = await fetch(`${API_ENDPOINTS.tracks}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids })
      });
      return handleResponse<DeleteBulkResponse>(response);
    },
  
    uploadAudio: async (id: string, file: File): Promise<Track> => {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch(`${API_ENDPOINTS.tracks}/${id}/upload`, {
        method: 'POST',
        body: formData
      });
      return handleResponse<Track>(response);
    },
  
    deleteAudio: async (id: string): Promise<Track> => {
      const response = await fetch(`${API_ENDPOINTS.tracks}/${id}/file`, {
        method: 'DELETE'
      });
      return handleResponse<Track>(response);
    }
  };
  
  // Genres API
  export const genresApi = {
    getGenres: async (): Promise<string[]> => {
      const response = await fetch(API_ENDPOINTS.genres);
      return handleResponse<string[]>(response);
    }
  };
  