"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Chain } from "thirdweb";
import {
  useActiveAccount,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { useDebounce } from "use-debounce";

type AddChainToWalletProps = {
  chain: Chain;
};

export const AddChainToWallet: React.FC<AddChainToWalletProps> = (props) => {
  const address = useActiveAccount()?.address;
  const switchChain = useSwitchActiveWalletChain();
  const activeWalletChainId = useActiveWalletChain()?.id;

  const switchChainMutation = useMutation({
    mutationFn: async () => {
      await switchChain(props.chain);
    },
    onSuccess: () => {
      toast.success(`${props.chain.name} added to wallet`);
    },
    onError: () => {
      toast.error(`Failed to add ${props.chain.name} to wallet`);
    },
  });

  // debounce the loading state to prevent flickering
  const [debouncedLoading] = useDebounce(switchChainMutation.isLoading, 50);

  const buttonContent = (
    <Button
      disabled={
        !address || debouncedLoading || activeWalletChainId === props.chain?.id
      }
      className="gap-2"
      variant="outline"
      onClick={() => switchChainMutation.mutate()}
    >
      <span>Add to wallet</span>
      {debouncedLoading && <Spinner className="size-3" />}
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
