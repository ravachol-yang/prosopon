import CreateProfile from "@/components/create-profile";
import AccountConfig from "@/components/account-config";
import Link from "next/link";
import { clsx } from "clsx";
import { ChevronRight } from "lucide-react";

export default function ProfileList({ profiles, isAdmin, verified, detail }) {
  return (
    <div className="border rounded-md min-h-60 md:min-h-80 p-5 my-4 bg-background">
      {!verified ? (
        <AccountConfig verified={verified} />
      ) : (
        <>
          <p className="text-muted-foreground mb-4">
            *您的身份为 <strong className="underline">{isAdmin ? "管理员" : "用户"}</strong>, 可创建{" "}
            <strong className="underline">{isAdmin ? "无限" : 3}</strong> 个角色, 已创建{" "}
            <strong className="underline">{profiles.length}</strong> 个角色
          </p>
          {profiles.map((profile) => (
            <Link href={`/dashboard/profile?detail=${profile.id}`} key={profile.id}>
              <div
                className={clsx(
                  "flex flex-auto rounded-sm border-gray-200 border p-6 w-full hover:bg-accent hover:border-accent min-h-20 my-2",
                  { "font-bold bg-accent border-accent": detail === profile.id },
                )}
              >
                <div>
                  <p>{profile.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{profile.uuid}</p>
                </div>
                {detail === profile.id && (
                  <span className="w-full flex flex-row-reverse">
                    <ChevronRight className="h-full" />
                  </span>
                )}
              </div>
            </Link>
          ))}
          <div className="flex">
            <div className="w-full"></div>
            {profiles.length !== 0 && (
              <button className="rounded-sm h-10 w-30 bg-background m-2 text-foreground hover:bg-accent border border-gray-300">
                <p className="w-full">管理角色</p>
              </button>
            )}
            {(isAdmin || profiles.length < 3) && <CreateProfile />}
          </div>
        </>
      )}
    </div>
  );
}
