import { checkAuth } from "@/lib/auth";
import { findUserByIdWithProfilesAndTextures } from "@/queries/user";
import ProfileList from "@/components/profile-list";

export default async function ProfilePage() {
  const currentAuth = await checkAuth(false);

  const user = await findUserByIdWithProfilesAndTextures(currentAuth.id!);

  return (
    <>
      <div className="lg:flex">
        <div className="w-max-200 w-full lg:p-3">
          <h3 className="text-lg">我的角色</h3>
          <ProfileList
            profiles={user!.profiles}
            isAdmin={user!.role === "ADMIN"}
            verified={user!.verified}
          />
        </div>
        <div className=" w-max-200 w-full lg:p-3"></div>
      </div>
    </>
  );
}
