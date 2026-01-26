"use client";

import { FormEvent, useState } from "react";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUserInfoParams } from "@/lib/schema";
import { updateUserInfo } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function AccountInfo({ user }) {
  const [editingName, setEditingName] = useState<boolean>(false);
  const [editingEmail, setEditingEmail] = useState<boolean>(false);

  const [name, setName] = useState<string>(user.name || "");
  const [email, setEmail] = useState<string>(user.email || "");

  const [status, setStatus] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const router = useRouter();

  async function handleUpdateUserInfo(e: FormEvent) {
    e.preventDefault();

    const data = {
      name: editingName ? name : undefined,
      email: editingEmail ? email : undefined,
    };

    const validated = updateUserInfoParams.safeParse(data);
    if (!validated.success) {
      setStatus(false);
      setMessage("Invalid Input");
    } else {
      const result = await updateUserInfo(validated.data);
      if (result.success) {
        setStatus(true);
        setEditingName(false);
        setEditingEmail(false);
        router.refresh();
      } else {
        setStatus(false);
        setMessage(result.message!);
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleUpdateUserInfo}>
        <p className="my-3 flex h-8">
          用户名称:
          {editingName ? (
            <Input
              placeholder="Name"
              className="w-fit h-full mx-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <span className="mx-2">{user.name}</span>
          )}
          <Pencil
            onClick={() => setEditingName(!editingName)}
            size={15}
            className="hover:scale-110"
          />
        </p>
        <p className="my-3 flex">
          邮箱:
          {editingEmail ? (
            <Input
              placeholder="id@exmaple.com"
              className="w-fit h-full mx-2"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          ) : (
            <span className="mx-2">
              <code className="bg-accent p-1 rounded-sm text-muted-foreground">{user.email}</code>
            </span>
          )}
          <Pencil
            onClick={() => setEditingEmail(!editingEmail)}
            size={15}
            className="hover:scale-110"
          />
        </p>
        {(editingName || editingEmail) && (
          <div className="flex justify-end">
            <Button type="submit">提交更改</Button>
          </div>
        )}
        {!status && message && <div className="text-center text-sm text-red-500">{message}</div>}
        {status && message && <div className="text-center text-sm text-green-500">{message}</div>}
      </form>
    </div>
  );
}
