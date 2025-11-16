"use client";

import { useEffect, useState } from "react";
import { Album, Track } from "@/lib/types";
import { get } from "@/lib/apiClient";

interface OneAlbumProps {
  albumId: number;
}

export default function OneAlbum({ albumId }: OneAlbumProps) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const [loadingAlbum, setLoadingAlbum] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // Load album
  useEffect(() => {
    const loadAlbum = async () => {
      try {
        setLoadingAlbum(true);
        // IMPORTANT: apiClient adds /api automatically
        const data = await get<Album>(`/albums/${albumId}`);
        setAlbum(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error loading album");
      } finally {
        setLoadingAlbum(false);
      }
    };

    loadAlbum();
  }, [albumId]);

  // Load tracks
  useEffect(() => {
    const loadTracks = async () => {
      try {
        setLoadingTracks(true);
        // IMPORTANT: apiClient adds /api automatically
        const data = await get<Track[]>(`/tracks/${albumId}`);
        setTracks(data);
        setSelectedTrack(data[0] ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error loading tracks");
      } finally {
        setLoadingTracks(false);
      }
    };

    loadTracks();
  }, [albumId]);

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  if (loadingAlbum || !album) {
    return <p className="mt-3">Loading album…</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Album Details: {album.title}</h2>

      <div className="row mt-3">
        {/* LEFT SIDEBAR — Album + Tracks */}
        <div className="col-sm-3">
          <div className="card">
            <img src={album.image} className="card-img-top" alt={album.title} />
            <div className="card-body">
              <h5 className="card-title">{album.title}</h5>
              <p className="card-text">{album.description}</p>

              <ul className="list-group">
                <li className="list-group-item active">Tracks</li>

                {loadingTracks && <li className="list-group-item">Loading…</li>}
                {!loadingTracks && tracks.length === 0 && (
                  <li className="list-group-item">No tracks found.</li>
                )}

                {tracks.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    className={`list-group-item list-group-item-action ${
                      selectedTrack?.id === track.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedTrack(track)}
                  >
                    {track.number}. {track.title}
                  </button>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — Lyrics + Video */}
        <div className="col-sm-9">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Lyrics</h5>
              {selectedTrack?.lyrics ? (
                <pre style={{ whiteSpace: "pre-wrap" }}>{selectedTrack.lyrics}</pre>
              ) : (
                <p className="text-muted">Select a track to view lyrics.</p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Video</h5>
              {selectedTrack?.video_url ? (
                <a href={selectedTrack.video_url} target="_blank">
                  Open Video
                </a>
              ) : (
                <p className="text-muted">No video available for this track.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
