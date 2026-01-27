import { Separator } from "@/components/ui/separator";

export default function Announcement() {
  return (
    <div className="border rounded-md min-h-60 md:min-h-80 p-5 mb-4 bg-background">
      <h1 className="text-lg md:text-2xl my-3 text-foreground break-all">公告栏</h1>
      <Separator className="my-3" />
    </div>
  );
}
