import { findProfilesWithInfo } from "@/queries/profile";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";

export default async function ProfileTab({ where }) {
  const profiles = await findProfilesWithInfo(
    where
      ? { ...where, tid: undefined, OR: [{ skinId: where.tid }, { capeId: where.tid }] }
      : undefined,
  );

  return (
    <Table>
      <TableCaption>
        已显示{" "}
        {where ? (
          <>
            {where.userId && `创建者为 ${where.userId}`}
            {where.tid && `绑定材质ID为 ${where.tid}`}
          </>
        ) : (
          "全部"
        )}{" "}
        的角色
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>名称</TableHead>
          <TableHead>UUID</TableHead>
          <TableHead>创建者</TableHead>
          <TableHead>皮肤</TableHead>
          <TableHead>披风</TableHead>
          <TableHead>创建于</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell>{profile.id}</TableCell>
            <TableCell>{profile.name}</TableCell>
            <TableCell>{profile.uuid}</TableCell>
            <TableCell>
              <Link
                className="text-blue-700"
                href={{
                  pathname: "",
                  query: { tab: "user", id: profile.userId },
                }}
              >
                <u>{profile.user.name ?? profile.user.email.split("@")[0]}</u>
              </Link>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 group">
                {profile.skinId && "✅"}
                <Link
                  href={{
                    pathname: "",
                    query: {
                      tab: "texture",
                      id: profile.skinId,
                    },
                  }}
                >
                  <SquareArrowOutUpRight size={15} className="opacity-0 group-hover:opacity-100" />
                </Link>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 group">
                {profile.capeId && "✅"}
                <Link
                  href={{
                    pathname: "",
                    query: {
                      tab: "texture",
                      id: profile.capeId,
                    },
                  }}
                >
                  <SquareArrowOutUpRight size={15} className="opacity-0 group-hover:opacity-100" />
                </Link>
              </div>
            </TableCell>
            <TableCell>{new Date(profile.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
