import TextureList from "@/components/texture-list";

export default function Closet({ tab, user, detail }) {
  console.log(detail);
  return (
    <div className=" w-max-200 w-full md:flex md:gap-4">
      <div className="border rounded-md min-h-60 md:min-h-80 p-5 my-4 bg-background w-full">
        <TextureList type={tab !== "CAPE" ? "SKIN" : "CAPE"} closet={user.closet} detail={detail} />
      </div>
      {detail && (
        <div className="border rounded-md min-h-60 md:min-h-80 p-5 my-4 bg-background w-full">
          {detail}
        </div>
      )}
    </div>
  );
}
