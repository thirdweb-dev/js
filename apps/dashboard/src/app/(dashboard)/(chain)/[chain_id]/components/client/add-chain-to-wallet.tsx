"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import type { Chain } from "thirdweb";
import {
  useActiveAccount,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { useDebounce } from "use-debounce";

type AddChainToWalletProps = {
  chain?: Chain;
  hasBackground?: boolean;
};

export const AddChainToWallet: React.FC<AddChainToWalletProps> = (props) => {
  const address = useActiveAccount()?.address;
  const switchChain = useSwitchActiveWalletChain();
  const activeWalletChainId = useActiveWalletChain()?.id;

  const switchChainMutation = useMutation({
    mutationFn: async () => {
      if (!props.chain) {
        throw new Error("Chain is not defined");
      }
      await switchChain(props.chain);
    },
  });

  // debounce the loading state to prevent flickering
  const [debouncedLoading] = useDebounce(switchChainMutation.isLoading, 50);

  const buttonContent = (
    <Button
      disabled={
        !address || debouncedLoading || activeWalletChainId === props.chain?.id
      }
      className={cn(
        "w-full md:min-w-40",
        props.hasBackground && "invert dark:invert-0",
      )}
      onClick={() => switchChainMutation.mutate()}
    >
      {debouncedLoading && <Spinner />}
      <span>Add to wallet</span>
    </Button>
  );

  if (address && activeWalletChainId !== props.chain?.id) {
    return buttonContent;
  }

  return (
    <ToolTipLabel
      label={
        activeWalletChainId === props.chain?.id
          ? "You are already connected to this chain"
          : "Connect your wallet first"
      }
    >
      <div className="cursor-not-allowed">{buttonContent}</div>
    </ToolTipLabel>
  );
};
