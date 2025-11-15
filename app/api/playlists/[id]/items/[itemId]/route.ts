import { NextResponse } from "next/server";
import {
  updatePlaylistItem,
  deletePlaylistItem
} from "@/lib/playlistHandlers";
import type { PlaylistItemUpdateBody } from "@/lib/types";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string; itemId: string }> }
) {
  const { itemId } = await ctx.params;
  const body = (await req.json()) as PlaylistItemUpdateBody;

  const data = await updatePlaylistItem(itemId, body);
  return NextResponse.json({ data });
}

export async function DELETE(
  _: Request,
  ctx: { params: Promise<{ id: string; itemId: string }> }
) {
  const { itemId } = await ctx.params;

  await deletePlaylistItem(itemId);
  return NextResponse.json({ message: "Item removed" });
}
