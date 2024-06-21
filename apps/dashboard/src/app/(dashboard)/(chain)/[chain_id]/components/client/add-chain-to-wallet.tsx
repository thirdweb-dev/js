"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { useAddress, useChainId, useSwitchChain } from "@thirdweb-dev/react";
import { useDebounce } from "use-debounce";

type AddChainToWalletProps = {
  chainId: number;
};

export const AddChainToWallet: React.FC<AddChainToWalletProps> = (props) => {
  const address = useAddress();
  const switchChain = useSwitchChain();
  const activeWalletChainId = useChainId();

  const switchChainMutation = useMutation({
    mutationFn: async () => {
      await switchChain(props.chainId);
    },
  });

  // debounce the loading state to prevent flickering
  const [debouncedLoading] = useDebounce(switchChainMutation.isLoading, 50);

  const buttonContent = (
    <Button
      disabled={
        !address || debouncedLoading || activeWalletChainId === props.chainId
      }
      className="w-full md:min-w-40"
      onClick={() => switchChainMutation.mutate()}
    >
      {debouncedLoading && <Spinner />}
      <span>Add to wallet</span>
    </Button>
  );

  if (address && activeWalletChainId !== props.chainId) {
    return buttonContent;
  }

  return (
    <ToolTipLabel
      label={
        activeWalletChainId === props.chainId
          ? "You are already connected to this chain"
          : "Connect your wallet first"
      }
    >
      <div className="cursor-not-allowed">{buttonContent}</div>
    </ToolTipLabel>
  );
};
