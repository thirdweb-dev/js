"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { handleLogin, triggerLogin } from "./_sdk_";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  if (code) {
    handleLogin(code);
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Login Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              triggerLogin();
            }}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
