import ResourcesEmpty from "@/components/resources-empty";
import { ChevronRight, Shirt, Smile } from "lucide-react";
import Link from "next/link";

export default function Resources({ profiles, closet, isAdmin }) {
  return (
    <>
      {profiles.length === 0 && closet.length === 0 ? (
        <div className="border rounded-md md:min-h-50 p-5 my-4 bg-background">
          <ResourcesEmpty />
        </div>
      ) : (
        <div className="lg:flex gap-4">
          <div className="flex flex-auto flex-col border rounded-md p-5 my-4 bg-background w-full">
            <div>
              <Smile size="40" className="inline mr-3" />
              <span className="text-lg font-bold">角色</span>
            </div>
            <p className="text-7xl w-full text-center my-13">
              {profiles.length}
              <span className="text-2xl text-muted-foreground">/{isAdmin ? "\u221e" : 3}</span>
            </p>
            <div className="w-full flex flex-col-reverse flex-auto">
              <Link href="/dashboard/profile" className="hover:text-sky-700 text-lg text-center">
                管理角色
                <ChevronRight className="inline" />
              </Link>
            </div>
          </div>
          <div className="flex flex-auto flex-col border rounded-md p-5 my-4 bg-background w-full">
            <div>
              <Shirt size="40" className="inline mr-3" />
              <span className="text-lg font-bold">材质</span>
            </div>
            <p className="text-7xl w-full text-center my-13">
              {closet.length}
              <span className="text-2xl text-muted-foreground">/&infin;</span>
            </p>
            <div className="w-full flex flex-col-reverse flex-auto">
              <Link href="/dashboard/closet" className="hover:text-sky-700 text-lg text-center">
                管理材质
                <ChevronRight className="inline" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
