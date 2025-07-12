import type { Meta, StoryObj } from '@storybook/react';
import { TrackItem } from '../../features/tracksList/components/TrackItem';

const meta: Meta<typeof TrackItem> = {
  title: 'Components/TrackItem',
  component: TrackItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockTrack = {
  id: '1',
  title: 'Bohemian Rhapsody',
  artist: 'Queen',
  album: 'A Night at the Opera',
  genres: ['rock', 'progressive'],
  slug: 'bohemian-rhapsody',
  audioFile: undefined,
  coverImage: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const Default: Story = {
  args: {
    track: mockTrack,
  },
};

export const WithManyGenres: Story = {
  args: {
    track: {
      ...mockTrack,
      title: 'Complex Song',
      genres: ['rock', 'jazz', 'fusion', 'progressive', 'experimental'],
    },
  },
}; 