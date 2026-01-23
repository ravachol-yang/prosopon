import CreateProfile from "@/components/create-profile";
import AccountConfig from "@/components/account-config";

export default function ProfileList({ profiles, isAdmin, verified }) {
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
            <div
              key={profile.id}
              className="rounded-sm border-gray-200 border p-6 w-full hover:bg-accent hover:border-accent min-h-20 my-2"
            >
              <p>{profile.name}</p>
              <p className="truncate text-sm text-muted-foreground">{profile.id}</p>
            </div>
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
