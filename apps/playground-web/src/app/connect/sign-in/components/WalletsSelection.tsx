import { Img } from "@/components/ui/Img";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useWalletImage } from "thirdweb/react";
import { type WalletId, getAllWalletsList } from "thirdweb/wallets";
import type { ConnectPlaygroundOptions } from "./types";

export function WalletsSelection(props: {
  connectOptions: ConnectPlaygroundOptions;
  setConnectOptions: React.Dispatch<
    React.SetStateAction<ConnectPlaygroundOptions>
  >;
}) {
  const { connectOptions, setConnectOptions } = props;
  const [isEdited, setIsEdited] = useState(false);
  const walletsQuery = useQuery({
    queryKey: ["wallets"],
    queryFn: () => getAllWalletsList(),
  });

  const [search, setSearch] = useState("");

  type WalletInfo = {
    name: string;
    id: WalletId;
  };

  let wallets: WalletInfo[] | undefined = isEdited
    ? walletsQuery.data
    : walletsQuery.data?.sort((a, b) => {
        const aIsSelected = connectOptions.walletIds.includes(a.id);
        const bIsSelected = connectOptions.walletIds.includes(b.id);
        if (aIsSelected && !bIsSelected) {
          return -1;
        }
        if (!aIsSelected && bIsSelected) {
          return 1;
        }
        return 0;
      });

  // filter wallets
  if (search && wallets) {
    wallets = wallets.filter((wallet) =>
      wallet.name.toLowerCase().includes(search.toLowerCase()),
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-muted">
      {/* heading */}
      <div className="flex items-center justify-between gap-4 p-4">
        <h2 className="font-semibold text-base"> Other Wallets </h2>
        <div className="relative max-w-[320px] grow">
          <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Search from 500+ wallets"
            className="rounded-lg pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      {wallets && (
        <ScrollShadow
          scrollableClassName="h-[250px] px-2"
          shadowColor="hsl(var(--muted))"
          className="fade-in-0 animate-in duration-500"
        >
          <div className="h-2" />
          <div className="grid grid-cols-1 gap-x-4 gap-y-1.5 md:grid-cols-2">
            {wallets.map((wallet) => {
              const enabled = connectOptions.walletIds.includes(wallet.id);
              return (
                <WalletButton
                  id={wallet.id}
                  enabled={enabled}
                  key={wallet.id}
                  name={wallet.name}
                  onClick={() => {
                    setIsEdited(true);
                    setConnectOptions((v) => {
                      const newV = { ...v };
                      if (enabled) {
                        newV.walletIds = v.walletIds.filter(
                          (m) => m !== wallet.id,
                        );
                      } else {
                        newV.walletIds = [...v.walletIds, wallet.id];
                      }
                      return newV;
                    });
                  }}
                />
              );
            })}
          </div>
        </ScrollShadow>
      )}

      {!wallets && (
        <div className="flex h-[250px] items-center justify-center">
          <LoadingDots />
        </div>
      )}
    </section>
  );
}

function WalletButton(props: {
  id: WalletId;
  name: string;
  onClick: () => void;
  enabled: boolean;
}) {
  const walletImage = useWalletImage(props.id);
  return (
    <Button
      className={cn(
        "!h-auto justify-between gap-3 px-2 py-1.5 hover:bg-accent ",
      )}
      onClick={props.onClick}
      variant="ghost"
    >
      <span className="flex items-center gap-3">
        <Img
          src={walletImage.data || ""}
          alt=""
          className="size-7 rounded-lg"
          loading="lazy"
        />
        <span className="truncate"> {props.name}</span>
      </span>
      {props.enabled && <CheckIcon className="size-4 text-foreground/50" />}
    </Button>
  );
}
