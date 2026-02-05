import { LayoutTemplate } from "lucide-react";

export default async function AnnouncementEmpty({ verified }) {
  return (
    <div className="h-55 flex flex-col items-center justify-center gap-6">
      <LayoutTemplate size={50} className="text-muted-foreground/50" />
      <p className="text-muted-foreground">暂无公告{!verified && ",或账号未验证"} ¯\_(ツ)_/¯</p>
    </div>
  );
}
