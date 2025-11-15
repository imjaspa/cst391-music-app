"use client";

import { Album } from "@/lib/types";
import { useRouter } from "next/navigation";

interface AlbumCardProps {
  album: Album;
  onClick: (album: Album, uri: string) => void;
}

export default function AlbumCard({ album, onClick }: AlbumCardProps) {
  const router = useRouter();

  const handleButtonClick = (uri: string) => {
    onClick(album, uri);
    router.push(`${uri}${album.id}`);
  };

  return (
    <div className="card" style={{ width: "18rem" }}>
      <img
        src={album.image}
        className="card-img-top"
        alt={album.title || "Album cover"}
      />
      <div className="card-body">
        <h5 className="card-title">{album.title}</h5>
        <p className="card-text">{album.description}</p>

        <button
          onClick={() => handleButtonClick("/show/")}
          className="btn btn-primary"
        >
          View
        </button>

        <button
          onClick={() => handleButtonClick("/edit/")}
          className="btn btn-secondary"
          style={{ marginLeft: "8px" }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
