import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import tracksSlice, { setTracks, addTrack, selectTracks } from '../tracksListSlice';
import type { Track } from '../../../shared/schemas/track.schema';

const mockTrack: Track = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  genres: ['Rock'],
  slug: 'test-track',
  audioFile: 'test-audio.mp3',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

describe('tracksListSlice', () => {
  it('should set tracks in the state', () => {
    const store = configureStore({
      reducer: {
        tracks: tracksSlice
      }
    });

    store.dispatch(setTracks([mockTrack]));

    const state = store.getState();
    expect(selectTracks(state)).toEqual([mockTrack]);
  });

  it('should add a new track to the state', () => {
    const store = configureStore({
      reducer: {
        tracks: tracksSlice
      }
    });

    store.dispatch(addTrack(mockTrack));

    const state = store.getState();
    expect(selectTracks(state)).toEqual([mockTrack]);
  });
}); 