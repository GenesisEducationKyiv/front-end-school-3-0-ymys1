import { useState } from 'react';
import { CreateTrackDto } from '../../../shared/schemas/track.schema';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';

interface CreateTrackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (trackData: CreateTrackDto, audioFile: File | null) => void;
}

export default function CreateTrackDialog({ open, onOpenChange, onSave }: CreateTrackDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genres: '',
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trackData = {
      title: formData.title,
      artist: formData.artist,
      album: formData.album || undefined,
      genres: formData.genres.split(',').map(g => g.trim()).filter(Boolean),
      coverImage: coverImage ? URL.createObjectURL(coverImage) : undefined,
      audioFile: undefined
    };

    onSave(trackData, audioFile);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      title: '',
      artist: '',
      album: '',
      genres: '',
    });
    setAudioFile(null);
    setCoverImage(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Track</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="artist" className="text-sm font-medium">Artist</label>
            <Input
              id="artist"
              value={formData.artist}
              onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="album" className="text-sm font-medium">Album</label>
            <Input
              id="album"
              value={formData.album}
              onChange={(e) => setFormData(prev => ({ ...prev, album: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="genres" className="text-sm font-medium">Genres (comma-separated)</label>
            <Input
              id="genres"
              value={formData.genres}
              onChange={(e) => setFormData(prev => ({ ...prev, genres: e.target.value }))}
              required
              placeholder="rock, jazz, pop"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="audio" className="text-sm font-medium">Audio File</label>
            <Input
              id="audio"
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="cover" className="text-sm font-medium">Cover Image</label>
            <Input
              id="cover"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Track</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
