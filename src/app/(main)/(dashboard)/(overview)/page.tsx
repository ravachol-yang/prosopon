import Greeting from "@/components/greeting";
import AccountConfig from "@/components/account-config";
import Resources from "@/components/resources";
import Announcement from "@/components/announcement";
import Instructions from "@/components/instructions";
import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { findUserByIdWithProfilesAndTextures } from "@/queries/user";
import { Metadata } from "next";
import { SITE_NAME, YGG_API_PREFIX } from "@/lib/constants";

export const metadata: Metadata = {
  title: "概览",
};

export default async function OverviewPage() {
  const currentAuth = await checkAuth(false);
  if (!currentAuth || currentAuth.error || !currentAuth.id) redirect("/login");

  const user = await findUserByIdWithProfilesAndTextures(currentAuth.id!);

  return (
    <>
      <div className="max-w-400 md:overflow-hidden md:p-3 md:h-[calc(100vh-7rem)]">
        <div className="lg:flex h-full gap-6">
          <div className="md:w-1/2">
            <Greeting user={user} siteName={SITE_NAME} />
            <AccountConfig verified={user!.verified} />
            <h3 className="text-lg">我的资源</h3>
            <Resources
              profiles={user!.profiles}
              closet={user!.closet}
              isAdmin={user!.role === "ADMIN"}
            />
          </div>
          <div className="flex flex-col md:w-1/2 h-full">
            <Announcement verified={currentAuth.verified} />
            <div className="flex-none">
              <h3 className="text-lg my-3">使用指南</h3>
              <Instructions yggUrl={YGG_API_PREFIX} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
