import { Separator } from "@/components/ui/separator";
import AnnouncementContent from "@/components/announcement-content";
import { ANNOUNCEMENT } from "@/lib/constants";

export default function Announcement() {
  return (
    <div className="flex flex-col border rounded-md max-h-full min-h-0 p-5 mb-4 bg-background">
      <h1 className="flex-none text-lg md:text-2xl my-3 text-foreground break-all">公告栏</h1>
      <Separator className="mb-3 flex-none" />
      <div className="overflow-auto w-full flex-1 min-h-0">
        <AnnouncementContent content={ANNOUNCEMENT} />
      </div>
    </div>
  );
}
