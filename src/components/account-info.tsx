"use client";

import { FormEvent, useState } from "react";
import { ChevronLeft, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updatePasswordParams, updateUserInfoParams } from "@/lib/schema";
import { updatePassword, updateUserInfo } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

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

  const [editingPassword, setEditingPassword] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const [passwordMessage, setPasswordMessage] = useState<string>("");

  async function handleUpdatePassword(e: FormEvent) {
    e.preventDefault();
    const validated = updatePasswordParams.safeParse({
      oldPassword,
      newPassword,
    });

    if (!validated.success) {
      setPasswordMessage("密码不能少于8位");
    } else {
      const result = await updatePassword(validated.data);
      if (!result.success) {
        setPasswordMessage(result.message!);
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleUpdateUserInfo} className="my-6">
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
      <h3
        onClick={() => setEditingPassword(!editingPassword)}
        className={clsx(
          "flex hover:text-foreground hover:cursor-default",
          editingPassword ? "text-foreground" : "text-foreground/65",
        )}
      >
        修改密码
        <ChevronLeft
          className={clsx(
            editingPassword ? "-rotate-90 transition duration-150" : "rotate-0 transition",
          )}
        />
      </h3>

      {editingPassword && (
        <form onSubmit={handleUpdatePassword} className="my-4">
          <label htmlFor="oldPassword">原密码</label>
          <Input
            id="oldPassword"
            className="my-2 w-fit block"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <label htmlFor="newPassword">新密码</label>
          <Input
            id="newPassword"
            className="my-2 w-fit block"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            type="submit"
            className="bg-destructive hover:bg-destructive/75 text-background my-2"
          >
            修改并重新登录
          </Button>
          {passwordMessage && (
            <div className="text-center text-sm text-red-500">{passwordMessage}</div>
          )}
        </form>
      )}
    </div>
  );
}
