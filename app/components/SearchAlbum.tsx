"use client";

import SearchForm from "./SearchForm";
import AlbumList from "./AlbumList";
import { Album } from "@/lib/types";

interface SearchAlbumProps {
  updateSearchResults: (phrase: string) => void;
  albumList: Album[];
  updateSingleAlbum: (album: Album, uri: string) => void;
}

export default function SearchAlbum({
  updateSearchResults,
  albumList,
  updateSingleAlbum,
}: SearchAlbumProps) {
  return (
    <div className="container">
      <SearchForm onSubmit={updateSearchResults} />
      <AlbumList albumList={albumList} onClick={updateSingleAlbum} />
    </div>
  );
}
