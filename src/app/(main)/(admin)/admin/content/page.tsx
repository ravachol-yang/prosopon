import Link from "next/link";
import { clsx } from "clsx";
import { Separator } from "@/components/ui/separator";
import InvitesTab from "@/components/invites-tab";
import UserTab from "@/components/user-tab";
import { Metadata } from "next";
import ProfileTab from "@/components/profile-tab";
import TextureTab from "@/components/texture-tab";

export const metadata: Metadata = {
  title: "内容管理",
};

export default async function ContentPage({ searchParams }) {
  const params = await searchParams;

  const tab = params.tab;

  const id = params.id;

  const owner = params.owner;
  const tid = params.tid;

  const uploaderId = params.uploaderId;
  const type = params.type;
  const model = params.model;

  return (
    <div className="w-max-200 w-full lg:p-3">
      <div className="flex h-5 items-center gap-4 text-lg">
        <Link href="?tab=user">
          <div
            className={clsx(
              tab !== "profile" && tab !== "texture" && tab !== "invite"
                ? "font-medium text-foreground"
                : "text-muted-foreground",
            )}
          >
            用户
          </div>
        </Link>
        <Separator orientation="vertical" />
        <Link href="?tab=profile">
          <div
            className={clsx(
              "font-medium",
              tab === "profile" ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            角色
          </div>
        </Link>
        <Separator orientation="vertical" />
        <Link href="?tab=texture">
          <div
            className={clsx(
              "font-medium",
              tab === "texture" ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            材质
          </div>
        </Link>
        <Separator orientation="vertical" />
        <Link href="?tab=invite">
          <div
            className={clsx(
              "font-medium",
              tab === "invite" ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            邀请码
          </div>
        </Link>
      </div>
      <div className="border rounded-md min-h-60 md:min-h-80 p-5 my-4 bg-background w-full">
        {tab !== "profile" && tab !== "texture" && tab !== "invite" && (
          <UserTab where={id ? { id: id } : undefined} />
        )}
        {tab === "profile" && (
          <ProfileTab where={owner || tid ? { userId: owner, tid: tid } : undefined} />
        )}
        {tab === "texture" && (
          <TextureTab
            where={
              id || uploaderId || type || model
                ? { id: id, uploaderId: uploaderId, type: type, model: model }
                : undefined
            }
          />
        )}
        {tab === "invite" && <InvitesTab />}
      </div>
    </div>
  );
}
