"use client";
import { revalidatePathAction } from "@/actions/revalidate";
import { useTrack } from "hooks/analytics/useTrack";
import { useRef } from "react";
import {
  type ThirdwebClient,
  defineChain,
  encode,
  getContract,
  sendAndConfirmTransaction,
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
import { parseError } from "utils/errorParser";
import { useAddContractToProject } from "../../../hooks/project-contracts";
import type { CreateNFTCollectionAllValues } from "./_common/form";
import {
  getNFTDeploymentTrackingData,
  getNFTStepTrackingData,
} from "./_common/tracking";
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
  const trackEvent = useTrack();
  const addContractToProject = useAddContractToProject();
  const contractAddressRef = useRef<string | undefined>(undefined);

  function getContractAndAccount(params: {
    chain: string;
  }) {
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

    if (!activeAccount) {
      throw new Error("Wallet is not connected");
    }

    // eslint-disable-next-line no-restricted-syntax
    const chain = defineChain(Number(collectionInfo.chain));

    trackEvent(
      getNFTStepTrackingData({
        action: "deploy",
        ercType,
        chainId: Number(collectionInfo.chain),
        status: "attempt",
      }),
    );

    trackEvent(
      getNFTDeploymentTrackingData({
        ercType,
        type: "attempt",
        chainId: Number(collectionInfo.chain),
      }),
    );

    try {
      let contractAddress: string;

      if (ercType === "erc721") {
        contractAddress = await deployERC721Contract({
          account: activeAccount,
          client: props.client,
          chain: chain,
          type: "DropERC721",
          params: {
            name: collectionInfo.name,
            symbol: collectionInfo.symbol,
            description: collectionInfo.description,
            image: collectionInfo.image,
            social_urls: transformSocialUrls(collectionInfo.socialUrls),
            saleRecipient: sales.primarySaleRecipient,
            royaltyRecipient: sales.royaltyRecipient,
            royaltyBps: BigInt(sales.royaltyBps),
          },
        });
      } else {
        contractAddress = await deployERC1155Contract({
          account: activeAccount,
          client: props.client,
          chain: chain,
          type: "DropERC1155",
          params: {
            name: collectionInfo.name,
            symbol: collectionInfo.symbol,
            description: collectionInfo.description,
            image: collectionInfo.image,
            social_urls: transformSocialUrls(collectionInfo.socialUrls),
            saleRecipient: sales.primarySaleRecipient,
            royaltyRecipient: sales.royaltyRecipient,
            royaltyBps: BigInt(sales.royaltyBps),
          },
        });
      }

      trackEvent(
        getNFTStepTrackingData({
          action: "deploy",
          ercType,
          chainId: Number(collectionInfo.chain),
          status: "success",
        }),
      );

      trackEvent(
        getNFTDeploymentTrackingData({
          ercType,
          type: "success",
          chainId: Number(collectionInfo.chain),
        }),
      );

      contractAddressRef.current = contractAddress;

      // add contract to project in background
      addContractToProject.mutateAsync({
        teamId: props.teamId,
        projectId: props.projectId,
        contractAddress: contractAddress,
        chainId: collectionInfo.chain,
        deploymentType: "asset",
        contractType: ercType === "erc721" ? "DropERC721" : "DropERC1155",
      });

      return {
        contractAddress,
      };
    } catch (error) {
      const parsedError = parseError(error);
      const errorMessage =
        typeof parsedError === "string" ? parsedError : "Unknown error";
      trackEvent(
        getNFTStepTrackingData({
          action: "deploy",
          ercType,
          chainId: Number(collectionInfo.chain),
          status: "error",
          errorMessage,
        }),
      );

      trackEvent(
        getNFTDeploymentTrackingData({
          ercType,
          type: "error",
          chainId: Number(collectionInfo.chain),
          errorMessage,
        }),
      );

      throw error;
    }
  }

  async function handleLazyMintNFTs(params: {
    formValues: CreateNFTCollectionAllValues;
    ercType: "erc721" | "erc1155";
  }) {
    const { formValues, ercType } = params;

    const { contract, activeAccount } = getContractAndAccount({
      chain: formValues.collectionInfo.chain,
    });

    const lazyMintFn = ercType === "erc721" ? lazyMint721 : lazyMint1155;

    const transaction = lazyMintFn({
      contract,
      nfts: formValues.nfts,
    });

    trackEvent(
      getNFTStepTrackingData({
        action: "lazy-mint",
        ercType,
        chainId: Number(formValues.collectionInfo.chain),
        status: "attempt",
      }),
    );

    try {
      await sendAndConfirmTransaction({
        account: activeAccount,
        transaction,
      });

      trackEvent(
        getNFTStepTrackingData({
          action: "lazy-mint",
          ercType,
          chainId: Number(formValues.collectionInfo.chain),
          status: "success",
        }),
      );
    } catch (error) {
      const parsedError = parseError(error);
      const errorMessage =
        typeof parsedError === "string" ? parsedError : "Unknown error";

      trackEvent(
        getNFTStepTrackingData({
          action: "lazy-mint",
          ercType,
          chainId: Number(formValues.collectionInfo.chain),
          status: "error",
          errorMessage,
        }),
      );

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
          startTime: new Date(),
          currencyAddress: firstNFT.price_currency,
          maxClaimablePerWallet: maxUint256, // unlimited
          price: firstNFT.price_amount,
          maxClaimableSupply: maxUint256, // unlimited
          metadata: {
            name: "Public phase",
          },
        },
      ],
    });

    trackEvent(
      getNFTStepTrackingData({
        action: "claim-conditions",
        ercType: "erc721",
        chainId: Number(formValues.collectionInfo.chain),
        status: "attempt",
      }),
    );

    try {
      await sendAndConfirmTransaction({
        account: activeAccount,
        transaction,
      });

      trackEvent(
        getNFTStepTrackingData({
          action: "claim-conditions",
          ercType: "erc721",
          chainId: Number(formValues.collectionInfo.chain),
          status: "success",
        }),
      );
    } catch (error) {
      const parsedError = parseError(error);
      const errorMessage =
        typeof parsedError === "string" ? parsedError : "Unknown error";

      trackEvent(
        getNFTStepTrackingData({
          action: "claim-conditions",
          ercType: "erc721",
          chainId: Number(formValues.collectionInfo.chain),
          status: "error",
          errorMessage,
        }),
      );

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
      start: batch.startIndex,
      count: batch.count,
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
        tokenId: fetchedNFT.id,
        phases: [
          {
            startTime: new Date(),
            currencyAddress: uploadedNFT.price_currency,
            maxClaimablePerWallet: maxUint256, // unlimited
            price: uploadedNFT.price_amount,
            maxClaimableSupply: BigInt(uploadedNFT.supply),
            metadata: {
              name: "Public phase",
            },
          },
        ],
      });
    });

    const encodedTransactions = await Promise.all(
      transactions.map((tx) => encode(tx)),
    );

    const tx = multicall({
      contract: contract,
      data: encodedTransactions,
    });

    trackEvent(
      getNFTStepTrackingData({
        action: "claim-conditions",
        ercType: "erc1155",
        chainId: Number(values.collectionInfo.chain),
        status: "attempt",
      }),
    );

    try {
      await sendAndConfirmTransaction({
        transaction: tx,
        account: activeAccount,
      });

      trackEvent(
        getNFTStepTrackingData({
          action: "claim-conditions",
          ercType: "erc1155",
          chainId: Number(values.collectionInfo.chain),
          status: "success",
        }),
      );
    } catch (error) {
      const parsedError = parseError(error);
      const errorMessage =
        typeof parsedError === "string" ? parsedError : "Unknown error";

      trackEvent(
        getNFTStepTrackingData({
          action: "claim-conditions",
          ercType: "erc1155",
          chainId: Number(values.collectionInfo.chain),
          status: "error",
          errorMessage,
        }),
      );

      throw error;
    }
  }

  return (
    <CreateNFTPageUI
      {...props}
      onLaunchSuccess={() => {
        revalidatePathAction(
          `/team/${props.teamSlug}/project/${props.projectSlug}/assets`,
          "page",
        );
      }}
      createNFTFunctions={{
        erc1155: {
          lazyMintNFTs: (formValues) => {
            return handleLazyMintNFTs({
              formValues,
              ercType: "erc1155",
            });
          },
          deployContract: (formValues) => {
            return handleContractDeploy({
              values: formValues,
              ercType: "erc1155",
            });
          },
          setClaimConditions: async (params) => {
            return handleSetClaimConditionsERC1155(params);
          },
        },
        erc721: {
          deployContract: (formValues) => {
            return handleContractDeploy({
              values: formValues,
              ercType: "erc721",
            });
          },
          lazyMintNFTs: (formValues) => {
            return handleLazyMintNFTs({
              formValues,
              ercType: "erc721",
            });
          },

          setClaimConditions: async (formValues) => {
            return handleSetClaimConditionsERC721({
              formValues,
            });
          },
        },
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
