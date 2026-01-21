import { checkAuth } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await checkAuth(false);
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">我的衣柜</h1>
      <p className="text-muted-foreground mt-2">user id: {user.id}</p>
    </div>
  );
}
