import { MarketplaceListForm } from "./list.marketplace";
import { EditionMintForm } from "./mint.edition";
import { EditionDropMintForm } from "./mint.editiondrop";
import { NFTCollectionMintForm } from "./mint.nftcollection";
import { NFTDropMintForm } from "./mint.nftdrop";
import { TokenMintForm } from "./mint.token";
import { ProposalMintForm } from "./mint.vote";
import { DrawerHeader, Heading } from "@chakra-ui/react";
import {
  Edition,
  EditionDrop,
  Marketplace,
  NFTCollection,
  NFTDrop,
  Token,
  ValidContractInstance,
  Vote,
} from "@thirdweb-dev/sdk";
import React from "react";

export interface IMintFormProps {
  contract?: ValidContractInstance;
}

export const MintForm: React.FC<IMintFormProps> = ({ contract }) => {
  // if its an NFT Collection contract
  if (contract instanceof NFTCollection) {
    return (
      <>
        <DrawerHeader>
          <Heading>Mint new NFT</Heading>
        </DrawerHeader>
        <NFTCollectionMintForm contract={contract} />
      </>
    );
  }
  // if its a drop contract
  if (contract instanceof NFTDrop) {
    return (
      <>
        <DrawerHeader>
          <Heading>Create new NFT Drop</Heading>
        </DrawerHeader>
        <NFTDropMintForm contract={contract} />
      </>
    );
  }
  // if its a edition drop contract
  if (contract instanceof EditionDrop) {
    return (
      <>
        <DrawerHeader>
          <Heading>Create new Edition Drop</Heading>
        </DrawerHeader>
        <EditionDropMintForm contract={contract} />
      </>
    );
  }
  // if its a edition contract
  if (contract instanceof Edition) {
    return (
      <>
        <DrawerHeader>
          <Heading>Mint new NFT</Heading>
        </DrawerHeader>
        <EditionMintForm contract={contract} />
      </>
    );
  }

  // if its a token contract
  if (contract instanceof Token) {
    return (
      <>
        <DrawerHeader>
          <Heading>Mint additional tokens</Heading>
        </DrawerHeader>
        <TokenMintForm contract={contract} />
      </>
    );
  }

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

  // // if its a pack contract
  // if (contract instanceof PackContract) {
  //   return (
  //     <>
  //       <DrawerHeader>
  //         <Heading>Create new pack</Heading>
  //       </DrawerHeader>
  //       <PackMintForm contract={contract} />
  //     </>
  //   );
  // }

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
