import { findProfileByUuidWithTextures } from "@/queries/profile";
import { buildProfile, untrimUuid } from "@/lib/yggdrasil/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;

  const searchParams = req.nextUrl.searchParams;

  const unsigned = searchParams.get("unsigned") !== "false";

  const profile = await findProfileByUuidWithTextures(untrimUuid(uuid));

  if (!profile) {
    return new NextResponse(null, { status: 204 });
  }

  const profileWithProperties = buildProfile(profile, unsigned);

  return NextResponse.json(profileWithProperties);
}
