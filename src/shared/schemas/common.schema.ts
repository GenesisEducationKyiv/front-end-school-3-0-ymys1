import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().min(1),
  pageSize: z.number().min(1),
});

export const sortSchema = z.object({
  sortBy: z.enum(['title', 'artist', 'album', 'createdAt']),
  sortOrder: z.enum(['asc', 'desc'])
});

export const filterSchema = z.object({
  search: z.string().optional(),
  genre: z.string().optional(),
  artist: z.string().optional()
});

export const trackQuerySchema = z.object({
  ...paginationSchema.shape,
  ...sortSchema.shape,
  ...filterSchema.shape
});

// Generic paginated response schema
export function paginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    meta: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number()
    })
  });
}

export type PaginationOptions = z.infer<typeof paginationSchema>;
export type SortOptions = z.infer<typeof sortSchema>;
export type TrackFilters = z.infer<typeof filterSchema>;
export type TrackQueryParams = z.infer<typeof trackQuerySchema>;
export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
