import { useState, useEffect } from "react"
import { Track } from "../../../shared/schemas/track.schema"
import { Badge } from "../../../components/ui/badge"
import { Edit, MoreVertical, Upload, Trash2, Music } from "lucide-react"
import { cn } from "../../../shared/utils/utils"
import { filesApi } from "../../../api/graphql"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"

interface TrackItemProps {
  track: Track
  onEdit?: (track: Track) => void
  onDelete?: (track: Track) => void
  onUpload?: (track: Track) => void
  className?: string
  isSelected?: boolean
  onToggleSelect?: () => void
}

export function TrackItem({
  track,
  onEdit,
  onDelete,
  onUpload,
  className,
}: TrackItemProps) {
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    const fetchAudioUrl = async () => {
      if (track.audioFile) {
        const result = await filesApi.getFileUrl(track.audioFile);
        if (result.isOk()) {
          setAudioUrl(result.value);
        } else {
          console.error('Failed to get file URL:', result.error);
        }
      }
    };
    fetchAudioUrl();
  }, [track.audioFile]);

  const hasAudio = Boolean(track.audioFile)
  const defaultCoverImage = "https://picsum.photos/seed/default/300/300"
  const coverImage = track.coverImage || defaultCoverImage

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-lg border border-[#E5E7EB] bg-card p-4 shadow-sm transition-all hover:shadow-md",
        className
      )}
      data-testid={`track-item-${track.id}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <div className="relative mb-3 h-16 w-16 flex-shrink-0 overflow-hidden rounded-md sm:mb-0">
          <img
            src={coverImage}
            alt={`${track.title} cover`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
            <Music className="h-8 w-8 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className="line-clamp-1 font-medium text-foreground"
                data-testid={`track-item-${track.id}-title`}
              >
                {track.title}
              </h3>
              <p
                className="line-clamp-1 text-sm text-muted-foreground"
                data-testid={`track-item-${track.id}-artist`}
              >
                {track.artist}
              </p>
              <p
                className={cn(
                  "line-clamp-1 text-xs text-muted-foreground min-h-[1.25rem]",
                  !track.album && "invisible"
                )}
              >
                {track.album || "placeholder"}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  data-testid={`track-actions-${track.id}`}
                  className="bg-white! hover:bg-[#E5E7EB] focus:ring-0"
                >
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] bg-white border-[#E5E7EB]">
                <DropdownMenuItem
                  onClick={() => onEdit?.(track)}
                  data-testid={`edit-track-${track.id}`}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpload?.(track)}
                  data-testid={`upload-track-${track.id}`}
                  className="cursor-pointer"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {hasAudio ? "Update Audio" : "Upload Audio"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(track)}
                  className="cursor-pointer"
                  data-testid={`delete-track-${track.id}`}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {track.genres.map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs bg-black text-white hover:bg-black/90">
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 relative">
        {hasAudio ? (
          <div className="audio-container">
            <audio
              key={track.id}
              controls
              className="w-full"
              src={audioUrl}
              data-testid={`audio-player-${track.id}`}
              onLoadStart={(e) => {
                e.currentTarget.currentTime = 0;
              }}
              onPlay={(e) => {
                const audioElement = e.currentTarget;
                audioElement.setAttribute('data-testid', `play-button-${track.id}`);
              }}
              onPause={(e) => {
                const audioElement = e.currentTarget;
                audioElement.setAttribute('data-testid', `pause-button-${track.id}`);
              }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : (
          <audio
            controls
            className="pointer-events-none w-full opacity-40 grayscale"
            tabIndex={-1}
            data-testid={`audio-player-${track.id}`}
          >
            <source />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  )
}
