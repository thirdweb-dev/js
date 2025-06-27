import type { ThirdwebContract } from "thirdweb";
import { WalletAddress } from "@/components/blocks/wallet-address";

export function ContractCreatorBadge(props: {
  contractCreator: string;
  clientContract: ThirdwebContract;
}) {
  return (
    <div className="flex items-center gap-1.5 bg-card rounded-full px-2.5 py-1.5 border hover:bg-accent">
      <span className="text-xs text-foreground">By</span>
      <WalletAddress
        address={props.contractCreator}
        className="py-0 text-xs h-auto !no-underline"
        client={props.clientContract.client}
        iconClassName="size-3.5 hidden"
      />
    </div>
  );
}
