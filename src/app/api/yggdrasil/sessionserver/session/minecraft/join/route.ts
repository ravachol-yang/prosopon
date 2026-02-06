import { verifyAccessToken } from "@/lib/yggdrasil/jwt";
import { NextResponse } from "next/server";
import { ForbiddenOperationException } from "@/lib/yggdrasil/exception";
import prisma from "@/lib/prisma";
import { trimUuid, untrimUuid } from "@/lib/yggdrasil/utils";
import { sessionStore } from "@/lib/yggdrasil/session";
import { getClientIp } from "@/lib/yggdrasil/ip";

export async function POST(req: Request) {
  const { accessToken, selectedProfile, serverId } = await req.json();
  const ip = getClientIp(req.headers);

  const auth = await verifyAccessToken(accessToken);

  if (!auth || auth.semiExpire || auth.payload!.profileId !== selectedProfile) {
    return NextResponse.json(new ForbiddenOperationException("Invalid token"), {
      status: ForbiddenOperationException.status,
    });
  }

  const profile = await prisma.profile.findUnique({
    where: { uuid: untrimUuid(selectedProfile) },
    select: {
      name: true,
      uuid: true,
    },
  });

  if (!profile) {
    return NextResponse.json(new ForbiddenOperationException("Invalid profile"), {
      status: ForbiddenOperationException.status,
    });
  }

  await sessionStore.save(serverId, trimUuid(profile.uuid), profile.name, ip);

  return new NextResponse(null, { status: 204 });
}
