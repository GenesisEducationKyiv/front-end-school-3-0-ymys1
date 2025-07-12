import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Search as SearchIcon } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const SearchExample: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Search Tracks</Label>
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search tracks..." className="pl-9" />
      </div>
    </div>
  ),
};
