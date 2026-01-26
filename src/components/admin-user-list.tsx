"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clsx } from "clsx";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

export default function AdminUserList({ users }) {
  return (
    <Table>
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
            <TableCell>{user.invitedBy ? user.invitedBy.createdBy.name : ""}</TableCell>
            <TableCell>{user._count.profiles}</TableCell>
            <TableCell>{user._count.closet}</TableCell>
            <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
