import { findProfilesWithInfo } from "@/queries/profile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ProfileTab() {
  const profiles = await findProfilesWithInfo();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>名称</TableHead>
          <TableHead>UUID</TableHead>
          <TableHead>创建者</TableHead>
          <TableHead>皮肤</TableHead>
          <TableHead>披风</TableHead>
          <TableHead>创建于</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell>{profile.id}</TableCell>
            <TableCell>{profile.name}</TableCell>
            <TableCell>{profile.uuid}</TableCell>
            <TableCell>{profile.user.name ?? profile.user.email.split("@")[0]}</TableCell>
            <TableCell>{profile.skinId && "✅"}</TableCell>
            <TableCell>{profile.capeId && "✅"}</TableCell>
            <TableCell>{new Date(profile.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
