"use client";

import { MultiNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { AutoResizeTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowUpIcon,
  CheckIcon,
  ChevronDown,
  ChevronDownIcon,
  CircleStopIcon,
  CopyIcon,
} from "lucide-react";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  AccountAvatar,
  AccountBlobbie,
  AccountName,
  AccountProvider,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { ChainIconClient } from "../../../../components/icons/ChainIcon";
import { useAllChainsData } from "../../../../hooks/chains/allChains";
import type { NebulaContext } from "../api/chat";

export type WalletMeta = {
  type: "user" | "smart";
  address: string;
};

export function ChatBar(props: {
  sendMessage: (message: string) => void;
  isChatStreaming: boolean;
  abortChatStream: () => void;
  prefillMessage: string | undefined;
  className?: string;
  context: NebulaContext | undefined;
  setContext: (context: NebulaContext | undefined) => void;
  showContextSelector: boolean;
  client: ThirdwebClient;
  connectedWallets: WalletMeta[];
  activeAccountAddress: string | undefined;
  setActiveWallet: (wallet: WalletMeta) => void;
}) {
  const [message, setMessage] = useState(props.prefillMessage || "");
  const selectedChainIds = props.context?.chainIds?.map((x) => Number(x)) || [];
  const firstChainId = selectedChainIds[0];

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-2",
        props.className,
      )}
    >
      <div className="max-h-[200px] overflow-y-auto">
        <AutoResizeTextarea
          placeholder={"Ask Nebula"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            // ignore if shift key is pressed to allow entering new lines
            if (e.shiftKey) {
              return;
            }
            if (e.key === "Enter" && !props.isChatStreaming) {
              e.preventDefault();
              setMessage("");
              props.sendMessage(message);
            }
          }}
          className="min-h-[60px] resize-none border-none bg-transparent pt-2 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={props.isChatStreaming}
        />
      </div>

      <div className="flex items-end justify-between gap-3 px-2 pb-2">
        {/* left */}
        <div className="flex flex-wrap items-center gap-2">
          {props.showContextSelector && (
            <div className="flex gap-2">
              <MultiNetworkSelector
                client={props.client}
                hideTestnets
                disableChainId
                selectedChainIds={selectedChainIds}
                popoverContentClassName="!w-[calc(100vw-80px)] lg:!w-[360px]"
                align="start"
                side="top"
                showSelectedValuesInModal={true}
                customTrigger={
                  <Button
                    variant="ghost"
                    className="h-auto w-full p-0 hover:bg-transparent "
                  >
                    {selectedChainIds.length > 0 && firstChainId && (
                      <ChainBadge
                        chainId={firstChainId}
                        plusMore={selectedChainIds.length - 1}
                        client={props.client}
                      />
                    )}

                    {selectedChainIds.length === 0 && (
                      <Badge
                        variant="outline"
                        className="flex h-auto gap-1 px-2 py-1.5 hover:bg-accent"
                      >
                        Select Chains
                        <ChevronDownIcon className="size-3 text-muted-foreground" />
                      </Badge>
                    )}
                  </Button>
                }
                onChange={(values) => {
                  props.setContext({
                    walletAddress: props.context?.walletAddress || null,
                    chainIds: values.map((x) => x.toString()),
                  });
                }}
                priorityChains={[
                  1, // ethereum
                  56, // bnb smart chain mainnet (bsc)
                  42161, // arbitrum one mainnet
                  8453, // base mainnet
                  43114, // avalanche mainnet
                  146, // sonic
                  137, // polygon
                  80094, // berachain mainnet
                  10, // optimism
                ]}
              />

              {props.connectedWallets.length > 1 && (
                <WalletSelector
                  client={props.client}
                  wallets={props.connectedWallets}
                  activeAccountAddress={props.activeAccountAddress}
                  onClick={(walletMeta) => {
                    props.setActiveWallet(walletMeta);
                    props.setContext({
                      walletAddress: walletMeta.address,
                      chainIds: props.context?.chainIds || [],
                    });
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Send / Stop */}
        {props.isChatStreaming ? (
          <Button
            variant="default"
            className="!h-auto w-auto gap-2 p-2"
            onClick={() => {
              props.abortChatStream();
            }}
          >
            <CircleStopIcon className="size-4" />
            Stop
          </Button>
        ) : (
          <Button
            aria-label="Send"
            disabled={message.trim() === ""}
            className={cn(
              "!h-auto w-auto border border-transparent p-2 disabled:opacity-100",
              message === "" &&
                "border-border bg-muted text-muted-foreground hover:border-transparent hover:text-foreground",
            )}
            onClick={() => {
              if (message.trim() === "") return;
              setMessage("");
              props.sendMessage(message);
            }}
          >
            <ArrowUpIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function ChainBadge(props: {
  chainId: number;
  plusMore: number;
  client: ThirdwebClient;
}) {
  const { idToChain } = useAllChainsData();
  const chain = idToChain.get(props.chainId);

  return (
    <Badge
      variant="outline"
      className="flex h-auto gap-1.5 px-1.5 py-1.5 hover:bg-accent"
    >
      <ChainIconClient
        src={chain?.icon?.url}
        client={props.client}
        className="size-3.5"
      />
      {chain?.name ? shortenChainName(chain.name) : `Chain #${props.chainId}`}
      {props.plusMore > 0 && (
        <span className="text-foreground"> +{props.plusMore}</span>
      )}
      <ChevronDownIcon className="size-3 text-muted-foreground/70" />
    </Badge>
  );
}

function shortenChainName(chainName: string) {
  return chainName.replace("Mainnet", "").trim();
}

function WalletSelector(props: {
  wallets: WalletMeta[];
  onClick: (wallet: WalletMeta) => void;
  client: ThirdwebClient;
  activeAccountAddress: string | undefined;
}) {
  const [open, setOpen] = useState(false);

  if (!props.activeAccountAddress) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="flex h-auto items-center gap-1 rounded-full px-2 py-1.5 text-xs"
        >
          {shortenAddress(props.activeAccountAddress)}
          <ChevronDown className="ml-1 size-3 text-muted-foreground/70" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[350px] overflow-hidden border p-0 shadow-xl lg:w-[350px]"
        sideOffset={10}
      >
        <div className="border-b p-3 py-4">
          <p className="text-muted-foreground text-sm">
            Select account to use for executing transactions
          </p>
        </div>

        <div className="[&>*:not(:last-child)]:border-b">
          {props.wallets.map((wallet) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              key={wallet.address}
              className={cn(
                "flex cursor-pointer items-center justify-between px-3 py-4 hover:bg-accent/50",
                props.activeAccountAddress === wallet.address && "bg-accent/50",
              )}
              onClick={() => {
                setOpen(false);
                props.onClick(wallet);
              }}
            >
              <div className="flex items-center gap-2">
                <AccountProvider address={wallet.address} client={props.client}>
                  <div className="flex items-center gap-2">
                    <AccountAvatar
                      className="size-8 rounded-full"
                      loadingComponent={
                        <Skeleton className="size-8 rounded-full border" />
                      }
                      fallbackComponent={
                        <AccountBlobbie className="size-8 rounded-full" />
                      }
                    />

                    <div>
                      <div className="flex items-center gap-1">
                        <AccountName
                          className="text-sm"
                          loadingComponent={
                            <span className="font-mono text-sm">
                              {shortenAddress(wallet.address)}
                            </span>
                          }
                          fallbackComponent={
                            <span className="font-mono text-sm">
                              {shortenAddress(wallet.address)}
                            </span>
                          }
                        />

                        <CopyButton address={wallet.address} />

                        {wallet.type === "smart" && (
                          <Badge variant="outline" className="bg-card px-2">
                            Gasless
                          </Badge>
                        )}
                      </div>

                      <div className="text-muted-foreground text-xs">
                        {wallet.type === "user" && "Your Account"}
                        {wallet.type === "smart" && "Smart Account"}
                      </div>
                    </div>
                  </div>
                </AccountProvider>
              </div>

              {props.activeAccountAddress === wallet.address && (
                <CheckIcon className="size-4 text-foreground" />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CopyButton(props: { address: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      className="h-auto w-auto p-1.5 text-muted-foreground"
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(props.address);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      }}
    >
      {copied ? (
        <CheckIcon className="size-3 text-green-500" />
      ) : (
        <CopyIcon className="size-3" />
      )}
    </Button>
  );
}
