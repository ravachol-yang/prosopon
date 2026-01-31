"use client";

import { clsx } from "clsx";
import { renderTexture } from "@/lib/client/texture-renderer";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

export default function TextureItem({
  url,
  name,
  skin,
  highlight,
}: {
  url: string;
  name: string;
  skin: boolean;
  highlight: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    renderTexture(skin ? url : null, skin ? null : url).then((image) => {
      setPreview(image);
      setLoading(false);
    });
  }, [skin, url]);

  return (
    <div
      className={clsx(
        "flex flex-col items-center w-50 p-3 rounded-sm hover:bg-muted h-70",
        highlight && "bg-muted",
      )}
    >
      {loading ? (
        <div className="flex justify-center items-center h-50">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : (
        preview && <img src={preview} alt={name} />
      )}
      <h3 className={clsx("w-full mt-2 text-sm text-center truncate", highlight && "font-bold")}>
        {name}
      </h3>
    </div>
  );
}
