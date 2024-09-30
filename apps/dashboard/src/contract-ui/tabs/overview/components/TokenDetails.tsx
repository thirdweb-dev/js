import { TokenSupply } from "contract-ui/tabs/tokens/components/supply";
import type { ThirdwebContract } from "thirdweb";

interface TokenDetailsProps {
  contract: ThirdwebContract;
}

export const TokenDetails: React.FC<TokenDetailsProps> = ({ contract }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full flex-row items-center justify-between">
        <h2 className="font-semibold text-2xl tracking-tight">Token Details</h2>
      </div>
      <TokenSupply contract={contract} />
    </div>
  );
};
