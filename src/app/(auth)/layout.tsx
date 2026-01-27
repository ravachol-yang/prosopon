import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted-foreground/10">
      <Card className="w-full max-w-sm">{children}</Card>
    </div>
  );
}
