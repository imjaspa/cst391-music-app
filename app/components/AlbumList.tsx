"use client";

import AlbumCard from "./AlbumCard";
import { Album } from "@/lib/types";

interface AlbumListProps {
  albumList: Album[];
  onClick: (album: Album, uri: string) => void;
}

export default function AlbumList({ albumList, onClick }: AlbumListProps) {
  const albums = albumList.map((album) => (
    <AlbumCard
      key={album.id}
      album={album}
      onClick={onClick}
    />
  ));

  return <div className="container">{albums}</div>;
}
