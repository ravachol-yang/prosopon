import { findAllTextureWithInfo } from "@/queries/texture";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TextureType } from "@/generated/prisma/enums";
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";

export default async function TextureTab({ where }) {
  const textures = await findAllTextureWithInfo(where);

  return (
    <Table>
      <TableCaption>
        已显示{" "}
        {where ? (
          <>
            {where.id && `ID为${where.id} `}
            {where.uploaderId && `上传者为${where.uploaderId} `}
            {where.type && `类型为 ${where.type === TextureType.SKIN ? "皮肤" : "披风"} `}
            {where.model && `模型为 ${where.model} `}
          </>
        ) : (
          "全部 "
        )}
        的材质
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>名称</TableHead>
          <TableHead>Hash</TableHead>
          <TableHead>类型</TableHead>
          <TableHead>模型</TableHead>
          <TableHead>创建者</TableHead>
          <TableHead>绑定角色</TableHead>
          <TableHead>创建于</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {textures.map((texture) => (
          <TableRow key={texture.id}>
            <TableCell>
              <strong>{texture.id}</strong>
            </TableCell>
            <TableCell className="max-w-30">
              <p className="truncate" title={texture.name}>
                {texture.name}
              </p>
            </TableCell>
            <TableCell>
              <p className="truncate" title={texture.hash}>
                {texture.hash}
              </p>
            </TableCell>
            <TableCell>
              <Link
                className="text-blue-700"
                href={{
                  pathname: "",
                  query: {
                    tab: "texture",
                    type: texture.type,
                  },
                }}
              >
                <u>{texture.type === TextureType.SKIN ? "皮肤" : "披风"}</u>
              </Link>
            </TableCell>
            <TableCell>
              <Link
                className="text-blue-700"
                href={{
                  pathname: "",
                  query: {
                    tab: "texture",
                    type: TextureType.SKIN,
                    model: texture.model,
                  },
                }}
              >
                {texture.type === TextureType.SKIN && <u>{texture.model ?? ""}</u>}
              </Link>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 group">
                <Link
                  className="text-blue-700"
                  href={{
                    pathname: "",
                    query: {
                      tab: "texture",
                      uploaderId: texture.uploaderId,
                    },
                  }}
                >
                  <u>
                    {texture.uploader
                      ? (texture.uploader.name ?? texture.uploader.email.split("@")[0])
                      : ""}
                  </u>
                </Link>
                <Link
                  href={{
                    pathname: "",
                    query: {
                      tab: "user",
                      id: texture.uploaderId,
                    },
                  }}
                >
                  <SquareArrowOutUpRight size={15} className="opacity-0 group-hover:opacity-100" />
                </Link>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 group">
                {texture._count.profileSkin + texture._count.profileCape}
                <Link
                  href={{
                    pathname: "",
                    query: {
                      tab: "profile",
                      tid: texture.id,
                    },
                  }}
                >
                  <SquareArrowOutUpRight size={15} className="opacity-0 group-hover:opacity-100" />
                </Link>
              </div>
            </TableCell>
            <TableCell>{new Date(texture.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
