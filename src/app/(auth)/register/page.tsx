import RegisterForm from "@/components/register-form";
import Link from "next/link";
import {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <>
      <CardHeader>
        <CardTitle>注册账号</CardTitle>
        <CardDescription>*输入邀请码以验证身份</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/login">登录</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </>
  );
}
