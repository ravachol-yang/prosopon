import { findAllInvitesWithUsedBy } from "@/queries/invite";
import InvitesList from "@/components/invites-list";

export default async function InvitesTab() {
  const invites = await findAllInvitesWithUsedBy();

  return (
    <div>
      <InvitesList invites={invites} />
    </div>
  );
}
