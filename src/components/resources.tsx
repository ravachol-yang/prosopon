import ResourcesEmpty from "@/components/resources-empty";

export default function Resources({ profiles, closet }) {
  return (
    <div className="border rounded-md min-h-60 md:min-h-80 p-5 my-4 bg-background">
      {profiles.length === 0 && closet.length === 0 ? <ResourcesEmpty /> : 222}
    </div>
  );
}
