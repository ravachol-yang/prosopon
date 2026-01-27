import { Profile } from "@/generated/prisma/client";

export function trimUuid(uuid: string) {
  return uuid.replace(/-/g, "");
}

export function buildProfile(profile: Profile) {
  return {
    id: trimUuid(profile.uuid),
    name: profile.name,
  };
}
