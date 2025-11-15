import { NextResponse } from "next/server";
import { listPlaylists, createPlaylist } from "@/lib/playlistHandlers";

export async function GET(req: Request) {
  const data = await listPlaylists(req.url);
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = await createPlaylist(body);
  return NextResponse.json({ data });
}
