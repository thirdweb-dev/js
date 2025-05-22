"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useRef, useState } from "react";
import { Login } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function BasicLoginExample() {
  const [account, setAccount] = useState<Login.Client.LoginResult>();
  const otpRef = useRef<HTMLInputElement>(null);

  if (!account) {
    return (
      <div className="flex flex-col gap-4">
        <Button
          onClick={async () => {
            const account = await Login.Client.login({
              type: "google",
              client: THIRDWEB_CLIENT,
              baseURL: `${window.location.origin}/connect/login/api/auth`,
              chain: sepolia,
            });
            setAccount(account);
          }}
        >
          Login with Google
        </Button>
      </div>
    );
  }

  if (account.status === "requires_otp") {
    return (
      <div className="flex flex-col gap-4">
        <Input ref={otpRef} placeholder="OTP" />
        <Button
          onClick={async () => {
            if (!otpRef.current?.value) {
              return;
            }
            setAccount(await account.verifyOtp(otpRef.current?.value));
          }}
        >
          Verify OTP
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p>Logged in as: {account.id}</p>
      <Button
        onClick={async () => {
          const jwt = await account.getJWT();
          alert(`JWT: ${jwt}`);
        }}
      >
        Get JWT
      </Button>
      <Button
        onClick={async () => {
          await account.logout();
          setAccount(undefined);
        }}
      >
        Logout
      </Button>
    </div>
  );
}
