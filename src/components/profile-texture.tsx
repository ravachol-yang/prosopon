"use client";

import { TEXTURE_PREFIX } from "@/lib/constants";
import { useState } from "react";
import TextureBind from "@/components/texture-bind";
import { Button } from "@/components/ui/button";
import { LoaderCircle, X } from "lucide-react";
import { bindProfileTexture } from "@/lib/actions";
import { useRouter } from "next/navigation";
import TexturePreview from "@/components/texture-preview";

export default function ProfileTexture({ profile }) {
  const [upload, setUpload] = useState(false);
  const [detach, setDetach] = useState(false);

  const [pending, setPending] = useState(false);

  const router = useRouter();

  async function handleDetach(type) {
    setPending(true);
    const result = await bindProfileTexture({
      profileId: profile.id,
      type: type,
    });

    if (result.success) {
      setDetach(false);
      router.refresh();
    }
    setPending(false);
  }

  return (
    <>
      {!upload ? (
        <div className="w-full">
          <div className="flex justify-center">
            <TexturePreview
              skinUrl={profile.skin && TEXTURE_PREFIX + profile.skin.hash}
              capeUrl={profile.cape && TEXTURE_PREFIX + profile.cape.hash}
            />
          </div>
          {detach && (
            <div className="flex gap-2">
              {profile.skin && (
                <Button
                  className="bg-destructive hover:bg-destructive/75"
                  onClick={() => handleDetach("SKIN")}
                >
                  皮肤
                  <X />
                </Button>
              )}
              {profile.cape && (
                <Button
                  className="bg-destructive hover:bg-destructive/75"
                  onClick={() => handleDetach("CAPE")}
                >
                  披风
                  <X />
                </Button>
              )}
            </div>
          )}

          <div className="flex flex-row-reverse my-4 gap-3">
            <Button
              className="bg-destructive hover:bg-destructive/75"
              onClick={() => setDetach(!detach)}
              disabled={pending}
            >
              {pending && <LoaderCircle className="animate-spin" />}
              {pending ? "正在解绑..." : "解绑"}
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
