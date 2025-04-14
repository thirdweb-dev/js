"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { useState } from "react";
import { useActiveAccount, useConnect } from "thirdweb/react";
import { inAppWallet, preAuthenticate } from "thirdweb/wallets";
import { Label } from "../ui/label";
import { InAppConnectEmbed } from "./connect-button";

export function CustomLoginForm() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [screen, setScreen] = useState<"login" | "verify">("login");
  const { connect, isConnecting, error } = useConnect();
  const account = useActiveAccount();

  const sendEmailVerificationCode = async (email: string) => {
    setScreen("verify");
    await preAuthenticate({
      client: THIRDWEB_CLIENT,
      strategy: "email",
      email,
    });
  };

  const loginWithEmail = async (email: string, verificationCode: string) => {
    connect(async () => {
      const wallet = inAppWallet();
      await wallet.connect({
        strategy: "email",
        email,
        verificationCode,
        client: THIRDWEB_CLIENT,
      });
      return wallet;
    });
  };

  const loginWithGoogle = async () => {
    connect(async () => {
      const wallet = inAppWallet({
        auth: {
          options: ["google"],
          mode: "redirect",
          redirectUrl: `${window.location.origin}/connect/in-app-wallet`,
        },
      });
      await wallet.connect({
        strategy: "google",
        client: THIRDWEB_CLIENT,
      });
      return wallet;
    });
  };

  if (account) {
    return <InAppConnectEmbed />;
  }

  if (screen === "login") {
    return (
      <div className="flex w-full max-w-xl flex-col space-y-4 p-6">
        <div>
          <Label htmlFor="email" className="mb-2 block">
            Email Address
          </Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <Button
          type="submit"
          onClick={() => sendEmailVerificationCode(email)}
          disabled={isConnecting || !email}
        >
          {isConnecting ? "Submitting..." : "Submit"}
        </Button>
        <p className="text-center text-sm text-white">Or</p>
        <Button type="button" onClick={loginWithGoogle}>
          Login with Google
        </Button>
        {error && <p className="max-w-[300px] text-red-500">{error.message}</p>}
      </div>
    );
  }

  if (screen === "verify") {
    return (
      <div className="flex w-full max-w-xl flex-col space-y-4 p-6">
        <div>
          <Label htmlFor="verification-code" className="mb-2 block">
            Verification Code
          </Label>
          <Input
            type="text"
            id="verification-code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter the code you received"
            required
          />
        </div>
        <Button
          type="submit"
          onClick={() => loginWithEmail(email, verificationCode)}
          disabled={isConnecting || !verificationCode}
        >
          {isConnecting ? "Submitting..." : "Submit"}
        </Button>
        {error && <p className="max-w-[300px] text-red-500">{error.message}</p>}
      </div>
    );
  }
}
