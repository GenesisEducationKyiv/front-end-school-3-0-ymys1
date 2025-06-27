import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';
import { Track } from '../../shared/schemas/track.schema';

interface Pagination {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
}

interface TracksState {
    items: Track[];
    pagination: Pagination;
    loading: boolean;
    error: string | null;
    filterOptions: {
        artists: string[];
        genres: string[];
    };
}

const initialState: TracksState = {
    items: [],
    pagination: {
        limit: 20,
        page: 1,
        total: 0,
        totalPages: 0
    },
    loading: false,
    error: null,
    filterOptions: {
        artists: [],
        genres: []
    }
};

// Helper function to extract unique values and sort them
const extractFilterOptions = (tracks: Track[]) => {
    if (!Array.isArray(tracks)) return { artists: [], genres: [] };
    
    const uniqueArtists = new Set(tracks.map(track => track.artist));
    const uniqueGenres = new Set(tracks.flatMap(track => track.genres));

    return {
        artists: Array.from(uniqueArtists).sort(),
        genres: Array.from(uniqueGenres).sort()
    };
};

const tracksSlice = createSlice({
    name: 'tracks',
    initialState,
    reducers: {
        setTracks: (state, action: PayloadAction<Track[]>) => {
            state.items = action.payload;
            state.filterOptions = extractFilterOptions(action.payload);
        },
        setPagination: (state, action: PayloadAction<Pagination>) => {
            state.pagination = action.payload;
        },
        addTrack: (state, action: PayloadAction<Track>) => {
            state.items.push(action.payload);
            state.filterOptions = extractFilterOptions(state.items);
        },
        updateTrack: (state, action: PayloadAction<Track>) => {
            const index = state.items.findIndex((track: Track) => track.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
                state.filterOptions = extractFilterOptions(state.items);
            }
        },
        deleteTrack: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((track: Track) => track.id !== action.payload);
            state.filterOptions = extractFilterOptions(state.items);
        },
        editTrack: (state, action: PayloadAction<Track>) => {
            const index = state.items.findIndex((track: Track) => track.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    }
});

// Selectors
export const selectTracks = (state: RootState) => state.tracks.items;
export const selectFilterOptions = (state: RootState) => state.tracks.filterOptions;
export const selectLoading = (state: RootState) => state.tracks.loading;
export const selectError = (state: RootState) => state.tracks.error;

export const { setTracks, setPagination, addTrack, updateTrack, deleteTrack, editTrack, setLoading, setError } = tracksSlice.actions;
export default tracksSlice.reducer;
