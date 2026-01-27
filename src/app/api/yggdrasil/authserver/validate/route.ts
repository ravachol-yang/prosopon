import { verifyAccessToken } from "@/lib/yggdrasil/jwt";
import { NextResponse } from "next/server";
import { ForbiddenOperationException } from "@/lib/yggdrasil/exception";

export async function POST(req: Request) {
  const { accessToken, clientToken } = await req.json();

  const verified = await verifyAccessToken(accessToken, clientToken);
  if (!verified.valid || verified.semiExpire) {
    return NextResponse.json(new ForbiddenOperationException("Invalid token"), {
      status: ForbiddenOperationException.status,
    });
  }

  return new NextResponse(null, { status: 204 });
}
