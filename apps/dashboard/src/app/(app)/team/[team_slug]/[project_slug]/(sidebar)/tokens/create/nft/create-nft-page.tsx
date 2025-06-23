"use client";
import { useRef } from "react";
import {
  defineChain,
  encode,
  getContract,
  sendAndConfirmTransaction,
  type ThirdwebClient,
} from "thirdweb";
import { deployERC721Contract, deployERC1155Contract } from "thirdweb/deploys";
import { multicall } from "thirdweb/extensions/common";
import {
  lazyMint as lazyMint721,
  setClaimConditions as setClaimConditions721,
} from "thirdweb/extensions/erc721";
import {
  getNFTs as getNFTs1155,
  lazyMint as lazyMint1155,
  setClaimConditions as setClaimConditions1155,
} from "thirdweb/extensions/erc1155";
import { useActiveAccount } from "thirdweb/react";
import { maxUint256 } from "thirdweb/utils";
import { revalidatePathAction } from "@/actions/revalidate";
import {
  reportAssetCreationFailed,
  reportContractDeployed,
} from "@/analytics/report";
import { useAddContractToProject } from "@/hooks/project-contracts";
import { parseError } from "@/utils/errorParser";
import type { CreateNFTCollectionAllValues } from "./_common/form";
import { CreateNFTPageUI } from "./create-nft-page-ui";

