import { checkAuth } from "@/lib/auth";
import { BadgeCheck, BadgeX } from "lucide-react";
import InviteCodeVerify from "@/components/invite-code-verify";
import AccountInfo from "@/components/account-info";
import { findUserById } from "@/queries/user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "我的账户",
};

export default async function ProfilePage() {
  const currentAuth = await checkAuth(false);

  const user = await findUserById(currentAuth.id!);

  return (
    <div className="border rounded-md min-h-60 md:min-h-80 p-5 my-4 bg-background w-full max-w-180">
      <div className="border rounded-md h-12 p-3 my-4 flex bg-background hover:bg-accent">
        {currentAuth.verified ? <BadgeCheck color="green" /> : <BadgeX color="crimson" />}
        <p className="px-2.5 w-full">
          {currentAuth.verified ? "您已经完成了验证 !" : "未验证, 请验证并重新登录"}
        </p>
      </div>
      {!currentAuth.verified && <InviteCodeVerify />}
      {currentAuth.verified! && <AccountInfo user={user} />}
    </div>
  );
}
