import { findAllInvitesWithInfo } from "@/queries/invite";
import InvitesList from "@/components/invites-list";

export default async function InvitesTab({ where }) {
  const invites = await findAllInvitesWithInfo(where);

  return (
    <div>
      <InvitesList invites={invites} where={where} />
    </div>
  );
}
