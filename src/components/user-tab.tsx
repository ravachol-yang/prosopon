import { findAllUsersWithInfo } from "@/queries/user";
import AdminUserList from "@/components/admin-user-list";

export default async function UserTab() {
  const users = await findAllUsersWithInfo();

  return (
    <div>
      <AdminUserList users={users} />
    </div>
  );
}
