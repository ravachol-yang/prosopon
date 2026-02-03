import { findAllUsersWithInfo } from "@/queries/user";
import AdminUserList from "@/components/admin-user-list";

export default async function UserTab({ where }) {
  const users = await findAllUsersWithInfo(where);

  return (
    <div>
      <AdminUserList users={users} where={where} />
    </div>
  );
}
