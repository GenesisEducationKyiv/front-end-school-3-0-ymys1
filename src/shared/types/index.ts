// Track types
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  slug: string;
  coverImage?: string;
  audioFile?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrackDto {
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  coverImage?: string;
}

export interface UpdateTrackDto {
  title?: string;
  artist?: string;
  album?: string;
  genres?: string[];
  coverImage?: string;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DeleteBulkResponse {
  success: string[];
  failed: string[];
}

export interface ApiError {
  error: string;
}

// Filter, sort and pagination types
export interface TrackFilters {
  search?: string;
  genre?: string;
  artist?: string;
}

export interface SortOptions {
  sortBy: 'title' | 'artist' | 'album' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export type TrackQueryParams = TrackFilters & SortOptions & PaginationOptions;
