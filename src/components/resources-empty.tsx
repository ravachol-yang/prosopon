import { FolderSearch, Plus } from "lucide-react";
import Link from "next/link";

export default function ResourcesEmpty() {
  return (
    <div className="place-items-center flex">
      <div className="rounded-sm border-dashed border-muted-foreground border p-6 w-full">
        <div className="grid place-items-center my-3">
          <div className="rounded-full bg-muted w-15 h-15 grid place-items-center">
            <FolderSearch />
          </div>
          <h2 className="mt-4 mb-1.5 text-center">您还未在本站创建资源</h2>
          <p className="text-muted-foreground text-center break-all max-w-60 my-1.5">
            创建角色, 上传材质和披风
          </p>
          <Link href="/dashboard/profile">
            <button className="flex p-1 rounded-sm h-9 w-30 bg-foreground my-4 text-background hover:bg-accent-foreground">
              <p className="w-full">创建角色</p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