export function CreateNFTPage(props: {
  accountAddress: string;
  client: ThirdwebClient;
  teamSlug: string;
  projectSlug: string;
  teamId: string;
  projectId: string;
}) {
  const activeAccount = useActiveAccount();

  const addContractToProject = useAddContractToProject();
  const contractAddressRef = useRef<string | undefined>(undefined);

  function getContractAndAccount(params: { chain: string }) {
    if (!activeAccount) {
      throw new Error("Wallet is not connected");
    }

    // eslint-disable-next-line no-restricted-syntax
    const chain = defineChain(Number(params.chain));

    const contractAddress = contractAddressRef.current;

    if (!contractAddress) {
      throw new Error("Contract not found");
    }

    const contract = getContract({
      address: contractAddress,
      chain,
      client: props.client,
    });

    return {
      activeAccount,
      contract,
    };
  }

  async function handleContractDeploy(params: {
    values: CreateNFTCollectionAllValues;
    ercType: "erc721" | "erc1155";
  }) {
    const { values: formValues, ercType } = params;
    const { collectionInfo, sales } = formValues;
    const contractType =
      ercType === "erc721" ? ("DropERC721" as const) : ("DropERC1155" as const);

    if (!activeAccount) {
      throw new Error("Wallet is not connected");
    }

    // eslint-disable-next-line no-restricted-syntax
    const chain = defineChain(Number(collectionInfo.chain));

    try {
      let contractAddress: string;

      if (ercType === "erc721") {
        contractAddress = await deployERC721Contract({
          account: activeAccount,
          chain: chain,
          client: props.client,
          params: {
            description: collectionInfo.description,
            image: collectionInfo.image,
            name: collectionInfo.name,
            royaltyBps: BigInt(sales.royaltyBps),
            royaltyRecipient: sales.royaltyRecipient,
            saleRecipient: sales.primarySaleRecipient,
            social_urls: transformSocialUrls(collectionInfo.socialUrls),
            symbol: collectionInfo.symbol,
          },
          type: "DropERC721",
        });
      } else {
        contractAddress = await deployERC1155Contract({
          account: activeAccount,
          chain: chain,
          client: props.client,
          params: {
            description: collectionInfo.description,
            image: collectionInfo.image,
            name: collectionInfo.name,
            royaltyBps: BigInt(sales.royaltyBps),
            royaltyRecipient: sales.royaltyRecipient,
            saleRecipient: sales.primarySaleRecipient,
            social_urls: transformSocialUrls(collectionInfo.socialUrls),
            symbol: collectionInfo.symbol,
          },
          type: "DropERC1155",
        });
      }

      reportContractDeployed({
        address: contractAddress,
        chainId: Number(collectionInfo.chain),
        contractName: contractType,
        deploymentType: "asset",
        publisher: "deployer.thirdweb.eth",
      });

      contractAddressRef.current = contractAddress;

      // add contract to project in background
      addContractToProject.mutateAsync({
        chainId: collectionInfo.chain,
        contractAddress: contractAddress,
        contractType: ercType === "erc721" ? "DropERC721" : "DropERC1155",
        deploymentType: "asset",
        projectId: props.projectId,
        teamId: props.teamId,
      });

      return {
        contractAddress,
      };
    } catch (error) {
      const errorMessage = parseError(error);
      console.error(errorMessage);

      reportAssetCreationFailed({
        assetType: "nft",
        contractType,
        error: errorMessage,
        step: "deploy-contract",
      });

      throw error;
    }
  }

  async function handleLazyMintNFTs(params: {
    formValues: CreateNFTCollectionAllValues;
    ercType: "erc721" | "erc1155";
  }) {
    const { formValues, ercType } = params;
    const contractType =
      ercType === "erc721" ? ("DropERC721" as const) : ("DropERC1155" as const);

    const { contract, activeAccount } = getContractAndAccount({
      chain: formValues.collectionInfo.chain,
    });

    const lazyMintFn = ercType === "erc721" ? lazyMint721 : lazyMint1155;

    const transaction = lazyMintFn({
      contract,
      nfts: formValues.nfts,
    });

    try {
      await sendAndConfirmTransaction({
        account: activeAccount,
        transaction,
      });
    } catch (error) {
      const errorMessage = parseError(error);
      console.error(error);

      reportAssetCreationFailed({
        assetType: "nft",
        contractType,
        error: errorMessage,
        step: "mint-nfts",
      });

      throw error;
    }
  }

  async function handleSetClaimConditionsERC721(params: {
    formValues: CreateNFTCollectionAllValues;
  }) {
    const { formValues } = params;
    const { contract, activeAccount } = getContractAndAccount({
      chain: formValues.collectionInfo.chain,
    });

    const firstNFT = formValues.nfts[0];
    if (!firstNFT) {
      throw new Error("No NFTs found");
    }

    const transaction = setClaimConditions721({
      contract,
      phases: [
        {
          currencyAddress: firstNFT.price_currency,
          maxClaimablePerWallet: maxUint256,
          maxClaimableSupply: maxUint256, // unlimited
          metadata: {
            name: "Public phase",
          },
          price: firstNFT.price_amount, // unlimited
          startTime: new Date(),
        },
      ],
    });

    try {
      await sendAndConfirmTransaction({
        account: activeAccount,
        transaction,
      });
    } catch (error) {
      const errorMessage = parseError(error);
      console.error(errorMessage);

      reportAssetCreationFailed({
        assetType: "nft",
        contractType: "DropERC721",
        error: errorMessage,
        step: "set-claim-conditions",
      });

      throw error;
    }
  }

  async function handleSetClaimConditionsERC1155(params: {
    values: CreateNFTCollectionAllValues;
    batch: {
      startIndex: number;
      count: number;
    };
  }) {
    const { values, batch } = params;
    const { contract, activeAccount } = getContractAndAccount({
      chain: values.collectionInfo.chain,
    });

    const endIndexExclusive = batch.startIndex + batch.count;
    const nfts = values.nfts.slice(batch.startIndex, endIndexExclusive);

    // fetch nfts
    const fetchedNFTs = await getNFTs1155({
      contract,
      count: batch.count,
      start: batch.startIndex,
    });

    const transactions = nfts.map((uploadedNFT, i) => {
      const fetchedNFT = fetchedNFTs[i];

      if (!fetchedNFT) {
        throw new Error("Failed to find NFT");
      }

      if (fetchedNFT.metadata.name !== uploadedNFT.name) {
        throw new Error("Failed to find NFT in batch");
      }

      return setClaimConditions1155({
        contract,
        phases: [
          {
            currencyAddress: uploadedNFT.price_currency,
            maxClaimablePerWallet: maxUint256,
            maxClaimableSupply: BigInt(uploadedNFT.supply), // unlimited
            metadata: {
              name: "Public phase",
            },
            price: uploadedNFT.price_amount,
            startTime: new Date(),
          },
        ],
        tokenId: fetchedNFT.id,
      });
    });

    const encodedTransactions = await Promise.all(
      transactions.map((tx) => encode(tx)),
    );

    const tx = multicall({
      contract: contract,
      data: encodedTransactions,
    });

    try {
      await sendAndConfirmTransaction({
        account: activeAccount,
        transaction: tx,
      });
    } catch (error) {
      const errorMessage = parseError(error);
      console.error(errorMessage);

      reportAssetCreationFailed({
        assetType: "nft",
        contractType: "DropERC1155",
        error: errorMessage,
        step: "set-claim-conditions",
      });

      throw error;
    }
  }

  return (
    <CreateNFTPageUI
      {...props}
      createNFTFunctions={{
        erc721: {
          deployContract: (formValues) => {
            return handleContractDeploy({
              ercType: "erc721",
              values: formValues,
            });
          },
          lazyMintNFTs: (formValues) => {
            return handleLazyMintNFTs({
              ercType: "erc721",
              formValues,
            });
          },

          setClaimConditions: async (formValues) => {
            return handleSetClaimConditionsERC721({
              formValues,
            });
          },
        },
        erc1155: {
          deployContract: (formValues) => {
            return handleContractDeploy({
              ercType: "erc1155",
              values: formValues,
            });
          },
          lazyMintNFTs: (formValues) => {
            return handleLazyMintNFTs({
              ercType: "erc1155",
              formValues,
            });
          },
          setClaimConditions: async (params) => {
            return handleSetClaimConditionsERC1155(params);
          },
        },
      }}
      onLaunchSuccess={() => {
        revalidatePathAction(
          `/team/${props.teamSlug}/project/${props.projectSlug}/tokens`,
          "page",
        );
      }}
    />
  );
}

function transformSocialUrls(
  socialUrls: {
    platform: string;
    url: string;
  }[],
): Record<string, string> {
  return socialUrls.reduce(
    (acc, url) => {
      if (url.url && url.platform) {
        acc[url.platform] = url.url;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
}
