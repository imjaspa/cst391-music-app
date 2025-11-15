import { NextResponse } from "next/server";
import { addPlaylistItem } from "@/lib/playlistHandlers";
import type { PlaylistItemCreateBody } from "@/lib/types";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const body = (await req.json()) as PlaylistItemCreateBody;

  const data = await addPlaylistItem(id, body);
  return NextResponse.json({ data });
}
