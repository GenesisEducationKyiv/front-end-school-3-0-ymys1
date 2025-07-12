import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../components/ui/badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const GenreExample: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="secondary">Rock</Badge>
      <Badge variant="secondary">Jazz</Badge>
      <Badge variant="secondary">Pop</Badge>
    </div>
  ),
}; 