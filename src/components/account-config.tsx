import { BadgeCheck, BadgeX, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AccountConfig({ verified }) {
  return (
    <Link href="account">
      <div className="group border rounded-md h-12 p-3 my-4 flex bg-background hover:bg-accent transition-colors duration-300 ease-out">
        {verified ? (
          <BadgeCheck
            color="green"
            className="group-hover:scale-105 group-hover:rotate-10 duration-300 ease-in-out"
          />
        ) : (
          <BadgeX
            color="crimson"
            className="group-hover:scale-105 group-hover:rotate-10 duration-300 ease-in-out"
          />
        )}
        <p className="px-2.5 w-full">
          {verified ? "您已经完成了验证 !" : "未验证, 请前往验证以继续操作"}
        </p>
        <ChevronRight className="group-hover:translate-x-1 duration-300 group-hover:scale-105 ease-in-out" />
      </div>
    </Link>
  );
}
