import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { Album, Track } from "@/lib/types";

export const runtime = "nodejs";

// GET /api/albums/[slug]
// Handles BOTH albumId (number) AND artist name (string)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const pool = getPool();

  // ---------------------------------------------
  // CASE 1: SLUG IS A NUMBER → FETCH SINGLE ALBUM
  // ---------------------------------------------
  if (!isNaN(Number(slug))) {
    const albumId = Number(slug);

    try {
      const resAlbum = await pool.query(
        `SELECT * FROM albums WHERE id = $1`,
        [albumId]
      );

      if (resAlbum.rows.length === 0) {
        return NextResponse.json(
          { error: "Album not found" },
          { status: 404 }
        );
      }

      const albumRow = resAlbum.rows[0];

      const resTracks = await pool.query(
        `SELECT * FROM tracks WHERE album_id = $1 ORDER BY number`,
        [albumId]
      );

      const album: Album = {
        id: albumRow.id,
        title: albumRow.title,
        artist: albumRow.artist,
        year: albumRow.year,
        image: albumRow.image,
        description: albumRow.description,
        tracks: resTracks.rows.map((t) => ({
          id: t.id,
          album_id: t.album_id,
          number: t.number,
          title: t.title,
          lyrics: t.lyrics,
          video_url: t.video_url,
        })),
      };

      return NextResponse.json(album);
    } catch (err) {
      console.error("GET by ID error:", err);
      return NextResponse.json(
        { error: "Failed to fetch album" },
        { status: 500 }
      );
    }
  }

  // -------------------------------------------------
  // CASE 2: SLUG IS A STRING → FETCH ALBUMS BY ARTIST
  // -------------------------------------------------
  const artistName = slug;

  try {
    const albumsRes = await pool.query(
      `SELECT * FROM albums WHERE LOWER(artist) = LOWER($1)`,
      [artistName]
    );

    const albums = albumsRes.rows;

    if (albums.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const albumIds = albums.map((a) => a.id);

    const tracksRes = await pool.query(
      `SELECT * FROM tracks WHERE album_id = ANY($1) ORDER BY number`,
      [albumIds]
    );

    const tracks = tracksRes.rows;

    const tracksByAlbum: Record<number, Track[]> = {};

    for (const t of tracks) {
      (tracksByAlbum[t.album_id] ||= []).push({
        id: t.id,
        album_id: t.album_id,
        number: t.number,
        title: t.title,
        lyrics: t.lyrics,
        video_url: t.video_url,
      });
    }

    const result: Album[] = albums.map((a) => ({
      id: a.id,
      title: a.title,
      artist: a.artist,
      year: a.year,
      image: a.image,
      description: a.description,
      tracks: tracksByAlbum[a.id] || [],
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(`GET /api/albums/${artistName} error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch albums by artist" },
      { status: 500 }
    );
  }
}

// DELETE /api/albums/[slug]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const id = Number(slug);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid album ID" }, { status: 400 });
  }

  try {
    const pool = getPool();

    const del = await pool.query(
      `DELETE FROM albums WHERE id = $1 RETURNING id`,
      [id]
    );

    if (del.rowCount === 0) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Album ${id} deleted` });
  } catch (error) {
    console.error(`DELETE /api/albums/${id} error:`, error);
    return NextResponse.json(
      { error: "Failed to delete album" },
      { status: 500 }
    );
  }
}
