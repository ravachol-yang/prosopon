import { TEXTURE_PREFIX } from "@/lib/constants";
import Link from "next/link";
import { clsx } from "clsx";

export default function TextureList({ closet, type, detail }) {
  return (
    <div className="flex flex-wrap w-full gap-4 p-4">
      {closet
        .filter((texture) => texture.type === type)
        .map((texture) => (
          <Link href={"?tab=" + type + "&detail=" + texture.id} key={texture.id}>
            <div
              className={clsx(
                "flex flex-col items-center w-50 p-3 rounded-sm hover:bg-muted",
                detail === texture.id && "bg-muted",
              )}
            >
              <div className="w-full bg-muted/20 rounded-lg overflow-hidden flex items-center justify-center p-2">
                <img
                  src={TEXTURE_PREFIX + texture.hash}
                  alt={texture.name}
                  className="w-full h-auto object-contain"
                />
              </div>
              <h3
                className={clsx(
                  "w-full mt-2 text-sm text-center truncate",
                  detail === texture.id && "font-bold",
                )}
              >
                {texture.name}
              </h3>
            </div>
          </Link>
        ))}
    </div>
  );
}
