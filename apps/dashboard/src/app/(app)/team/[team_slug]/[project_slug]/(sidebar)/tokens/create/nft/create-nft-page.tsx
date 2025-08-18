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
import { grantRole } from "thirdweb/extensions/permissions";
import { useActiveAccount } from "thirdweb/react";
import { maxUint256 } from "thirdweb/utils";
import { create7702MinimalAccount } from "thirdweb/wallets/smart";
import { revalidatePathAction } from "@/actions/revalidate";
import { reportContractDeployed } from "@/analytics/report";
import type { Team } from "@/api/team/get-team";
import { useAddContractToProject } from "@/hooks/project-contracts";
import type { CreateNFTCollectionAllValues } from "./_common/form";
import { CreateNFTPageUI } from "./create-nft-page-ui";

export function CreateNFTPage(props: {
  accountAddress: string;
  client: ThirdwebClient;
  teamSlug: string;
  projectSlug: string;
  teamId: string;
  projectId: string;
  teamPlan: Team["billingPlan"];
}) {
  const activeAccount = useActiveAccount();
  const addContractToProject = useAddContractToProject();
  const contractAddressRef = useRef<string | undefined>(undefined);

  function getAccount(params: { gasless: boolean }) {
    if (!activeAccount) {
      throw new Error("Wallet is not connected");
    }

    if (params.gasless) {
      return create7702MinimalAccount({
        adminAccount: activeAccount,
        client: props.client,
        sponsorGas: true,
      });
    }

    return activeAccount;
  }

  function getDeployedContract(params: { chain: string }) {
    // eslint-disable-next-line no-restricted-syntax
    const chain = defineChain(Number(params.chain));

    const contractAddress = contractAddressRef.current;

    if (!contractAddress) {
      throw new Error("Contract not found");
    }

    return getContract({
      address: contractAddress,
      chain,
      client: props.client,
    });
  }

  async function handleContractDeploy(params: {
    values: CreateNFTCollectionAllValues;
    ercType: "erc721" | "erc1155";
    gasless: boolean;
  }) {
    const { values: formValues, ercType } = params;
    const { collectionInfo, sales } = formValues;
    const contractType =
      ercType === "erc721" ? ("DropERC721" as const) : ("DropERC1155" as const);

    const account = getAccount({
      gasless: params.gasless,
    });

    // eslint-disable-next-line no-restricted-syntax
    const chain = defineChain(Number(collectionInfo.chain));

    let contractAddress: string;

    if (ercType === "erc721") {
      contractAddress = await deployERC721Contract({
        account,
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
        account,
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
  }

  async function handleLazyMintNFTs(params: {
    values: CreateNFTCollectionAllValues;
    ercType: "erc721" | "erc1155";
    gasless: boolean;
  }) {
    const { values, ercType } = params;

    const contract = getDeployedContract({
      chain: values.collectionInfo.chain,
    });

    const account = getAccount({
      gasless: params.gasless,
    });

    const lazyMintFn = ercType === "erc721" ? lazyMint721 : lazyMint1155;

    const transaction = lazyMintFn({
      contract,
      nfts: values.nfts,
    });

    await sendAndConfirmTransaction({
      account,
      transaction,
    });
  }

  async function handleSetClaimConditionsERC721(params: {
    values: CreateNFTCollectionAllValues;
    gasless: boolean;
  }) {
    const { values } = params;
    const contract = getDeployedContract({
      chain: values.collectionInfo.chain,
    });

    const account = getAccount({
      gasless: params.gasless,
    });

    const firstNFT = values.nfts[0];
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

    await sendAndConfirmTransaction({
      account,
      transaction,
    });
  }

  async function handleSetClaimConditionsERC1155(params: {
    values: CreateNFTCollectionAllValues;
    batch: {
      startIndex: number;
      count: number;
    };
    gasless: boolean;
  }) {
    const { values, batch } = params;
    const contract = getDeployedContract({
      chain: values.collectionInfo.chain,
    });

    const account = getAccount({
      gasless: params.gasless,
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

    await sendAndConfirmTransaction({
      account,
      transaction: tx,
    });
  }

  async function handleSetAdmins(params: {
    contractAddress: string;
    contractType: "DropERC721" | "DropERC1155";
    admins: {
      address: string;
    }[];
    gasless: boolean;
    chain: string;
  }) {
    const contract = getDeployedContract({
      chain: params.chain,
    });

    const account = getAccount({
      gasless: params.gasless,
    });

    // remove the current account from the list - its already an admin, don't have to add it again
    const adminsToAdd = params.admins.filter(
      (admin) => admin.address !== account.address,
    );

    const encodedTxs = await Promise.all(
      adminsToAdd.map((admin) => {
        const tx = grantRole({
          contract,
          role: "admin",
          targetAccountAddress: admin.address,
        });

        return encode(tx);
      }),
    );

    const tx = multicall({
      contract,
      data: encodedTxs,
    });

    await sendAndConfirmTransaction({
      account,
      transaction: tx,
    });
  }

  return (
    <CreateNFTPageUI
      {...props}
      createNFTFunctions={{
        erc721: {
          deployContract: (params) => {
            return handleContractDeploy({
              ercType: "erc721",
              ...params,
            });
          },
          lazyMintNFTs: (params) => {
            return handleLazyMintNFTs({
              ercType: "erc721",
              ...params,
            });
          },
          setClaimConditions: async (params) => {
            return handleSetClaimConditionsERC721({
              ...params,
            });
          },
        },
        erc1155: {
          deployContract: (params) => {
            return handleContractDeploy({
              ercType: "erc1155",
              ...params,
            });
          },
          lazyMintNFTs: (params) => {
            return handleLazyMintNFTs({
              ercType: "erc1155",
              ...params,
            });
          },
          setClaimConditions: async (params) => {
            return handleSetClaimConditionsERC1155(params);
          },
        },
        setAdmins: handleSetAdmins,
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
