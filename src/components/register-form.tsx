"use client";

import { z } from "zod";
import { useState } from "react";
import { register } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { registerParams } from "@/lib/schema";
import { LoaderCircle } from "lucide-react";

export default function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(registerParams),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      inviteCode: "",
    },
  });
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(data: z.infer<typeof registerParams>) {
    setPending(true);
    const result = await register(data);
    if (result.success) {
      setStatus(true);
      setMessage("注册成功，等待跳转...");
      setPending(false);
    } else {
      setStatus(false);
      setMessage(result.message || "未知错误");
      setPending(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto mt-8">
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">邮箱</FieldLabel>
            <Input
              {...field}
              id="email"
              aria-invalid={fieldState.invalid}
              placeholder="nobody@example.com"
              required
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">密码</FieldLabel>
            <Input
              {...field}
              id="password"
              aria-invalid={fieldState.invalid}
              type="password"
              placeholder="password"
              required
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="inviteCode"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="inviteCode">邀请码（可选）</FieldLabel>
            <Input
              {...field}
              id="inviteCode"
              aria-invalid={fieldState.invalid}
              placeholder="Invite Code (Optional)"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <LoaderCircle className="animate-spin" />}
        注册
      </Button>
      {!status && message && <div className="text-center text-sm text-red-500">{message}</div>}
      {status && message && <div className="text-center text-sm text-green-500">{message}</div>}
    </form>
  );
}
