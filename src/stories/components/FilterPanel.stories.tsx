import type { Meta, StoryObj } from '@storybook/react';
import { FilterPanel } from '../../features/filterPanel/filterPanel';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof FilterPanel> = {
  title: 'Components/FilterPanel',
  component: FilterPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="w-full max-w-4xl">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSearch: Story = {
  parameters: {
    docs: {
      description: {
        story: 'FilterPanel with search functionality for filtering tracks by title, artist, or album.',
      },
    },
  },
}; 