"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Chain, ThirdwebClient } from "thirdweb";
import {
  useActiveAccount,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { useDebounce } from "use-debounce";
import { useCustomConnectModal } from "@/components/connect-wallet";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { ToolTipLabel } from "@/components/ui/tooltip";

type AddChainToWalletProps = {
  chain: Chain;
  client: ThirdwebClient;
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
        className="w-full gap-2"
        disabled={disabled}
        onClick={() => {
          // Connect directly to this chain
          if (!account) {
            return customConnectModal({
              chain: props.chain,
              client: props.client,
            });
          }

          // switch to this chain
          const switchPromise = switchChainMutation.mutateAsync();
          toast.promise(switchPromise, {
            error: `Failed to add ${props.chain.name} to wallet`,
            success: `${props.chain.name} added to wallet`,
          });
        }}
        variant="outline"
      >
        <span>Add to wallet</span>
        {debouncedLoading && <Spinner className="size-3" />}
      </Button>
    </ToolTipLabel>
  );
};
