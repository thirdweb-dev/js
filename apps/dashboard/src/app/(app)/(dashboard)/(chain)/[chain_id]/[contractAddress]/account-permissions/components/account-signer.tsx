import { formatDistance } from "date-fns";
import type { ThirdwebClient } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { useAllChainsData } from "@/hooks/chains/allChains";

export type AccountSignerType = {
  signer: string;
  isAdmin?: boolean;
  approvedTargets: readonly string[];
  nativeTokenLimitPerTransaction: bigint;
  endTimestamp: bigint;
};
interface AccountSignerProps {
  item: AccountSignerType;
  contractChainId: number;
  client: ThirdwebClient;
}

export function AccountSigner({
  item,
  contractChainId,
  client,
}: AccountSignerProps) {
  const address = useActiveAccount()?.address;
  const { idToChain } = useAllChainsData();
  const chain = contractChainId ? idToChain.get(contractChainId) : undefined;
  const {
    isAdmin,
    signer,
    nativeTokenLimitPerTransaction,
    approvedTargets,
    endTimestamp,
  } = item;
  return (
    <div className="p-4 rounded-lg bg-card border lg:p-6">
      <div className="flex lg:items-center lg:justify-between items-start flex-col lg:flex-row gap-4">
        <WalletAddress
          address={signer}
          client={client}
          className="h-auto py-1"
          iconClassName="size-5"
        />
        <div className="flex flex-row gap-2">
          {isAdmin ? <Badge>Admin Key</Badge> : <Badge>Scoped key</Badge>}
          {signer === address && (
            <Badge variant="secondary">Currently connected</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-16 border-t pt-4 mt-6 lg:mt-4 border-dashed">
        <div className="space-y-0.5 text-sm">
          <div className="font-medium">Maximum value per transaction</div>
          <div className="capitalize">
            {nativeTokenLimitPerTransaction.toString()}{" "}
            {chain?.nativeCurrency.symbol}
          </div>
        </div>

        <div className="space-y-0.5 text-sm">
          <div className="font-medium">Approved targets</div>
          <div className="capitalize">{approvedTargets.length}</div>
        </div>

        <div className="space-y-0.5 text-sm">
          <div className="font-medium">Expiration</div>
          <div>
            {formatDistance(
              new Date(new Date(Number(endTimestamp * 1000n))),
              new Date(),
              {
                addSuffix: true,
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
