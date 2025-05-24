export const SORT_OPTIONS = {
    BY: [
      { value: 'title', label: 'Title' },
      { value: 'artist', label: 'Artist' },
      { value: 'album', label: 'Album' },
      { value: 'genre', label: 'Genre' }
    ],
    ORDER: [
      { value: 'asc', label: 'Ascending' },
      { value: 'desc', label: 'Descending' }
    ]
  } as const;
