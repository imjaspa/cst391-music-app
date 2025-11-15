"use client";

import AlbumCard from "./AlbumCard";
import { Album } from "@/lib/types";

interface AlbumListProps {
  albumList: Album[];
  onClick: (album: Album, uri: string) => void;
}

export default function AlbumList({ albumList, onClick }: AlbumListProps) {
  return (
    <div className="row">
      {albumList.map((album) => (
        <div key={album.id} className="col-md-4 mb-4">
          <AlbumCard album={album} onClick={onClick} />
        </div>
      ))}
    </div>
  );
}
