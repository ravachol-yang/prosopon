import { checkAuth } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await checkAuth(false);
  return (
    <>
      <div className="p-6">
        <h1 className="text-xl font-semibold">Welcome to Prosopon</h1>
        <p className="text-muted-foreground mt-2">user id: {user.id}</p>
      </div>
    </>
  );
}
