import { Profile } from "@/generated/prisma/client";

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

export function buildProfile(profile: Profile) {
  return {
    id: trimUuid(profile.uuid),
    name: profile.name,
  };
}
