import { createAccessToken, verifyAccessToken } from "@/lib/yggdrasil/jwt";
import { NextResponse } from "next/server";
import { ForbiddenOperationException, IllegalArgumentException } from "@/lib/yggdrasil/exception";
import { findProfileByUuidAndUserId } from "@/queries/profile";
import { buildProfile, untrimUuid } from "@/lib/yggdrasil/utils";

export async function POST(req: Request) {
  const { accessToken, clientToken, requestUser, selectedProfile } = await req.json();

  const verified = await verifyAccessToken(accessToken, clientToken);

  // Check if fully expired, semi expired token can be refreshed
  if (!verified.valid) {
    return NextResponse.json(new ForbiddenOperationException("Invalid token"), {
      status: ForbiddenOperationException.status,
    });
  }

  let profile;
  const { userId, profileId } = verified.payload!;
  if (selectedProfile) {
    // Can't rebind profile
    if (profileId) {
      return NextResponse.json(new IllegalArgumentException(), {
        status: ForbiddenOperationException.status,
      });
    }

    profile = await findProfileByUuidAndUserId(untrimUuid(selectedProfile.id), userId);
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
    selectedProfile ? profile.id : undefined,
  );

  return NextResponse.json({
    accessToken: newToken,
    clientToken,
    selectedProfile: selectedProfile ? buildProfile(profile) : undefined,
    user: requestUser ? { id: userId } : undefined,
  });
}
