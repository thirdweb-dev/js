import { TokenSupply } from "contract-ui/tabs/tokens/components/supply";
import type { ThirdwebContract } from "thirdweb";
import { Heading } from "tw-components";

interface TokenDetailsProps {
  contract: ThirdwebContract;
}

export const TokenDetails: React.FC<TokenDetailsProps> = ({ contract }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full flex-row items-center justify-between">
        <Heading size="title.sm">Token Details</Heading>
      </div>
      <TokenSupply contract={contract} />
    </div>
  );
};
