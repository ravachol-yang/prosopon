import { LoaderCircle } from "lucide-react";

export default function LoadingSpin() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <LoaderCircle className="animate-spin" />
    </div>
  );
}
