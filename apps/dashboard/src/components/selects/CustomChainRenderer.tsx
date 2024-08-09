import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChainIcon } from "components/icons/ChainIcon";
import { OPSponsoredChains } from "constants/chains";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import { useAddRecentlyUsedChainId } from "hooks/chains/recentlyUsedChains";
import {
  useSetEditChain,
  useSetIsNetworkConfigModalOpen,
} from "hooks/networkConfigModal";
import { SettingsIcon } from "lucide-react";
import { useMemo } from "react";
import type { UseNetworkSwitcherModalOptions } from "thirdweb/react";

type ChainRenderProps = React.ComponentProps<
  NonNullable<UseNetworkSwitcherModalOptions["renderChain"]>
>;

type CustomChainRendererProps = ChainRenderProps & {
  disableChainConfig?: boolean;
};

export const CustomChainRenderer = ({
  chain,
  switchChain,
  switching,
  switchFailed,
  close,
  disableChainConfig,
}: CustomChainRendererProps) => {
  const setIsOpenNetworkConfigModal = useSetIsNetworkConfigModalOpen();
  const addRecentlyUsedChain = useAddRecentlyUsedChainId();
  const setEditChain = useSetEditChain();
  const supportedChainsRecord = useSupportedChainsRecord();

  const storedChain = useMemo(() => {
    return chain.id in supportedChainsRecord
      ? supportedChainsRecord[chain.id]
      : undefined;
  }, [chain, supportedChainsRecord]);

  const isDeprecated = storedChain?.status === "deprecated";
  const isSponsored = OPSponsoredChains.includes(chain.id);

  return (
    <div className="flex w-full justify-start hover:bg-accent rounded-lg px-2 py-1 cursor-pointer min-h-[48px]">
      <div className="flex flex-1 items-center group">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: FIXME */}
        <div
          className={cn(
            "flex flex-1 gap-4 items-center",
            isDeprecated ? "cursor-not-allowed" : "cursor-pointer",
          )}
          onClick={() => {
            if (!isDeprecated) {
              switchChain();
            }
          }}
        >
          <ChainIcon ipfsSrc={chain.icon?.url} size={32} />
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <p
                className={cn(
                  "font-semibold text-base",
                  isDeprecated ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {chain.name}
              </p>
              {isDeprecated && (
                <div className="text-xs font-medium cursor-not-allowed flex rounded-xl items-center overflow-hidden shrink-0 py-1 px-2 border">
                  Deprecated
                </div>
              )}
              {isSponsored && (
                <div
                  style={{
                    background: "linear-gradient(to right, #701953, #5454B2)",
                  }}
                  className="text-xs font-medium cursor-not-allowed flex rounded-xl items-center overflow-hidden shrink-0 py-1 px-2"
                >
                  Sponsored
                </div>
              )}
            </div>
            {switching && (
              <div className="flex text-link-foreground text-xs font-medium items-center gap-1">
                Confirm in your wallet
                <Spinner className="size-3" />
              </div>
            )}

            {switchFailed && (
              <div className="text-destructive-text text-xs font-semibold">
                Error switching network
              </div>
            )}
          </div>
        </div>

        {!disableChainConfig && storedChain && (
          <Button
            variant="ghost"
            className="ml-auto p-2 leading-4 opacity-0 group-hover:opacity-100 hover:bg-transparent transition-opacity"
            aria-label="Configure Network"
            onClick={() => {
              setEditChain(storedChain);
              addRecentlyUsedChain(chain.id);
              setIsOpenNetworkConfigModal(true);
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
