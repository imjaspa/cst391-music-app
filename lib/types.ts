export interface Album {
  id: number;
  title: string;
  artist: string;
  year: number;
  image: string;
  description: string;
}

export interface Track {
  id: number;
  album_id: number;
  title: string;
  number: number;
  video_url: string | null;
  lyrics: string | null;
}
