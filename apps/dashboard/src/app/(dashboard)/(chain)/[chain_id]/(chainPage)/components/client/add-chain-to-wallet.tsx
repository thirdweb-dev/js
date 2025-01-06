"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useCustomConnectModal } from "@3rdweb-sdk/react/components/connect-wallet";
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
  const account = useActiveAccount();
  const switchChain = useSwitchActiveWalletChain();
  const activeWalletChainId = useActiveWalletChain()?.id;
  const customConnectModal = useCustomConnectModal();

  const switchChainMutation = useMutation({
    mutationFn: async () => {
      await switchChain(props.chain);
    },
  });

  const [debouncedLoading] = useDebounce(switchChainMutation.isPending, 50);

  const disabled = debouncedLoading || activeWalletChainId === props.chain?.id;

  return (
    <ToolTipLabel
      label={
        activeWalletChainId === props.chain.id
          ? "Wallet is already connected to this chain"
          : undefined
      }
    >
      <Button
        disabled={disabled}
        className="w-full gap-2"
        variant="outline"
        onClick={() => {
          // Connect directly to this chain
          if (!account) {
            return customConnectModal({ chain: props.chain });
          }

          // switch to this chain
          const switchPromise = switchChainMutation.mutateAsync();
          toast.promise(switchPromise, {
            success: `${props.chain.name} added to wallet`,
            error: `Failed to add ${props.chain.name} to wallet`,
          });
        }}
      >
        <span>Add to wallet</span>
        {debouncedLoading && <Spinner className="size-3" />}
      </Button>
    </ToolTipLabel>
  );
};
