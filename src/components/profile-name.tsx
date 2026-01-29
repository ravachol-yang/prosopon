"use client";

import { LoaderCircle, SquarePen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { clsx } from "clsx";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfileParam } from "@/lib/schema";
import { z } from "zod";
import { Field, FieldError } from "@/components/ui/field";
import { updateProfileName } from "@/lib/actions";
import { useRouter } from "next/navigation";
export default function ProfileName({ id, name }) {
  const [editing, setEditing] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(createProfileParam),
    mode: "onBlur",
    defaultValues: {
      name: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof createProfileParam>) {
    setPending(true);
    await updateProfileName(id, data);
    setEditing(false);
    router.refresh();
    setPending(false);
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <p>
          角色名称:
          <span className="mx-2">{name}</span>
          <SquarePen
            onClick={() => setEditing(!editing)}
            className={clsx("inline", !editing && "text-muted-foreground")}
            size={18}
          />
          {editing && (
            <span className="text-muted-foreground px-2">*改名后您可能需要在启动器重新登录</span>
          )}
        </p>
        {editing && (
          <div className="flex flex-warp mt-2">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-fit">
                  <Input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Profile Name"
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <span className="mx-2">
              <Button type="submit" disabled={pending}>
                {pending && <LoaderCircle className="animate-spin" />}更改
              </Button>
            </span>
          </div>
        )}
      </form>
    </>
  );
}
