"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { bindProfileTexture } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

export default function ProfileBind({ texture, user }) {
  const form = useForm();

  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(data) {
    setPending(true);
    const result = await bindProfileTexture({
      profileId: data.profileId,
      textureId: texture.id,
      type: texture.type,
    });

    if (result.success) {
      router.refresh();
    } else {
      setStatus(false);
      setMessage(result.message || "未知错误");
    }
    setPending(false);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full">
      <Controller
        name="profileId"
        control={form.control}
        render={({ field }) => (
          <Field className="w-fit">
            <Select name={field.name} value={field.value} onValueChange={field.onChange}>
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
          </Field>
        )}
      />
      <div className="flex flex-row-reverse w-full">
        <Button type="submit" disabled={pending}>
          {pending && <LoaderCircle className="animate-spin" />}
          {pending ? "正在绑定..." : "绑定"}
        </Button>
      </div>
      {!status && message && <div className="text-center text-sm text-red-500">{message}</div>}
      {status && message && <div className="text-center text-sm text-green-500">{message}</div>}
    </form>
  );
}
