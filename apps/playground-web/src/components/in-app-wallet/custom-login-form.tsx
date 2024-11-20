"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useActiveAccount, useConnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { InAppConnectEmbed } from "./connect-button";

export function CustomLoginForm() {
  const [email, setEmail] = useState("");
  const { connect, isConnecting, error } = useConnect();
  const account = useActiveAccount();

  const { mutate: loginWithCustomAuthEndpoint } = useMutation({
    mutationFn: async (email: string) => {
      const wallet = await connect(async () => {
        const wallet = inAppWallet();
        await wallet.connect({
          strategy: "auth_endpoint",
          client: THIRDWEB_CLIENT,
          payload: JSON.stringify({
            userId: email,
            email,
          }),
        });
        return wallet;
      });
      return wallet;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithCustomAuthEndpoint(email);
  };
  if (account) {
    return <InAppConnectEmbed />;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col space-y-2">
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
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors enabled:hover:bg-blue-600"
          disabled={isConnecting || !email}
        >
          {isConnecting ? "Submitting..." : "Submit"}
        </button>
        {error && <p className="max-w-[300px] text-red-500">{error.message}</p>}
      </div>
    </form>
  );
}
