import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading, selectError, selectTracks } from './tracksListSlice';
import { setTracks, updateTrack, deleteTrack, addTrack } from './tracksListSlice';
import { tracksApi } from '../../api/client';
import { Track, CreateTrackDto } from '../../shared/types';
import { useFilterParams } from '../../shared/hooks/useFilterParams';
import { TrackItem } from './components/TrackItem';
import { EditTrackDialog } from './components/EditTrackDialog';
import { DeleteTrackDialog } from './components/DeleteTrackDialog';
import { UpdateAudioDialog } from './components/UpdateAudioDialog';
import { CreateTrackDialog } from './components/CreateTrackDialog';
import { Button } from '../../components/ui/button';
import { Pagination } from './components/Pagination';
import { Plus } from 'lucide-react';

export function TrackList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [deletingTrack, setDeletingTrack] = useState<Track | null>(null);
  const [updatingAudioTrack, setUpdatingAudioTrack] = useState<Track | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { filters } = useFilterParams();
  const { search, genre, artist, sortBy, sortOrder } = filters;

  const dispatch = useDispatch();
  const tracks = useSelector(selectTracks);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    const fetchTracks = async () => {
      const response = await tracksApi.getTracks({
        page: currentPage,
        pageSize: 20,
        search,
        genre: genre || undefined,
        artist: artist || undefined,
        sortBy: (sortBy as 'title' | 'artist' | 'album' | 'createdAt') || undefined,
        sortOrder
      });
      dispatch(setTracks(response.data));
      setTotalPages(response.meta.totalPages);
    };
    fetchTracks();
  }, [dispatch, currentPage, search, genre, artist, sortBy, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditTrack = async (updatedTrack: Track) => {
    try {
      await tracksApi.updateTrack(updatedTrack.id, updatedTrack);
      dispatch(updateTrack(updatedTrack));
    } catch (error) {
      console.error('Failed to update track:', error);
    }
  };

  const handleDeleteTrack = async (track: Track) => {
    try {
      await tracksApi.deleteTrack(track.id);
      dispatch(deleteTrack(track.id));
    } catch (error) {
      console.error('Failed to delete track:', error);
    }
  };

  const handleUploadAudio = async (track: Track, file: File) => {
    try {
      const updatedTrack = await tracksApi.uploadAudio(track.id, file);
      dispatch(updateTrack(updatedTrack));
    } catch (error) {
      console.error('Failed to upload audio:', error);
    }
  };

  const handleCreateTrack = async (trackData: CreateTrackDto, audioFile: File | null) => {
    try {
      const newTrack = await tracksApi.createTrack(trackData);
      if (audioFile) {
        const trackWithAudio = await tracksApi.uploadAudio(newTrack.id, audioFile);
        dispatch(addTrack(trackWithAudio));
      } else {
        dispatch(addTrack(newTrack));
      }
    } catch (error) {
      console.error('Failed to create track:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Track
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tracks.map((track) => (
          <TrackItem
            key={track.id}
            track={track}
            onEdit={() => setEditingTrack(track)}
            onDelete={() => setDeletingTrack(track)}
            onUpload={() => setUpdatingAudioTrack(track)}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <CreateTrackDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleCreateTrack}
      />

      <EditTrackDialog
        track={editingTrack}
        open={!!editingTrack}
        onOpenChange={(open: boolean) => !open && setEditingTrack(null)}
        onSave={handleEditTrack}
      />

      <DeleteTrackDialog
        track={deletingTrack}
        open={!!deletingTrack}
        onOpenChange={(open: boolean) => !open && setDeletingTrack(null)}
        onConfirm={handleDeleteTrack}
      />

      <UpdateAudioDialog
        track={updatingAudioTrack}
        open={!!updatingAudioTrack}
        onOpenChange={(open: boolean) => !open && setUpdatingAudioTrack(null)}
        onUpload={handleUploadAudio}
      />
    </>
  );
}