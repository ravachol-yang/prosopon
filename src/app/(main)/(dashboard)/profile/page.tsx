import { checkAuth } from "@/lib/auth";
import { findUserByIdWithProfilesAndTextures } from "@/queries/user";
import ProfileList from "@/components/profile-list";
import ProfileDetail from "@/components/profile-detail";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoadingSpin from "@/components/loading-spin";

export const metadata: Metadata = {
  title: "角色管理",
};

export default async function ProfilePage({ searchParams }) {
  const currentAuth = await checkAuth(false);
  if (!currentAuth || currentAuth.error || !currentAuth.id) redirect("/login");

  const user = await findUserByIdWithProfilesAndTextures(currentAuth.id);

  const params = await searchParams;

  const profileId = params.detail;

  return (
    <>
      <div className="lg:flex">
        <div className="w-max-200 w-full lg:p-3">
          <h3 className="text-lg">我的角色</h3>
          <ProfileList
            profiles={user!.profiles}
            isAdmin={user!.role === "ADMIN"}
            verified={user!.verified}
            detail={params.detail}
          />
        </div>

        <div className=" w-max-200 w-full lg:p-3">
          {profileId && (
            <>
              <h3 className="text-lg">角色信息</h3>
              <Suspense fallback={<LoadingSpin />}>
                <ProfileDetail profileId={profileId} userId={user!.id} />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </>
  );
}
