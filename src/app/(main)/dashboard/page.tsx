import { checkAuth } from "@/lib/auth";
import Greeting from "@/components/greeting";
import { findUserByIdWithProfilesAndTextures } from "@/queries/user";
import AccountConfig from "@/components/account-config";
import Resources from "@/components/resources";
import { PageHeader } from "@/components/page-header";

export default async function DashboardPage() {
  const currentAuth = await checkAuth(false);

  const user = await findUserByIdWithProfilesAndTextures(currentAuth.id!);

  return (
    <>
      <PageHeader parent="dashboard" parentUrl="" />
      <div className="p-6 max-w-400">
        <div className="lg:flex">
          <div className="w-max-200 w-full lg:p-3">
            <Greeting user={user} />
            <AccountConfig verified={user!.verified} />
            <h3 className="text-lg">我的资源</h3>
            <Resources
              profiles={user!.profiles}
              closet={user!.closet}
              isAdmin={user!.role === "ADMIN"}
            />
          </div>
          <div className=" w-max-200 w-full lg:p-3"></div>
        </div>
      </div>
    </>
  );
}
