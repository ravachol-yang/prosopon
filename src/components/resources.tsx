import ResourcesEmpty from "@/components/resources-empty";
import { Shirt, Smile } from "lucide-react";

export default function Resources({ profiles, closet }) {
  return (
    <div className="border rounded-md min-h-60 md:min-h-60 p-5 my-4 bg-background">
      {profiles.length === 0 && closet.length === 0 ? (
        <ResourcesEmpty />
      ) : (
        <>
          <div className="flex rounded-sm border-gray-200 border p-4 w-full hover:bg-accent hover:border-accent min-h-25 my-4">
            <Smile className="h-full" size={50} />
            <div className="px-4 w-full">
              <h3 className="text-xl mb-4">我的角色</h3>
              <p className="text-muted-foreground truncate">
                {profiles.map((profile) => profile.name + " ")}
              </p>
            </div>
          </div>
          <div className="flex rounded-sm border-gray-200 border p-4 w-full hover:bg-accent hover:border-accent h-25 my-4">
            <Shirt className="h-full" size={50} />
            <div className="px-4">
              <h3 className="text-xl mb-4">我的材质</h3>
              <p className="text-muted-foreground truncate">
                {profiles.map((profile) => profile.name + " ")}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
