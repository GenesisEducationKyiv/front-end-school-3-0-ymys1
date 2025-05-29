import { useSearchParams } from 'react-router-dom';

interface Filters {
    search: string;
    genre: string | null;
    artist: string | null;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

interface UpdateFilters {
    search?: string;
    genre?: string | null;
    artist?: string | null;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const useFilterParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateFilters = (updates: UpdateFilters) => {
        const newParams = new URLSearchParams(searchParams);
        
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        });

        setSearchParams(newParams);
    };

    return {
        filters: {
            search: searchParams.get('search') || '',
            genre: searchParams.get('genre'),
            artist: searchParams.get('artist'),
            sortBy: searchParams.get('sortBy') || 'title',
            sortOrder: (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'
        },
        updateFilters
    };
}; 