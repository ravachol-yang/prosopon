"use client";

import { TEXTURE_PREFIX } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import ProfileBind from "@/components/profile-bind";
import { SkinModel, TextureType } from "@/generated/prisma/enums";
import TexturePreview from "@/components/texture-preview";

export default function TextureDetail({ texture, user }) {
  let profiles;

  if (texture.type === "SKIN") {
    profiles = texture.profileSkin;
  } else {
    profiles = texture.profileCape;
  }

  return (
    <div>
      <div className="flex justify-center">
        <TexturePreview
          skinUrl={texture.type === TextureType.SKIN ? TEXTURE_PREFIX + texture.hash : null}
          capeUrl={texture.type === TextureType.CAPE ? TEXTURE_PREFIX + texture.hash : null}
        />
      </div>

      <p className="my-3">
        绑定的角色:
        <span className="mx-2">
          <code className="bg-accent p-1 rounded-sm text-muted-foreground break-all">
            {profiles.map((profile) => profile.name + ",")}
          </code>
        </span>
      </p>

      <ProfileBind texture={texture} user={user} />

      <Separator className="my-5" />
      <h3 className="mb-2">详细信息</h3>
      <p className="my-3">
        材质名称:
        <span className="mx-2">
          <code className="bg-accent p-1 rounded-sm text-muted-foreground break-all">
            {texture.name}
          </code>
        </span>
      </p>
      <p className="my-3">
        材质类型:
        <span className="mx-2">
          <code className="bg-accent p-1 rounded-sm text-muted-foreground break-all">
            {texture.type === TextureType.SKIN ? "皮肤" : "披风"}
          </code>
        </span>
      </p>
      {texture.type === TextureType.SKIN && (
        <p className="my-3">
          皮肤模型:
          <span className="mx-2">
            <code className="bg-accent p-1 rounded-sm text-muted-foreground break-all">
              {texture.model === SkinModel.DEFAULT ? "DEFAULT" : "SLIM"}
            </code>
          </span>
        </p>
      )}
      <p className="my-3">
        创建于:
        <span className="mx-2">
          <code className="bg-accent p-1 rounded-sm text-muted-foreground">
            {new Date(texture.createdAt).toLocaleDateString()}
          </code>
        </span>
      </p>
      <p className="my-3">
        更新于:
        <span className="mx-2">
          <code className="bg-accent p-1 rounded-sm text-muted-foreground">
            {new Date(texture.updatedAt).toLocaleDateString()}
          </code>
        </span>
      </p>
    </div>
  );
}
