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

export default async function ProfileTab({ where }) {
  const profiles = await findProfilesWithInfo(where);

  return (
    <Table>
      <TableCaption>
        {`已显示 ${where ? where.userId && `创建者为 ${where.userId}` : "全部"} 的角色`}
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
            <TableCell>{profile.skinId && "✅"}</TableCell>
            <TableCell>{profile.capeId && "✅"}</TableCell>
            <TableCell>{new Date(profile.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
