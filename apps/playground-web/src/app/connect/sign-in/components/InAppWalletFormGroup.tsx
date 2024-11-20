import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import type { InAppWalletAuth } from "thirdweb/wallets";
import type { ConnectPlaygroundOptions } from "./types";

const allInAppWalletLoginMethods: InAppWalletAuth[] = [
  "google",
  "discord",
  "telegram",
  "github",
  "twitch",
  "steam",
  "farcaster",
  "email",
  "passkey",
  "phone",
  "line",
  "x",
  "facebook",
  "apple",
  "coinbase",
  "guest",
];

export function InAppWalletFormGroup(props: {
  connectOptions: ConnectPlaygroundOptions;
  setConnectOptions: React.Dispatch<
    React.SetStateAction<ConnectPlaygroundOptions>
  >;
}) {
  const { connectOptions, setConnectOptions } = props;

  return (
    <div className="rounded-xl border bg-muted">
      <div className="flex items-center justify-between gap-2 p-4">
        <Link
          target="_blank"
          className="group flex items-center gap-2"
          href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
        >
          <h2 className="font-semibold tracking-tight">In-App Wallet</h2>
          <ExternalLinkIcon className="mt-[-2px] size-4 text-muted-foreground group-hover:text-foreground" />
        </Link>
        <Switch
          checked={connectOptions.inAppWallet.enabled}
          onCheckedChange={(checked) =>
            setConnectOptions((v) => ({
              ...v,
              inAppWallet: { ...v.inAppWallet, enabled: checked },
            }))
          }
        />
      </div>

      {connectOptions.inAppWallet.enabled && (
        <div className="fade-in-0 grid animate-in grid-cols-3 gap-2 p-4 pt-0 duration-500">
          {allInAppWalletLoginMethods.map((method) => {
            const enabled = connectOptions.inAppWallet.methods.includes(method);
            return (
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg py-1.5",
                  !enabled && "opacity-50",
                )}
                key={method}
                htmlFor={`in-app-wallet-${method}`}
              >
                <Checkbox
                  id={`in-app-wallet-${method}`}
                  checked={enabled}
                  onCheckedChange={(checked) => {
                    setConnectOptions((v) => {
                      const newInAppWallet = { ...v.inAppWallet };

                      // if should be removed
                      if (!checked) {
                        newInAppWallet.methods = v.inAppWallet.methods.filter(
                          (m) => m !== method,
                        );
                      }

                      // if should be added
                      else {
                        newInAppWallet.methods = [
                          ...v.inAppWallet.methods,
                          method,
                        ];
                      }
                      const newV = { ...v };
                      newV.inAppWallet = newInAppWallet;
                      return newV;
                    });
                  }}
                />
                <span className="select-none font-medium text-sm capitalize leading-none">
                  {method}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
