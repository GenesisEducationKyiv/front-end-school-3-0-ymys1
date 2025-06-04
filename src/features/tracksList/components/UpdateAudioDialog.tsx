import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Track } from '../../../shared/schemas/track.schema';

interface UpdateAudioDialogProps {
  track: Track | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (track: Track, file: File) => void;
}

export function UpdateAudioDialog({ track, open, onOpenChange, onUpload }: UpdateAudioDialogProps) {
  const [file, setFile] = useState<File | null>(null);

  if (!track) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onUpload(track, file);
      onOpenChange(false);
      setFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Audio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="audio" className="text-sm font-medium">
              Audio File
            </label>
            <Input
              id="audio"
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!file}>
              Upload
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 