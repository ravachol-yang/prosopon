import TextureBind from "@/components/texture-bind";
import ProfileTexture from "@/components/profile-texture";
import { findProfileByIdWithTextures } from "@/queries/profile";
import { Separator } from "@/components/ui/separator";
import ProfileName from "@/components/profile-name";

export default async function ProfileDetail({
  profileId,
  userId,
}: {
  profileId: string;
  userId: string;
}) {
  const profile = await findProfileByIdWithTextures(profileId);

  if (!profile || profile?.userId !== userId) {
    return <></>;
  }

  return (
    <div className="border rounded-md min-h-60 md:min-h-80 p-6 my-4 bg-background">
      <div className="place-items-center flex mb-4">
        {!profile.skin && !profile.cape ? (
          <TextureBind profile={profile} />
        ) : (
          <ProfileTexture profile={profile} />
        )}
      </div>

      <h3 className="mb-2">详细信息:</h3>
      <ProfileName id={profile.id} name={profile.name} />
      <Separator className="mt-2" />
      <p className="my-3">
        UUID v5:
        <span className="mx-2">
          <code className="bg-accent p-1 rounded-sm text-muted-foreground">{profile.uuid}</code>
        </span>
      </p>
      <p className="my-3">
        创建于:
        <span className="mx-2">
          <code className="bg-accent p-1 rounded-sm text-muted-foreground">
            {new Date(profile.createdAt).toLocaleDateString()}
          </code>
        </span>
      </p>
      <p className="my-3">
        更新于:
        <span className="mx-2">
          <code className="bg-accent p-1 rounded-sm text-muted-foreground">
            {new Date(profile.updatedAt).toLocaleDateString()}
          </code>
        </span>
      </p>
    </div>
  );
}
