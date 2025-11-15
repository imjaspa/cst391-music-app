export interface Album {
  id: number;
  title: string;
  artist: string;
  year: number;
  image: string;
  description: string;

  tracks: Track[];
}

export interface Track {
  id: number;
  album_id: number;
  title: string;
  number: number;
  video_url: string | null;
  lyrics: string | null;
}


export interface Playlist {
  id: number;
  title: string;
  description: string | null;
  coverImage: string | null;
  isPublic: boolean;
  ownerId: string;
  flagged: boolean;
  hidden: boolean;
}

export interface PlaylistItem {
  id: number;
  playlistId: number;
  songId: string;
  position: number;
}

// For request bodies
export interface PlaylistCreateBody {
  title: string;
  description?: string | null;
  coverImage?: string | null;
  isPublic?: boolean;
  ownerId: string;
}

export interface PlaylistUpdateBody {
  title?: string | null;
  description?: string | null;
  coverImage?: string | null;
  isPublic?: boolean;
}

export interface PlaylistItemCreateBody {
  songId: string;
  position?: number;
}

export interface PlaylistItemUpdateBody {
  position: number;
}

export interface AdminActionBody {
  action: "hide" | "delete";
}

