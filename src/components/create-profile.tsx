"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfile } from "@/lib/actions";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProfileParam } from "@/lib/schema";
import { LoaderCircle } from "lucide-react";

export default function CreateProfile() {
  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null);

  const [open, setOpen] = useState(false);

  const [pending, setPending] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(createProfileParam),
    mode: "onBlur",
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof createProfileParam>) {
    setPending(true);
    const result = await createProfile(data);
    if (result.success) {
      router.refresh();
      setOpen(false);
    } else {
      setMessage(result.message || "未知错误");
    }
    setPending(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-sm h-10 w-30 bg-foreground m-2 mr-0 text-background hover:bg-gray-800">
          <p className="w-full">创建角色</p>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>创建角色</DialogTitle>
          <DialogDescription>角色名称为2-16个英文字母,数字或下划线</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="grid gap-3">
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">角色名称</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Profile Name"
                      required
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                </div>
              )}
            />
            <div className="h-5"></div>
            <DialogFooter className="m:justify-end">
              <Button type="submit" disabled={pending}>
                {pending && <LoaderCircle className="animate-spin" />}
                {pending ? "正在创建..." : "创建"}
              </Button>
            </DialogFooter>
            {message && (
              <>
                <div className="h-2"></div>
                <div className="text-right text-sm text-red-500">{message}</div>
              </>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
