import { NextResponse } from "next/server";
import {
  getPlaylist,
  updatePlaylist,
  deletePlaylist
} from "@/lib/playlistHandlers";
import type { PlaylistUpdateBody } from "@/lib/types";

export async function GET(
  _: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; 

  const data = await getPlaylist(id);
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const body = (await req.json()) as PlaylistUpdateBody;

  const data = await updatePlaylist(id, body);
  return NextResponse.json({ data });
}

export async function DELETE(
  _: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  await deletePlaylist(id);
  return NextResponse.json({ message: "Playlist deleted" });
}
