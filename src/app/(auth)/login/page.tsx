import LoginForm from "@/components/login-form";
import {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription>请登录账号以继续操作</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/register">注册</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </>
  );
}
