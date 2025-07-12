import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const MusicAppExample: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Add Track
      </Button>
      <Button variant="destructive">
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  ),
}; 