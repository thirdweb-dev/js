/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import type { InAppWalletAuth } from "thirdweb/wallets";
import { getSocialIcon } from "thirdweb/wallets/in-app";

const authOptions: InAppWalletAuth[] = [
  "email",
  "phone",
  "passkey",
  "guest",
  "wallet",
  "google",
  "apple",
  "facebook",
  "x",
  "discord",
  "telegram",
  "twitch",
  "farcaster",
  "github",
  "line",
  "coinbase",
  "steam",
  "backend",
];

export function AuthList() {
  return (
    <div className={cn("my-4 rounded-lg border p-4")}>
      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {authOptions?.map((auth) => (
          <li key={auth} className="flex items-center">
            <div className="flex flex-row items-center gap-2">
              <img src={getSocialIcon(auth)} alt={auth} className="h-4 w-4" />
              {auth.charAt(0).toUpperCase() + auth.slice(1)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
