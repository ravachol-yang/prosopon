import { BadgeCheck, BadgeX, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AccountConfig({ verified }) {
  return (
    <Link href="/dashboard/account">
      <div className="border rounded-md h-12 p-3 my-4 flex bg-background">
        {verified ? <BadgeCheck /> : <BadgeX color="crimson" />}
        <p className="px-2.5 w-full">
          {verified ? "您已经完成了验证 !" : "未验证, 请前往验证以继续操作"}
        </p>
        <ChevronRight />
      </div>
    </Link>
  );
}
