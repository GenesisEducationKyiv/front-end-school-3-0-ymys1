import { O } from '@mobily/ts-belt';
import type { Option } from '@mobily/ts-belt';
import { useSearchParams } from 'react-router-dom';

interface UpdateFilters {
    search?: Option<string>;
    genre?: Option<string>;
    artist?: Option<string>;
    sortBy?: Option<string>;
    sortOrder?: Option<string>;
}

export const useFilterParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateFilters = (updates: UpdateFilters) => {
        const newParams = new URLSearchParams(searchParams);
        
        Object.entries(updates).forEach(([key, value]) => {
            if (O.isSome(value)) {
                newParams.set(key, O.getExn(value));
            } else {
                newParams.delete(key);
            }
        });

        setSearchParams(newParams);
    };

    const getParamAsOption = (param: string): Option<string> => {
        const value = searchParams.get(param);
        return value && value !== '' ? O.Some(value) : O.None;
    };

    return {
        filters: {
            search: getParamAsOption('search'),
            genre: getParamAsOption('genre'),
            artist: getParamAsOption('artist'),
            sortBy: getParamAsOption('sortBy'),
            sortOrder: getParamAsOption('sortOrder')
        },
        updateFilters
    };
};
