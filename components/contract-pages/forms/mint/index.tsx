import { MarketplaceListForm } from "./list.marketplace";
import { BundleDropMintForm } from "./mint.bundledrop";
import { CollectionMintForm } from "./mint.collection";
import { DropMintForm } from "./mint.drop";
import { NFTMintForm } from "./mint.nft";
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
  // if its an nft collection contract
  if (contract instanceof NFTCollection) {
    return (
      <>
        <DrawerHeader>
          <Heading>Mint new NFT</Heading>
        </DrawerHeader>
        <NFTMintForm contract={contract} />
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
        <DropMintForm contract={contract} />
      </>
    );
  }
  // if its a bundle drop contract
  if (contract instanceof EditionDrop) {
    return (
      <>
        <DrawerHeader>
          <Heading>Create new Edition Drop</Heading>
        </DrawerHeader>
        <BundleDropMintForm contract={contract} />
      </>
    );
  }
  // if its a bundle contract
  if (contract instanceof Edition) {
    return (
      <>
        <DrawerHeader>
          <Heading>Mint new NFT</Heading>
        </DrawerHeader>
        <CollectionMintForm contract={contract} />
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
