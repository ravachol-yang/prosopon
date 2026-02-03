import { findAllInvitesWithInfo } from "@/queries/invite";
import InvitesList from "@/components/invites-list";

export default async function InvitesTab() {
  const invites = await findAllInvitesWithInfo();

  return (
    <div>
      <InvitesList invites={invites} />
    </div>
  );
}
