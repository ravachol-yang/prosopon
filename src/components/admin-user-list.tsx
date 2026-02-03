"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clsx } from "clsx";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";

export default function AdminUserList({ users, where }) {
  return (
    <Table>
      <TableCaption>
        {`已显示 ${where ? where.id && `ID为 ${where.id}` : "全部"} 的用户`}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead className="w-25">ID</TableHead>
          <TableHead>名称</TableHead>
          <TableHead>邮箱</TableHead>
          <TableHead>已验证</TableHead>
          <TableHead>权限</TableHead>
          <TableHead>被邀请于</TableHead>
          <TableHead>角色</TableHead>
          <TableHead>材质</TableHead>
          <TableHead>创建于</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            className={clsx(!user.verified && "bg-destructive/10 hover:bg-destructive/15")}
          >
            <TableCell>
              {
                <img
                  className="size-10 rounded-sm"
                  src={createAvatar(lorelei, {
                    seed: user.id,
                    backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
                  }).toDataUri()}
                />
              }
            </TableCell>
            <TableCell className="font-medium">{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.verified ? "是" : "否"}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Link
                className="text-blue-700"
                href={{
                  pathname: "",
                  query: {
                    tab: "user",
                    id: user.invitedBy ? user.invitedBy.createdBy.id : undefined,
                  },
                }}
              >
                <u>{user.invitedBy ? user.invitedBy.createdBy.name : ""}</u>
              </Link>
            </TableCell>
            <TableCell>
              <Link
                className="text-blue-700"
                href={{
                  pathname: "",
                  query: {
                    tab: "profile",
                    owner: user.id,
                  },
                }}
              >
                <u>{user._count.profiles}</u>
              </Link>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 group">
                {user._count.closet}
                <Link
                  href={{
                    pathname: "",
                    query: {
                      tab: "texture",
                      uploaderId: user.id,
                    },
                  }}
                >
                  <SquareArrowOutUpRight size={15} className="opacity-0 group-hover:opacity-100" />
                </Link>
              </div>
            </TableCell>
            <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
