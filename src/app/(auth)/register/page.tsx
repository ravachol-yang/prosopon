import RegisterForm from "@/components/RegisterForm";
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
        <CardDescription>*输入验证码以跳过邮箱验证</CardDescription>
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
