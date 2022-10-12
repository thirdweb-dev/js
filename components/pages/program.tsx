import { useProgram } from "@thirdweb-dev/react/solana";
import { NFTDropPanel } from "program-ui/nft/nft-drop-panel";
import { NFTCollectionPanel } from "program-ui/nft/nft-panel";
import { TokenPanel } from "program-ui/token/token-panel";

export type ProgramPageProps = {
  address: string;
};

export const ProgramOverviewTab: React.FC<ProgramPageProps> = ({ address }) => {
  const { data: program } = useProgram(address);

  if (program?.accountType === "nft-collection") {
    return <NFTCollectionPanel program={program} />;
  }
  if (program?.accountType === "nft-drop") {
    return <NFTDropPanel program={program} />;
  }
  if (program?.accountType === "token") {
    return <TokenPanel program={program} />;
  }
  return null;
};
