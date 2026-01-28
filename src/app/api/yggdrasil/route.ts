import { NextResponse } from "next/server";
import { SITE_DOMAIN, SITE_NAME, TEXTURE_DOMAIN } from "@/lib/constants";
import { RSA_PUBKEY } from "@/lib/crypto";

export async function GET() {
  return NextResponse.json({
    meta: {
      serverName: SITE_NAME,
      implementationName: "prosopon-yggdrasil",
      implementationVersion: "1.0.0",
      links: {
        homepage: "https://" + SITE_DOMAIN,
        register: "https://" + SITE_DOMAIN + "/register",
      },
    },
    skinDomains: [TEXTURE_DOMAIN],
    signaturePublickey: RSA_PUBKEY,
  });
}
