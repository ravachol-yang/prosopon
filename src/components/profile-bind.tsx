"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { bindProfileTexture } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

export default function ProfileBind({ texture, user }) {
  const router = useRouter();

  const [profileId, setProfileId] = useState<string>("");

  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    const result = await bindProfileTexture({
      profileId: profileId,
      textureId: texture.id,
      type: texture.type,
    });

    if (result.success) {
      setProfileId("");
      router.refresh();
    } else {
      setStatus(false);
      setMessage(result.message || "未知错误");
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <Select name="profileId" value={profileId} onValueChange={(value) => setProfileId(value)}>
        <SelectTrigger id="type">
          <SelectValue placeholder="选择角色..." />
        </SelectTrigger>
        <SelectContent>
          {user.profiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.id}>
              {profile.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-row-reverse w-full">
        <Button type="submit" disabled={pending || !profileId}>
          {pending && <LoaderCircle className="animate-spin" />}
          {pending ? "正在绑定..." : "绑定"}
        </Button>
      </div>
      {!status && message && <div className="text-center text-sm text-red-500">{message}</div>}
      {status && message && <div className="text-center text-sm text-green-500">{message}</div>}
    </form>
  );
}
