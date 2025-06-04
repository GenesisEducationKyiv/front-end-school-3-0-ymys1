import {
    Track,
    trackSchema,
    createTrackSchema,
    updateTrackSchema
  } from '../shared/schemas/track.schema';
  import {
    PaginatedResponse,
    TrackQueryParams,
    paginatedResponseSchema,
    trackQuerySchema
  } from '../shared/schemas/common.schema';
  import { z } from 'zod';
  
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
      // Validate query params
      const validParams = trackQuerySchema.partial().parse(params);
      
      const queryString = buildQueryString({
        page: validParams.page || 1,
        limit: validParams.pageSize || 20,
        sort: validParams.sortBy,
        order: validParams.sortOrder,
        search: validParams.search,
        genre: validParams.genre,
        artist: validParams.artist
      });
  
      const response = await fetch(`${API_ENDPOINTS.tracks}${queryString}`);
      const data = await handleResponse<PaginatedResponse<Track>>(response);
      
      // Validate response data
      const validatedResponse = paginatedResponseSchema.parse(data);
      return {
        ...validatedResponse,
        data: data.data.map(track => trackSchema.parse(track))
      };
    },
  
    getTrack: async (slug: string): Promise<Track> => {
      const response = await fetch(`${API_ENDPOINTS.tracks}/${slug}`);
      const data = await handleResponse<Track>(response);
      return trackSchema.parse(data);
    },
  
    createTrack: async (data: unknown): Promise<Track> => {
      // Validate input data
      const validData = createTrackSchema.parse(data);
      
      const response = await fetch(API_ENDPOINTS.tracks, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(validData)
      });
      const responseData = await handleResponse<Track>(response);
      return trackSchema.parse(responseData);
    },
  
    updateTrack: async (id: string, data: unknown): Promise<Track> => {
      // Validate input data
      const validData = updateTrackSchema.parse(data);
      
      const response = await fetch(`${API_ENDPOINTS.tracks}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(validData)
      });
      const responseData = await handleResponse<Track>(response);
      return trackSchema.parse(responseData);
    },
  
    deleteTrack: async (id: string): Promise<void> => {
      const response = await fetch(`${API_ENDPOINTS.tracks}/${id}`, {
        method: 'DELETE'
      });
      return handleResponse<void>(response);
    },
  
    uploadAudio: async (id: string, file: File): Promise<Track> => {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch(`${API_ENDPOINTS.tracks}/${id}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await handleResponse<Track>(response);
      return trackSchema.parse(data);
    },
  
    deleteAudio: async (id: string): Promise<Track> => {
      const response = await fetch(`${API_ENDPOINTS.tracks}/${id}/file`, {
        method: 'DELETE'
      });
      const data = await handleResponse<Track>(response);
      return trackSchema.parse(data);
    }
  };
  
  // Genres API
  export const genresApi = {
    getGenres: async (): Promise<string[]> => {
      const response = await fetch(API_ENDPOINTS.genres);
      const data = await handleResponse<string[]>(response);
      return z.array(z.string()).parse(data);
    }
  };
  