import CreateProfile from "@/components/create-profile";
import AccountConfig from "@/components/account-config";
import Link from "next/link";
import { clsx } from "clsx";
import { ChevronRight, SquarePen } from "lucide-react";
import { MAX_PROFILES } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { findProfileByUserId } from "@/queries/profile";

export default async function ProfileList({ userId, isAdmin, verified, detail }) {
  const profiles = await findProfileByUserId(userId);

  return (
    <div className="border rounded-md min-h-60 md:min-h-80 p-5 my-4 bg-background">
      {!verified ? (
        <AccountConfig verified={verified} />
      ) : (
        <>
          <Table className="text-base">
            <TableCaption>
              *您的身份为 <strong className="underline">{isAdmin ? "管理员" : "用户"}</strong>,
              可创建 <strong className="underline">{isAdmin ? "无限" : MAX_PROFILES}</strong>{" "}
              个角色, 已创建 <strong className="underline">{profiles.length}</strong> 个角色
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>角色名称</TableHead>
                <TableHead>UUID</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id} className={clsx(detail === profile.id && "bg-muted")}>
                  <TableCell>
                    <strong>{profile.name}</strong>
                  </TableCell>
                  <TableCell>
                    <code>{profile.uuid}</code>
                  </TableCell>
                  <TableCell>
                    {detail === profile.id ? (
                      <Link href="profile">
                        <ChevronRight />
                      </Link>
                    ) : (
                      <Link href={`?detail=${profile.id}`}>
                        <SquarePen className="text-muted-foreground hover:scale-110 hover:text-foreground" />
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end">
            {(isAdmin || profiles.length < MAX_PROFILES) && <CreateProfile />}
          </div>
        </>
      )}
    </div>
  );
}
