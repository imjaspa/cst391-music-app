"use client";

import { use } from "react";
import OneAlbum from "@/app/components/OneAlbum";

export default function ShowAlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = use(params);

  const id = Number(albumId);

  return <OneAlbum albumId={id} />;
}
