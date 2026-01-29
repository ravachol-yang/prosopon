import { buildProfile, trimUuid } from "@/lib/yggdrasil/utils";
import { v4 as uuid4 } from "uuid";
import { NextResponse } from "next/server";
import { ForbiddenOperationException } from "@/lib/yggdrasil/exception";
import { checkCredentials } from "@/lib/yggdrasil/auth";
import { createAccessToken } from "@/lib/yggdrasil/jwt";

export async function POST(req: Request) {
  const { username, password, clientToken, requestUser } = await req.json();

  const finalClientToken = clientToken ? clientToken : trimUuid(uuid4());

  const user = await checkCredentials(username, password);

  // require verification
  if (!user || !user.verified) {
    return NextResponse.json(
      new ForbiddenOperationException("Invalid credentials. Invalid username or password."),
      { status: ForbiddenOperationException.status },
    );
  }

  const availableProfiles = user!.profiles.map((profile) => {
    return buildProfile(profile);
  });

  let selectedProfile;
  if (availableProfiles.length === 1) selectedProfile = availableProfiles[0];

  const accessToken = await createAccessToken(user.id, finalClientToken, selectedProfile?.id);

  return NextResponse.json({
    accessToken,
    clientToken: finalClientToken,
    availableProfiles,
    selectedProfile,
    user: requestUser ? { id: user!.id } : null,
  });
}
