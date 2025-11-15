import { getPool } from "@/lib/db";
import type {
  Playlist,
  PlaylistItem,
  PlaylistCreateBody,
  PlaylistUpdateBody,
  PlaylistItemCreateBody,
  PlaylistItemUpdateBody,
  AdminActionBody
} from "@/lib/types";


export async function listPlaylists(url: string): Promise<Playlist[]> {
  const { searchParams } = new URL(url);
  const ownerId = searchParams.get("ownerid");
  const isPublic = searchParams.get("public");

  const db = getPool();
  const conditions: string[] = [];
  const values: unknown[] = [];

  let query = "SELECT * FROM playlist";

  if (ownerId) {
    conditions.push(`ownerid = $${conditions.length + 1}`);
    values.push(ownerId);
  }

  if (isPublic) {
    conditions.push(`ispublic = $${conditions.length + 1}`);
    values.push(isPublic === "true");
  }

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");

  const { rows } = await db.query(query, values);
  return rows as Playlist[];
}

export async function createPlaylist(body: PlaylistCreateBody): Promise<Playlist> {
  const db = getPool();

  const { rows } = await db.query(
    `INSERT INTO playlist (title, description, coverimage, ispublic, ownerid)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [
      body.title,
      body.description ?? null,
      body.coverImage ?? null,
      body.isPublic ?? false,
      body.ownerId
    ]
  );

  return rows[0] as Playlist;
}

export async function getPlaylist(id: string): Promise<Playlist | null> {
  const db = getPool();
  const { rows } = await db.query("SELECT * FROM playlist WHERE id=$1", [id]);
  return rows[0] ?? null;
}

export async function updatePlaylist(
  id: string,
  body: PlaylistUpdateBody
): Promise<Playlist | null> {
  const db = getPool();

  const { rows } = await db.query(
    `UPDATE playlist SET
       title = COALESCE($1,title),
       description = COALESCE($2,description),
       coverimage = COALESCE($3,coverimage),
       ispublic = COALESCE($4,ispublic)
     WHERE id=$5
     RETURNING *`,
    [
      body.title ?? null,
      body.description ?? null,
      body.coverImage ?? null,
      body.isPublic ?? null,
      id
    ]
  );

  return rows[0] ?? null;
}

export async function deletePlaylist(id: string): Promise<void> {
  const db = getPool();
  await db.query("DELETE FROM playlist WHERE id=$1", [id]);
}

export async function addPlaylistItem(
  playlistId: string,
  body: PlaylistItemCreateBody
): Promise<PlaylistItem> {
  const db = getPool();

  const { rows } = await db.query(
    `INSERT INTO playlistitem (playlistid, trackid, position)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [playlistId, body.songId, body.position ?? 0]
  );

  return rows[0] as PlaylistItem;
}

export async function updatePlaylistItem(
  itemId: string,
  body: PlaylistItemUpdateBody
): Promise<PlaylistItem | null> {
  const db = getPool();

  const { rows } = await db.query(
    `UPDATE playlistitem SET position=$1 WHERE id=$2 RETURNING *`,
    [body.position, itemId]
  );

  return rows[0] ?? null;
}

export async function deletePlaylistItem(itemId: string): Promise<void> {
  const db = getPool();

  await db.query("DELETE FROM playlistitem WHERE id=$1", [itemId]);
}

export async function adminListplaylist(url: string): Promise<Playlist[]> {
  const { searchParams } = new URL(url);
  const flagged = searchParams.get("flagged");
  const ownerId = searchParams.get("ownerid");

  const db = getPool();
  let query = "SELECT * FROM playlist";
  const conds: string[] = [];
  const vals: unknown[] = [];

  if (flagged) {
    conds.push(`flagged = $${conds.length + 1}`);
    vals.push(flagged === "true");
  }

  if (ownerId) {
    conds.push(`ownerid = $${conds.length + 1}`);
    vals.push(ownerId);
  }

  if (conds.length) query += " WHERE " + conds.join(" AND ");

  const { rows } = await db.query(query, vals);
  return rows as Playlist[];
}

export async function adminAction(
  id: string,
  action: AdminActionBody["action"]
): Promise<string | null> {
  const db = getPool();

  if (action === "hide") {
    await db.query(`UPDATE playlist SET hidden=true WHERE id=$1`, [id]);
    return "hide";
  }

  if (action === "delete") {
    await db.query(`DELETE FROM playlist WHERE id=$1`, [id]);
    return "delete";
  }

  return null;
}
