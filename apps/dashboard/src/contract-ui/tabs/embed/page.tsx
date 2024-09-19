import type { ThirdwebContract } from "thirdweb";
import { EmbedSetup } from "./components/embed-setup";

interface ContractEmbedPageProps {
  contract: ThirdwebContract;
  ercOrMarketplace:
    | "marketplace"
    | "marketplace-v3"
    | "erc20"
    | "erc1155"
    | "erc721"
    | null;
}

export const ContractEmbedPage: React.FC<ContractEmbedPageProps> = ({
  contract,
  ercOrMarketplace,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {ercOrMarketplace && (
        <EmbedSetup contract={contract} ercOrMarketplace={ercOrMarketplace} />
      )}
    </div>
  );
};
