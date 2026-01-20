"use client";

import { z } from "zod";
import { FormEvent, useState } from "react";
import { login } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const validated = loginSchema.safeParse({ email, password });
    if (!validated.success) {
      setMessage(validated.error.message);
      return;
    }

    const result = await login(validated.data);
    if (result.success) {
      setStatus(true);
      setMessage("登录成功，等待跳转...");
    } else {
      setStatus(false);
      setMessage(result.message || "未知错误");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-8">
      <Label htmlFor="email">邮箱</Label>
      <Input
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full"
        required
      />
      <Label htmlFor="password">密码</Label>
      <Input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full"
        required
      />
      <Button onClick={handleSubmit} type="submit" className="w-full">
        登录
      </Button>
      {!status && message && <div className="text-center text-sm text-red-500">{message}</div>}
      {status && message && <div className="text-center text-sm text-green-500">{message}</div>}
    </form>
  );
}
