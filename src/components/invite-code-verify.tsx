"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { verifyInviteCode } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export default function InviteCodeVerify() {
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState(false);
  const [pending, setPending] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent) {
    setPending(true);
    e.preventDefault();

    if (!inviteCode) {
      return;
    }
    const result = await verifyInviteCode({
      inviteCode,
    });

    console.log(result);

    if (result.success) {
      setPending(false);
    } else {
      setStatus(false);
      setMessage(result.message || "未知错误");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Label htmlFor="password">邀请码</Label>
      <Input
        id="inviteCode"
        placeholder="Invite Code"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        className="input input-bordered w-full my-4"
        required
      />
      <div className="w-full flex flex-row-reverse">
        <Button type="submit" disabled={pending}>
          {pending && <LoaderCircle className="animate-spin" />}
          验证
        </Button>
      </div>
      {!status && message && <div className="text-center text-sm text-red-500">{message}</div>}
      {status && message && <div className="text-center text-sm text-green-500">{message}</div>}
    </form>
  );
}
