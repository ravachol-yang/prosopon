import { NextResponse } from "next/server";
import { SITE_NAME, TEXTURE_DOMAIN } from "@/lib/constants";

export async function GET() {
  return NextResponse.json({
    meta: {
      serverName: SITE_NAME,
      implementationName: "prosopon-yggdrasil",
      implementationVersion: "1.0.0",
    },
    skinDomains: [TEXTURE_DOMAIN],
  });
}
