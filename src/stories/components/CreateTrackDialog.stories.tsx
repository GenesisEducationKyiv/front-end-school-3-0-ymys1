import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CreateTrackDialog } from '../../features/tracksList/components/CreateTrackDialog';
import { Button } from '../../components/ui/mui-button';
import { Plus } from 'lucide-react';

const meta: Meta<typeof CreateTrackDialog> = {
  title: 'Components/CreateTrackDialog',
  component: CreateTrackDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onSave: () => {},
  },
};

export const WithTrigger: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    
    return (
      <div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Track
        </Button>
        <CreateTrackDialog
          open={open}
          onOpenChange={setOpen}
          onSave={() => setOpen(false)}
        />
      </div>
    );
  },
};
