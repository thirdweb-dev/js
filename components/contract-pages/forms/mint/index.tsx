import { MarketplaceListForm } from "./list.marketplace";
import { ProposalMintForm } from "./mint.vote";
import { DrawerHeader } from "@chakra-ui/react";
import {
  Erc721,
  Marketplace,
  ValidContractInstance,
  Vote,
} from "@thirdweb-dev/sdk";
import { Heading } from "tw-components";

export interface IMintFormProps {
  contract?: ValidContractInstance | Erc721;
}

export const MintForm: React.FC<IMintFormProps> = ({ contract }) => {
  // if its a marketplace contract
  if (contract instanceof Marketplace) {
    return (
      <>
        <DrawerHeader>
          <Heading>Create new listing</Heading>
        </DrawerHeader>
        <MarketplaceListForm contract={contract} />
      </>
    );
  }

  if (contract instanceof Vote) {
    return (
      <>
        <DrawerHeader>
          <Heading>Create new proposal</Heading>
        </DrawerHeader>
        <ProposalMintForm contract={contract} />
      </>
    );
  }

  return null;
};
