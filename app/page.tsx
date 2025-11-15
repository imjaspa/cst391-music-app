"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Album } from "@/lib/types";
import NavBar from "./components/NavBar" 
import SearchAlbum from "./components/SearchAlbum"
import { get } from "@/lib/apiClient";
import AlbumCard from "./components/AlbumCard";
import AlbumList from "./components/AlbumList";


export default function Page() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [currentlySelectedAlbumId, setCurrentlySelectedAlbumId] = useState(0);
  const [error, setError] = useState<string | null>(null);


  const router = useRouter();

  const loadAlbums = async () => {
    try {
      const data = await get<Album[]>("/albums");   
      setAlbumList(data);
      setError(null);
    } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
    } 
  }; 
 

  useEffect(() => {
    loadAlbums();
  }, []);

  const updateSearchResults = (phrase: string) => {
    setSearchPhrase(phrase);
  };

  const updateSingleAlbum = (albumId: number, uri: string) => {
    const indexNumber = albumList.findIndex((a) => a.id === albumId);
    setCurrentlySelectedAlbumId(indexNumber);
    router.push(`${uri}${indexNumber}`);
  };

  const renderedList = albumList.filter((album) => {
    if (
      (album.description ?? "").toLowerCase().includes(searchPhrase.toLowerCase()) ||
      searchPhrase === ""
    ) {
      return true;
    }
    return false;
  });

  return (
    <main className="container mt-4">
      <NavBar />

      {/* <SearchAlbum
        updateSearchResults={updateSearchResults}
        albumList={renderedList}
        updateSingleAlbum={(albumId) =>
          updateSingleAlbum(albumId, "/show/")
        }
      /> */}

      <h1>Jason Pachecos Album List</h1> 

      {albumList.length > 0 && (
        <AlbumList
          albumList={albumList}
          onClick={(album, uri) => updateSingleAlbum(album.id, uri)}
        />
      )} 

      <p>This JSON data is rendered from the Next.js API.</p>

      {error ? (
      <pre
        style={{
          backgroundColor: "#fee",
          color: "#900",
          padding: "1rem",
          borderRadius: "8px",
          fontSize: "1rem",
        }}
      >
        {error}
      </pre>
    ) : (
      <pre
        style={{
          backgroundColor: "#f4f4f4",
          padding: "1rem",
          borderRadius: "8px",
          overflow: "auto",
          color: "#111",
          fontSize: "0.9rem",
          lineHeight: "1.4",
        }}
      >
        {albumList.length > 0 && JSON.stringify(albumList, null, 2)}
      </pre>
    )}
 

      {albumList.length === 0 && <p>Loading albums...</p>}
    </main>
  );
}
