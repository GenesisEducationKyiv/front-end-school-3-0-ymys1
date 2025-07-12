import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { Result, ok, err } from 'neverthrow';
import { Track, CreateTrackDto, UpdateTrackDto } from '../shared/schemas/track.schema';
import { PaginatedResponse, TrackQueryParams } from '../shared/schemas/common.schema';

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

const TRACK_FRAGMENT = gql`
  fragment TrackFields on Track {
    id
    title
    artist
    album
    genres
    slug
    coverImage
    audioFile
    createdAt
    updatedAt
  }
`;

// Queries
const GET_TRACKS = gql`
  query GetTracks(
    $page: Int
    $limit: Int
    $search: String
    $genre: String
    $artist: String
    $sortBy: String
    $sortOrder: String
  ) {
    tracks(
      page: $page
      limit: $limit
      search: $search
      genre: $genre
      artist: $artist
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      data {
        ...TrackFields
      }
      meta {
        page
        limit
        total
        totalPages
      }
    }
  }
  ${TRACK_FRAGMENT}
`;

const GET_TRACK = gql`
  query GetTrack($slug: String!) {
    track(slug: $slug) {
      ...TrackFields
    }
  }
  ${TRACK_FRAGMENT}
`;

const GET_FILE_URL = gql`
  query GetFileUrl($filename: String!) {
    fileUrl(filename: $filename)
  }
`;

const GET_GENRES = gql`
  query GetGenres {
    genres
  }
`;

// Mutations
const CREATE_TRACK = gql`
  mutation CreateTrack($input: CreateTrackInput!) {
    createTrack(input: $input) {
      ...TrackFields
    }
  }
  ${TRACK_FRAGMENT}
`;

const UPDATE_TRACK = gql`
  mutation UpdateTrack($id: String!, $input: UpdateTrackInput!) {
    updateTrack(id: $id, input: $input) {
      ...TrackFields
    }
  }
  ${TRACK_FRAGMENT}
`;

const DELETE_TRACK = gql`
  mutation DeleteTrack($id: String!) {
    deleteTrack(id: $id)
  }
`;

const UPLOAD_AUDIO = gql`
  mutation UploadAudio($id: String!, $file: Upload!) {
    uploadAudio(id: $id, file: $file) {
      ...TrackFields
    }
  }
  ${TRACK_FRAGMENT}
`;

// Helper
async function executeQuery<T>(queryFn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    const result = await queryFn();
    return ok(result);
  } catch (error) {
    return err(new Error(error instanceof Error ? error.message : 'GraphQL operation failed'));
  }
}

export const filesApi = {
  getFileUrl: async (filename: string | undefined): Promise<Result<string | undefined, Error>> => {
    if (!filename) return ok(undefined);
    
    return executeQuery(async () => {
      const { data } = await client.query({
        query: GET_FILE_URL,
        variables: { filename },
      });
      return data.fileUrl;
    });
  }
};

export const tracksApi = {
  getTracks: async (params: Partial<TrackQueryParams> = {}): Promise<Result<PaginatedResponse<Track>, Error>> => {
    return executeQuery(async () => {
      const { data } = await client.query({
        query: GET_TRACKS,
        variables: {
          page: params.page || 1,
          limit: params.pageSize || 20,
          search: params.search,
          genre: params.genre,
          artist: params.artist,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        },
      });
      return data.tracks;
    });
  },

  getTrack: async (slug: string): Promise<Result<Track, Error>> => {
    return executeQuery(async () => {
      const { data } = await client.query({
        query: GET_TRACK,
        variables: { slug },
      });
      return data.track;
    });
  },

  createTrack: async (input: CreateTrackDto): Promise<Result<Track, Error>> => {
    return executeQuery(async () => {
      const { data } = await client.mutate({
        mutation: CREATE_TRACK,
        variables: { input },
      });
      return data.createTrack;
    });
  },

  updateTrack: async (id: string, input: UpdateTrackDto): Promise<Result<Track, Error>> => {
    return executeQuery(async () => {
      const { data } = await client.mutate({
        mutation: UPDATE_TRACK,
        variables: { id, input },
      });
      return data.updateTrack;
    });
  },

  deleteTrack: async (id: string): Promise<Result<void, Error>> => {
    return executeQuery(async () => {
      await client.mutate({
        mutation: DELETE_TRACK,
        variables: { id },
      });
    });
  },

  uploadAudio: async (id: string, file: File): Promise<Result<Track, Error>> => {
    return executeQuery(async () => {
      const { data } = await client.mutate({
        mutation: UPLOAD_AUDIO,
        variables: { id, file },
      });
      return data.uploadAudio;
    });
  },

  deleteAudio: async (id: string): Promise<Result<Track, Error>> => {
    return executeQuery(async () => {
      const { data } = await client.mutate({
        mutation: UPDATE_TRACK,
        variables: { 
          id, 
          input: { audioFile: null } 
        },
      });
      return data.updateTrack;
    });
  }
};

export const genresApi = {
  getGenres: async (): Promise<Result<string[], Error>> => {
    return executeQuery(async () => {
      const { data } = await client.query({
        query: GET_GENRES,
      });
      return data.genres;
    });
  }
};

export { client as apolloClient };
