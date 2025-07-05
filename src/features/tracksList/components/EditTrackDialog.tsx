import { useState, useEffect } from 'react';
import { Track } from '../../../shared/schemas/track.schema';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';

interface EditTrackDialogProps {
  track: Track | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (track: Track) => void;
}

export default function EditTrackDialog({ track, open, onOpenChange, onSave }: EditTrackDialogProps) {
  const [formData, setFormData] = useState<{
    title: string;
    artist: string;
    album: string;
    genres: string;
  } | null>(null);

  useEffect(() => {
    if (track) {
      setFormData({
        title: track.title,
        artist: track.artist,
        album: track.album || '',
        genres: track.genres.join(', ')
      });
    } else {
      setFormData(null);
    }
  }, [track]);

  if (!track || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...track,
      title: formData.title,
      artist: formData.artist,
      album: formData.album || undefined,
      genres: formData.genres.split(',').map(g => g.trim()).filter(Boolean)
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Track</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev!, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="artist" className="text-sm font-medium">Artist</label>
            <Input
              id="artist"
              value={formData.artist}
              onChange={(e) => setFormData(prev => ({ ...prev!, artist: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="album" className="text-sm font-medium">Album</label>
            <Input
              id="album"
              value={formData.album}
              onChange={(e) => setFormData(prev => ({ ...prev!, album: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="genres" className="text-sm font-medium">Genres (comma-separated)</label>
            <Input
              id="genres"
              value={formData.genres}
              onChange={(e) => setFormData(prev => ({ ...prev!, genres: e.target.value }))}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 