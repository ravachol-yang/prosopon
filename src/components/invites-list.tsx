"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createInviteParam } from "@/lib/schema";
import { createInvite } from "@/lib/actions";

export default function InvitesList({ invites }) {
  const [maxInvites, setMaxInvites] = useState(1);
  const [status, setStatus] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);

  const router = useRouter();

  async function handleCreateInvite(e) {
    setPending(true);
    e.preventDefault();
    if (maxInvites === 0) {
      setMaxInvites(1);
    }
    const validated = createInviteParam.safeParse({ maxInvites });

    if (!validated.success) {
      setStatus(false);
      setMessage("Invalid input");
    } else {
      const result = await createInvite({ maxInvites });
      if (result.success) {
        setStatus(true);
        setMessage("");
        router.refresh();
        setPending(false);
      } else {
        setStatus(false);
        setMessage(result.message || "未知错误");
        setPending(false);
      }
    }
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">邀请码</TableHead>
            <TableHead>邀请数量</TableHead>
            <TableHead>创建者</TableHead>
            <TableHead>已邀请</TableHead>
            <TableHead>创建于</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invites.map((invite) => (
            <TableRow key={invite.code}>
              <TableCell className="font-medium">{invite.code}</TableCell>
              <TableCell>{invite.maxInvites}</TableCell>
              <TableCell>{invite.creatorId}</TableCell>
              <TableCell>{invite.usedBy ? invite.usedBy.length : 0}</TableCell>
              <TableCell>{new Date(invite.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end gap-4 my-4">
        <Input
          type="number"
          className="w-fit"
          placeholder="邀请数量 (默认1)"
          value={maxInvites}
          onChange={(e) => setMaxInvites(+e.target.value >= 0 ? +e.target.value : -e.target.value)}
        />
        <Button onClick={handleCreateInvite} disabled={pending}>
          <span>创建</span>
          {pending ? <LoaderCircle className="animate-spin" /> : <Plus className="inline" />}
        </Button>
      </div>
      {!status && message && <div className="text-center text-sm text-red-500">{message}</div>}
      {status && message && <div className="text-center text-sm text-green-500">{message}</div>}
    </div>
  );
}
