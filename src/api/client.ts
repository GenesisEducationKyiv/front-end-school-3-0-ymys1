import {
    Track,
    trackSchema,
    createTrackSchema,
    updateTrackSchema,
    CreateTrackDto,
    UpdateTrackDto
  } from '../shared/schemas/track.schema';
  import {
    PaginatedResponse,
    TrackQueryParams,
    paginatedResponseSchema,
    trackQuerySchema
  } from '../shared/schemas/common.schema';
  import { z } from 'zod';
  import { Result, ok, err } from 'neverthrow';
  
  const API_URL = 'http://localhost:8000';
  const API_ENDPOINTS = {
    tracks: `${API_URL}/api/tracks`,
    genres: `${API_URL}/api/genres`,
    files: `${API_URL}/api/files`,
  } as const;
  
  async function handleResponse<T>(response: Response, schema: z.ZodType<T>): Promise<Result<T, Error>> {
    if (!response.ok) {
      try {
        const errorData = await response.json();
        return err(new Error(errorData.error || `Error: ${response.status} ${response.statusText}`));
      } catch (_e) {
        return err(new Error(`Error: ${response.status} ${response.statusText}`));
      }
    }

    if (response.status === 204) {
      return ok({} as T);
    }

    try {
      const data = await response.json();
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        return err(new Error(`Invalid response format: ${parsed.error.message}`));
      }
      return ok(parsed.data);
    } catch (_e) {
      return err(new Error('Failed to parse response'));
    }
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
    getTracks: async (params: Partial<TrackQueryParams> = {}): Promise<Result<PaginatedResponse<Track>, Error>> => {
      const validParams = trackQuerySchema.partial().safeParse(params);
      if (!validParams.success) {
        return err(new Error('Invalid query parameters'));
      }
      const queryString = buildQueryString({
        page: validParams.data.page || 1,
        limit: validParams.data.pageSize || 20,
        sort: validParams.data.sortBy,
        order: validParams.data.sortOrder,
        search: validParams.data.search,
        genre: validParams.data.genre,
        artist: validParams.data.artist
      });
      const response = await fetch(`${API_ENDPOINTS.tracks}${queryString}`);
      return handleResponse(response, paginatedResponseSchema(trackSchema));
    },
  
    getTrack: async (slug: string): Promise<Result<Track, Error>> => {
      const response = await fetch(`${API_ENDPOINTS.tracks}/${slug}`);
      return handleResponse(response, trackSchema);
    },
  
    createTrack: async (data: CreateTrackDto): Promise<Result<Track, Error>> => {
      const validData = createTrackSchema.safeParse(data);
      if (!validData.success) {
        return err(new Error('Invalid track data'));
      }
      const response = await fetch(API_ENDPOINTS.tracks, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(validData.data)
      });
      return handleResponse(response, trackSchema);
    },
  
    updateTrack: async (id: string, data: UpdateTrackDto): Promise<Result<Track, Error>> => {
      const validData = updateTrackSchema.safeParse(data);
      if (!validData.success) {
        return err(new Error('Invalid track data'));
      }
      const response = await fetch(`${API_ENDPOINTS.tracks}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(validData.data)
      });
      return handleResponse(response, trackSchema);
    },
  
    deleteTrack: async (id: string): Promise<Result<void, Error>> => {
      const response = await fetch(`${API_ENDPOINTS.tracks}/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response, z.void());
    },
  
    uploadAudio: async (id: string, file: File): Promise<Result<Track, Error>> => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_ENDPOINTS.tracks}/${id}/upload`, {
        method: 'POST',
        body: formData
      });
      return handleResponse(response, trackSchema);
    },
  
    deleteAudio: async (id: string): Promise<Result<Track, Error>> => {
      const response = await fetch(`${API_ENDPOINTS.tracks}/${id}/file`, {
        method: 'DELETE'
      });
      return handleResponse(response, trackSchema);
    }
  };
  
  // Genres API
  export const genresApi = {
    getGenres: async (): Promise<Result<string[], Error>> => {
      const response = await fetch(API_ENDPOINTS.genres);
      return handleResponse(response, z.array(z.string()));
    }
  };
