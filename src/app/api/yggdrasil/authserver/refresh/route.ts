import { createAccessToken, verifyAccessToken } from "@/lib/yggdrasil/jwt";
import { NextResponse } from "next/server";
import { ForbiddenOperationException, IllegalArgumentException } from "@/lib/yggdrasil/exception";
import { findProfileByUuidAndUserId } from "@/queries/profile";
import { buildProfile, trimUuid, untrimUuid } from "@/lib/yggdrasil/utils";

export async function POST(req: Request) {
  const { accessToken, clientToken, requestUser, selectedProfile } = await req.json();

  const verified = await verifyAccessToken(accessToken, clientToken);

  // Check if fully expired, semi expired token can be refreshed
  if (!verified.valid || (clientToken && !verified.clientMatch)) {
    return NextResponse.json(new ForbiddenOperationException("Invalid token"), {
      status: ForbiddenOperationException.status,
    });
  }

  let targetProfileId: string;
  const { userId, profileId } = verified.payload!;
  if (selectedProfile) {
    // Can't rebind profile
    if (profileId && profileId !== selectedProfile.id) {
      return NextResponse.json(new IllegalArgumentException(), {
        status: IllegalArgumentException.status,
      });
    }

    targetProfileId = selectedProfile.id;
  } else {
    targetProfileId = profileId;
  }

  let profile;
  if (targetProfileId) {
    profile = await findProfileByUuidAndUserId(untrimUuid(targetProfileId), userId);
    // Can only bind own profile
    if (!profile) {
      return NextResponse.json(new ForbiddenOperationException("Invalid profile"), {
        status: ForbiddenOperationException.status,
      });
    }
  }

  const newToken = await createAccessToken(
    userId,
    clientToken,
    targetProfileId ? trimUuid(profile.uuid) : undefined,
  );

  return NextResponse.json({
    accessToken: newToken,
    clientToken,
    selectedProfile: profile ? buildProfile(profile) : undefined,
    user: requestUser ? { id: userId } : undefined,
  });
}
