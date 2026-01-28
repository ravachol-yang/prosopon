import { TEXTURE_PREFIX } from "@/lib/constants";
import { Buffer } from "node:buffer";
import { signValue } from "@/lib/crypto";

export function trimUuid(uuid: string) {
  return uuid.replace(/-/g, "");
}

export function untrimUuid(uuid: string) {
  if (uuid.length !== 32) return uuid;
  return uuid.replace(
    /([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})/,
    "$1-$2-$3-$4-$5",
  );
}

export function buildProfile(profile, unsigned?: boolean) {
  let skin;
  let cape;
  if (profile.skin) {
    skin = {
      url: TEXTURE_PREFIX + profile.skin.hash,
      metadata: {
        model: profile.skin.model.toString().toLowerCase(),
      },
    };
  }

  if (profile.cape) {
    cape = {
      url: TEXTURE_PREFIX + profile.cape.hash,
    };
  }

  const textures = {
    timestamp: Date.now(),
    profileId: trimUuid(profile.uuid),
    profileName: profile.name,
    textures: {
      SKIN: skin,
      CAPE: cape,
    },
  };

  const texturesValue = Buffer.from(JSON.stringify(textures)).toString("base64");
  let signature;

  if (!unsigned) {
    signature = signValue(texturesValue);
  }

  return {
    id: trimUuid(profile.uuid),
    name: profile.name,
    properties: [
      {
        name: "textures",
        value: texturesValue,
        signature: signature || "",
      },
    ],
  };
}
