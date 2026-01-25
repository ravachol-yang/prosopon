"use client";

import { TEXTURE_PREFIX } from "@/lib/constants";
import { useState } from "react";
import TextureBind from "@/components/texture-bind";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { bindProfileTexture } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function ProfileTexture({ profile }) {
  const [upload, setUpload] = useState(false);
  const [detach, setDetach] = useState(false);

  const router = useRouter();

  async function handleDetach(type) {
    const result = await bindProfileTexture({
      profileId: profile.id,
      type: type,
    });

    if (result.success) {
      router.refresh();
    }
  }

  return (
    <>
      {!upload ? (
        <div className="w-full">
          <div className="flex flex-auto gap-6 my-4">
            <div className="w-full p-0">
              {profile.skin && (
                <>
                  <p className="mb-3">
                    <span>皮肤</span>
                    {detach && (
                      <X
                        onClick={() => handleDetach("SKIN")}
                        className="inline text-muted-foreground hover:text-destructive hover:scale-110"
                      />
                    )}
                  </p>
                  <img
                    src={TEXTURE_PREFIX + profile.skin.hash}
                    alt={profile.skin.name}
                    className="w-full h-full"
                  />
                </>
              )}
            </div>

            <div className="w-full">
              {profile.cape && (
                <>
                  <p className="mb-3">
                    <span>披风</span>
                    {detach && (
                      <X
                        onClick={() => handleDetach("CAPE")}
                        className="inline text-muted-foreground hover:text-destructive hover:scale-110"
                      />
                    )}
                  </p>
                  <img
                    src={TEXTURE_PREFIX + profile.cape.hash}
                    alt={profile.cape.name}
                    className="w-full"
                  />
                </>
              )}
            </div>
          </div>

          <div className="flex flex-row-reverse my-4 gap-3">
            <Button
              className="bg-destructive hover:bg-destructive/75"
              onClick={() => setDetach(!detach)}
            >
              解绑
            </Button>
            <Button className="bg-primary hover:bg-primary/75" onClick={() => setUpload(true)}>
              修改
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex flex-row-reverse w-full my-4">
            <X
              className="text-muted-foreground hover:text-foreground hover:scale-110"
              onClick={() => setUpload(false)}
            />
          </div>
          <TextureBind profile={profile} />
        </div>
      )}
    </>
  );
}
