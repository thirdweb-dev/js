"use client";

import { useId, useState } from "react";
import { useActiveAccount, useConnect } from "thirdweb/react";
import { inAppWallet, preAuthenticate } from "thirdweb/wallets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { THIRDWEB_CLIENT } from "@/lib/client";
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
      email,
      strategy: "email",
    });
  };

  const loginWithEmail = async (email: string, verificationCode: string) => {
    connect(async () => {
      const wallet = inAppWallet();
      await wallet.connect({
        client: THIRDWEB_CLIENT,
        email,
        strategy: "email",
        verificationCode,
      });
      return wallet;
    });
  };

  const loginWithGoogle = async () => {
    connect(async () => {
      const wallet = inAppWallet({
        auth: {
          mode: "redirect",
          options: ["google"],
          redirectUrl: `${window.location.origin}/wallets/in-app-wallet`,
        },
      });
      await wallet.connect({
        client: THIRDWEB_CLIENT,
        strategy: "google",
      });
      return wallet;
    });
  };

  const emailId = useId();
  const verificationCodeId = useId();

  if (account) {
    return <InAppConnectEmbed />;
  }

  if (screen === "login") {
    return (
      <div className="flex w-full max-w-xl flex-col space-y-4 p-6">
        <div>
          <Label className="mb-2 block" htmlFor={emailId}>
            Email Address
          </Label>
          <Input
            id={emailId}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            type="email"
            value={email}
          />
        </div>
        <Button
          disabled={isConnecting || !email}
          onClick={() => sendEmailVerificationCode(email)}
          type="submit"
        >
          {isConnecting ? "Submitting..." : "Submit"}
        </Button>
        <p className="text-center text-sm text-white">Or</p>
        <Button onClick={loginWithGoogle} type="button">
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
          <Label className="mb-2 block" htmlFor={verificationCodeId}>
            Verification Code
          </Label>
          <Input
            id={verificationCodeId}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter the code you received"
            required
            type="text"
            value={verificationCode}
          />
        </div>
        <Button
          disabled={isConnecting || !verificationCode}
          onClick={() => loginWithEmail(email, verificationCode)}
          type="submit"
        >
          {isConnecting ? "Submitting..." : "Submit"}
        </Button>
        {error && <p className="max-w-[300px] text-red-500">{error.message}</p>}
      </div>
    );
  }
}
