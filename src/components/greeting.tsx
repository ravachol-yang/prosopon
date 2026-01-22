"use client";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

export default function Greeting({ user }) {
  const avatar = useMemo(() => {
    return createAvatar(lorelei, {
      seed: user.id,
      flip: true,
    }).toDataUri();
  }, [user.id]);

  const days = Math.ceil((new Date().getTime() - Date.parse(user.createdAt)) / 1000 / 60 / 60 / 24);

  return (
    <div className="border rounded-md min-h-60 md:min-h-80 p-5 mb-4 bg-background">
      <h1 className="text-lg md:text-2xl my-3 text-foreground break-all">
        你好, {user.name ?? user.email.split("@")[0]}, 欢迎使用{" "}
        <strong className="underline">Prosopon</strong> !
      </h1>
      <Separator className="my-3" />
      <div className="md:flex">
        <div className="w-3/4">
          <p className="text-base/6 md:text-lg/8 break-all text-foreground">
            您已来到本站 <strong className="underline">{days}</strong> 天
          </p>
          <div className="text-foreground">
            <p className="text-muted-foreground break-all">This site is powered by Prosopon !</p>
          </div>
        </div>
        <div className="hidden md:block w-1/4">
          <img src={avatar} alt={user.name} />
        </div>
      </div>
    </div>
  );
}
