import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import type { MinimalTeamsAndProjects } from "components/contract-components/contract-deploy-form/add-to-project-card";
import { resolveFunctionSelectors } from "lib/selectors";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContractMetadata } from "thirdweb/extensions/common";
import { isAddress, isContractDeployed } from "thirdweb/utils";
import { shortenIfAddress } from "utils/usedapp-external";
import { NebulaChatButton } from "../../../../../nebula-app/(app)/components/FloatingChat/FloatingChat";
import { examplePrompts } from "../../../../../nebula-app/(app)/data/examplePrompts";
import {
  getAuthTokenWalletAddress,
  getUserThirdwebClient,
} from "../../../../api/lib/getAuthToken";
import { ConfigureCustomChain } from "./_layout/ConfigureCustomChain";
import { getContractMetadataHeaderData } from "./_layout/contract-metadata";
import { ContractPageLayout } from "./_layout/contract-page-layout";
import { ContractPageLayoutClient } from "./_layout/contract-page-layout.client";
import { supportedERCs } from "./_utils/detectedFeatures/supportedERCs";
import { getContractPageParamsInfo } from "./_utils/getContractFromParams";
import { getContractPageMetadata } from "./_utils/getContractPageMetadata";
import { getContractPageSidebarLinks } from "./_utils/getContractPageSidebarLinks";

export default async function Layout(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  if (!isAddress(params.contractAddress)) {
    return notFound();
  }

  const info = await getContractPageParamsInfo(params);

  if (!info) {
    return <ConfigureCustomChain chainSlug={params.chain_id} />;
  }

  const { clientContract, serverContract, chainMetadata, isLocalhostChain } =
    info;

  if (chainMetadata.status === "deprecated") {
    notFound();
  }

  const accountAddress = await getAuthTokenWalletAddress();

  const client = await getUserThirdwebClient();
  const teamsAndProjects = await getTeamsAndProjectsIfLoggedIn();

  if (isLocalhostChain) {
    return (
      <ContractPageLayoutClient
        chainMetadata={chainMetadata}
        contract={clientContract}
        teamsAndProjects={teamsAndProjects}
        client={client}
      >
        {props.children}
      </ContractPageLayoutClient>
    );
  }

  // check if the contract exists
  const isValidContract = await isContractDeployed(serverContract).catch(
    () => false,
  );
  if (!isValidContract) {
    // TODO - replace 404 with a better page to upsell deploy or other thirdweb products
    notFound();
  }
  const contractPageMetadata = await getContractPageMetadata(serverContract);

  const sidebarLinks = getContractPageSidebarLinks({
    chainSlug: chainMetadata.slug,
    contractAddress: serverContract.address,
    metadata: contractPageMetadata,
  });

  const { contractMetadata, externalLinks } =
    await getContractMetadataHeaderData(serverContract);

  const contractAddress = serverContract.address;
  const chainName = chainMetadata.name;
  const chainId = chainMetadata.chainId;

  const contractPromptPrefix = `A user is viewing the contract address ${contractAddress} on ${chainName} (Chain ID: ${chainId}). Provide a concise summary of this contract's functionalities, such as token minting, staking, or governance mechanisms. Focus on what the contract enables users to do, avoiding transaction execution details unless requested.
Users may be interested in how to interact with the contract. Outline common interaction patterns, such as claiming rewards, participating in governance, or transferring assets. Emphasize the contract's capabilities without guiding through transaction processes unless asked.
Provide insights into how the contract is being used. Share information on user engagement, transaction volumes, or integration with other dApps, focusing on the contract's role within the broader ecosystem.
Users may be considering integrating the contract into their applications. Discuss how this contract's functionalities can be leveraged within different types of dApps, highlighting potential use cases and benefits.

The following is the user's message:`;

  return (
    <ContractPageLayout
      chainMetadata={chainMetadata}
      contract={clientContract}
      sidebarLinks={sidebarLinks}
      dashboardContractMetadata={contractMetadata}
      externalLinks={externalLinks}
      teamsAndProjects={teamsAndProjects}
      client={client}
    >
      <NebulaChatButton
        isLoggedIn={!!accountAddress}
        networks={info.chainMetadata.testnet ? "testnet" : "mainnet"}
        isFloating={true}
        pageType="contract"
        label="Ask AI about this contract"
        client={client}
        nebulaParams={{
          messagePrefix: contractPromptPrefix,
          chainIds: [chainId],
          wallet: accountAddress ?? undefined,
        }}
        examplePrompts={examplePrompts}
      />
      {props.children}
    </ContractPageLayout>
  );
}

async function getTeamsAndProjectsIfLoggedIn() {
  try {
    const teams = await getTeams();

    if (!teams) {
      return undefined;
    }

    const teamsAndProjects: MinimalTeamsAndProjects = await Promise.all(
      teams.map(async (team) => ({
        team: {
          id: team.id,
          name: team.name,
          slug: team.slug,
          image: team.image,
        },
        projects: (await getProjects(team.slug)).map((x) => ({
          id: x.id,
          name: x.name,
          image: x.image,
        })),
      })),
    );

    return teamsAndProjects;
  } catch {
    return undefined;
  }
}

export async function generateMetadata(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}): Promise<Metadata> {
  const params = await props.params;
  try {
    const info = await getContractPageParamsInfo(params);

    if (!info) {
      throw new Error();
    }

    const [functionSelectors, contractMetadata] = await Promise.all([
      resolveFunctionSelectors(info.serverContract),
      getContractMetadata({
        contract: info.serverContract,
      }),
    ]);

    if (contractMetadata.name === null) {
      throw new Error();
    }

    const { isERC1155, isERC20, isERC721 } = supportedERCs(functionSelectors);

    const contractDisplayName = `${contractMetadata.name}${
      contractMetadata.symbol ? ` (${contractMetadata.symbol})` : ""
    }`;

    const cleanedChainName = info?.chainMetadata?.name
      .replace("Mainnet", "")
      .replace("Testnet", "")
      .trim();

    const title = `${contractDisplayName} | ${cleanedChainName} Smart Contract`;
    let description = "";

    if (isERC721 || isERC1155) {
      description = `View tokens, source code, transactions, balances, and analytics for the ${contractDisplayName} smart contract on ${cleanedChainName}.`;
    } else if (isERC20) {
      description = `View ERC20 tokens, transactions, balances, source code, and analytics for the ${contractDisplayName} smart contract on ${cleanedChainName}`;
    } else {
      description = `View tokens, transactions, balances, source code, and analytics for the ${contractDisplayName} smart contract  on ${cleanedChainName}`;
    }

    return {
      title: title,
      description: description,
    };
  } catch {
    return {
      title: `${shortenIfAddress(params.contractAddress)} | ${params.chain_id}`,
      description: `View tokens, transactions, balances, source code, and analytics for the smart contract  on Chain ID ${params.chain_id}`,
    };
  }
}
