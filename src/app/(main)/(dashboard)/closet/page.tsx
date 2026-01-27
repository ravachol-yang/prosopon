import { checkAuth } from "@/lib/auth";
import Closet from "@/components/closet";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { clsx } from "clsx";
import { findUserByIdWithProfilesAndTextures } from "@/queries/user";

export default async function ProfilePage({ searchParams }) {
  const currentAuth = await checkAuth(false);

  const user = await findUserByIdWithProfilesAndTextures(currentAuth.id!);

  const params = await searchParams;

  const tab = params.tab;

  const detail = params.detail;

  return (
    <>
      <div className="w-max-200 w-full lg:p-3">
        <div className="flex h-5 items-center gap-4 text-lg">
          <Link href="?tab=SKIN">
            <div
              className={clsx(
                tab !== "CAPE" ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              我的皮肤
            </div>
          </Link>
          <Separator orientation="vertical" />
          <Link href="?tab=CAPE">
            <div
              className={clsx(
                "font-medium ",
                tab === "CAPE" ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              我的披风
            </div>
          </Link>
        </div>
        <Closet tab={tab} user={user} detail={detail} />
      </div>
    </>
  );
}
