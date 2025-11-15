import { NextResponse } from "next/server";
import { adminAction } from "@/lib/playlistHandlers";
import type { AdminActionBody } from "@/lib/types";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const { action } = (await req.json()) as AdminActionBody;

  const result = await adminAction(id, action);
  return NextResponse.json({ message: `Action applied: ${result}` });
}
