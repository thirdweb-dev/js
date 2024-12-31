import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChainIcon } from "components/icons/ChainIcon";
import { OPSponsoredChains } from "constants/chains";
import { SettingsIcon } from "lucide-react";
import type { UseNetworkSwitcherModalOptions } from "thirdweb/react";
import { useAllChainsData } from "../../hooks/chains/allChains";
import {
  type StoredChain,
  addRecentlyUsedChainId,
} from "../../stores/chainStores";

type ChainRenderProps = React.ComponentProps<
  NonNullable<UseNetworkSwitcherModalOptions["renderChain"]>
>;

type CustomChainRendererProps = ChainRenderProps & {
  disableChainConfig?: boolean;
  openEditChainModal: (chain: StoredChain) => void;
};

export const CustomChainRenderer = ({
  chain,
  switchChain,
  switching,
  switchFailed,
  close,
  disableChainConfig,
  openEditChainModal,
}: CustomChainRendererProps) => {
  const { idToChain } = useAllChainsData();
  const storedChain = idToChain.get(chain.id);
  const isDeprecated = storedChain?.status === "deprecated";
  const isSponsored = OPSponsoredChains.includes(chain.id);

  return (
    <div className="flex min-h-[48px] w-full cursor-pointer justify-start rounded-lg px-2 py-1 hover:bg-accent">
      <div className="group flex flex-1 items-center">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: FIXME */}
        <div
          className={cn(
            "flex flex-1 items-center gap-4",
            isDeprecated ? "cursor-not-allowed" : "cursor-pointer",
          )}
          onClick={() => {
            if (!isDeprecated) {
              switchChain();
            }
          }}
        >
          <ChainIcon ipfsSrc={chain.icon?.url} className="size-8" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p
                className={cn(
                  "font-semibold text-base",
                  isDeprecated ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {chain.name}
              </p>
              {isDeprecated && (
                <div className="flex shrink-0 cursor-not-allowed items-center overflow-hidden rounded-xl border px-2 py-1 font-medium text-xs">
                  Deprecated
                </div>
              )}
              {isSponsored && (
                <div
                  style={{
                    background: "linear-gradient(to right, #701953, #5454B2)",
                  }}
                  className="flex shrink-0 cursor-not-allowed items-center overflow-hidden rounded-xl px-2 py-1 font-medium text-xs"
                >
                  Sponsored
                </div>
              )}
            </div>
            {switching && (
              <div className="flex items-center gap-1 font-medium text-link-foreground text-xs">
                Confirm in your wallet
                <Spinner className="size-3" />
              </div>
            )}

            {switchFailed && (
              <div className="font-semibold text-destructive-text text-xs">
                Error switching network
              </div>
            )}
          </div>
        </div>

        {!disableChainConfig && storedChain && (
          <Button
            variant="ghost"
            className="ml-auto p-2 leading-4 transition-opacity hover:bg-transparent group-hover:opacity-100 md:opacity-0"
            aria-label="Configure Network"
            onClick={() => {
              openEditChainModal(storedChain);
              addRecentlyUsedChainId(chain.id);
              if (close) {
                close();
              } else {
                console.error("close is undefined");
              }
            }}
          >
            <SettingsIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
