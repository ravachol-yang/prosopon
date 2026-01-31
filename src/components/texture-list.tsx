import { TEXTURE_PREFIX } from "@/lib/constants";
import Link from "next/link";
import { TextureType } from "@/generated/prisma/enums";
import TextureItem from "@/components/texture-item";

export default function TextureList({ closet, type, detail }) {
  return (
    <div className="flex flex-wrap w-full gap-4 p-4">
      {closet
        .filter((texture) => texture.type === type)
        .map((texture) => (
          <Link href={"?tab=" + type + "&detail=" + texture.id} key={texture.id}>
            <TextureItem
              url={TEXTURE_PREFIX + texture.hash}
              name={texture.name}
              skin={texture.type === TextureType.SKIN}
              highlight={detail === texture.id}
            />
          </Link>
        ))}
    </div>
  );
}
