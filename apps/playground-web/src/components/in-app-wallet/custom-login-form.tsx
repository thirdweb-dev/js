"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useState } from "react";
import { useActiveAccount, useConnect } from "thirdweb/react";
import { inAppWallet, preAuthenticate } from "thirdweb/wallets";
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
      <div className="flex w-full flex-col space-y-4">
        <label htmlFor="email" className="font-medium text-sm">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          onClick={() => sendEmailVerificationCode(email)}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors enabled:hover:bg-blue-600"
          disabled={isConnecting || !email}
        >
          {isConnecting ? "Submitting..." : "Submit"}
        </button>
        <p className="text-center text-sm text-white">Or</p>
        <button
          type="button"
          onClick={loginWithGoogle}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors enabled:hover:bg-blue-600"
        >
          Login with Google
        </button>
        {error && <p className="max-w-[300px] text-red-500">{error.message}</p>}
      </div>
    );
  }

  if (screen === "verify") {
    return (
      <div className="flex flex-col space-y-2">
        <label htmlFor="verification-code" className="font-medium text-sm">
          Verification Code
        </label>
        <input
          type="text"
          id="verification-code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter the code you received"
          required
        />
        <button
          type="submit"
          onClick={() => loginWithEmail(email, verificationCode)}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors enabled:hover:bg-blue-600"
          disabled={isConnecting || !verificationCode}
        >
          {isConnecting ? "Submitting..." : "Submit"}
        </button>
        {error && <p className="max-w-[300px] text-red-500">{error.message}</p>}
      </div>
    );
  }
}
