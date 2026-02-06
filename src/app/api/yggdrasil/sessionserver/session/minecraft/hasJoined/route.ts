import { NextRequest, NextResponse } from "next/server";
import { sessionStore } from "@/lib/yggdrasil/session";
import { findProfileByUuidWithTextures } from "@/queries/profile";
import { buildProfile, untrimUuid } from "@/lib/yggdrasil/utils";
import { trimIp } from "@/lib/yggdrasil/ip";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const username = searchParams.get("username");
  const serverId = searchParams.get("serverId");
  const ip = searchParams.get("ip");

  if (!username || !serverId) {
    return new NextResponse(null, { status: 204 });
  }

  const session = await sessionStore.get(serverId);

  if (
    session &&
    session.profileName === username &&
    (ip ? trimIp(session.ip) === trimIp(ip) : true)
  ) {
    const profile = await findProfileByUuidWithTextures(untrimUuid(session.profileId));

    if (profile) {
      return NextResponse.json(buildProfile(profile));
    }
  }

  return new NextResponse(null, { status: 204 });
}
