import Link from "next/link";
import { clsx } from "clsx";
import { Separator } from "@/components/ui/separator";
import InvitesTab from "@/components/invites-tab";

export default async function ContentPage({ searchParams }) {
  const params = await searchParams;

  const tab = params.tab;

  return (
    <div className="w-max-200 w-full lg:p-3">
      <div className="flex h-5 items-center gap-4 text-lg">
        <Link href="/dashboard/admin/content?tab=user">
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
        <Link href="/dashboard/admin/content?tab=profile">
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
        <Link href="/dashboard/admin/content?tab=texture">
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
        <Link href="/dashboard/admin/content?tab=invite">
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
        {tab === "invite" && (
          <div>
            <InvitesTab />
          </div>
        )}
      </div>
    </div>
  );
}
