import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import type { MinimalTeamsAndProjects } from "components/contract-components/contract-deploy-form/add-to-project-card";
import { resolveFunctionSelectors } from "lib/selectors";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContractMetadata } from "thirdweb/extensions/common";
import { isAddress, isContractDeployed } from "thirdweb/utils";
import { shortenIfAddress } from "utils/usedapp-external";
import { NebulaChatButton } from "../../../../../nebula-app/(app)/components/FloatingChat/FloatingChat";
import { examplePrompts } from "../../../../../nebula-app/(app)/data/examplePrompts";
import { getAuthTokenWalletAddress } from "../../../../api/lib/getAuthToken";
import type { ProjectMeta } from "../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { TeamHeader } from "../../../../team/components/TeamHeader/team-header";
import { ConfigureCustomChain } from "./_layout/ConfigureCustomChain";
import { getContractMetadataHeaderData } from "./_layout/contract-metadata";
import { ContractPageLayout } from "./_layout/contract-page-layout";
import { ContractPageLayoutClient } from "./_layout/contract-page-layout.client";
import { supportedERCs } from "./_utils/detectedFeatures/supportedERCs";
import { getContractPageParamsInfo } from "./_utils/getContractFromParams";
import { getContractPageMetadata } from "./_utils/getContractPageMetadata";
import { getContractPageSidebarLinks } from "./_utils/getContractPageSidebarLinks";
import { shouldRenderNewPublicPage } from "./_utils/newPublicPage";

export async function SharedContractLayout(props: {
  contractAddress: string;
  chainIdOrSlug: string;
  projectMeta: ProjectMeta | undefined;
  children: React.ReactNode;
  authToken: string | undefined | null;
}) {
  if (!isAddress(props.contractAddress)) {
    return notFound();
  }

  const [info, accountAddress, teamsAndProjects] = await Promise.all([
    getContractPageParamsInfo({
      contractAddress: props.contractAddress,
      chainIdOrSlug: props.chainIdOrSlug,
      teamId: props.projectMeta?.teamId,
    }),
    getAuthTokenWalletAddress(),
    getTeamsAndProjectsIfLoggedIn(),
  ]);

  if (!info) {
    return (
      <ConfigureCustomChain
        chainSlug={props.chainIdOrSlug}
        client={getClientThirdwebClient({
          jwt: props.authToken,
          teamId: props.projectMeta?.teamId,
        })}
      />
    );
  }

  const { clientContract, serverContract, chainMetadata, isLocalhostChain } =
    info;

  if (chainMetadata.status === "deprecated") {
    notFound();
  }

  if (isLocalhostChain) {
    return (
      <ConditionalTeamHeaderLayout projectMeta={props.projectMeta}>
        <ContractPageLayoutClient
          chainMetadata={chainMetadata}
          contract={clientContract}
          teamsAndProjects={teamsAndProjects}
          projectMeta={props.projectMeta}
        >
          {props.children}
        </ContractPageLayoutClient>
      </ConditionalTeamHeaderLayout>
    );
  }

  // if rendering new public page - do not render the old layout
  if (!props.projectMeta) {
    const shouldHide = await shouldRenderNewPublicPage(info.serverContract);
    if (shouldHide) {
      return props.children;
    }
  }

  const [
    isValidContract,
    contractPageMetadata,
    { contractMetadata, externalLinks },
  ] = await Promise.all([
    isContractDeployed(serverContract).catch(() => false),
    getContractPageMetadata(serverContract),
    getContractMetadataHeaderData(serverContract),
  ]);

  // check if the contract exists
  if (!isValidContract) {
    // TODO - replace 404 with a better page to upsell deploy or other thirdweb products
    notFound();
  }

  const sidebarLinks = getContractPageSidebarLinks({
    chainSlug: chainMetadata.slug,
    contractAddress: serverContract.address,
    metadata: contractPageMetadata,
    projectMeta: props.projectMeta,
  });

  const contractAddress = serverContract.address;
  const chainName = chainMetadata.name;
  const chainId = chainMetadata.chainId;

  const contractPromptPrefix = `A user is viewing the contract address ${contractAddress} on ${chainName} (Chain ID: ${chainId}). Provide a concise summary of this contract's functionalities, such as token minting, staking, or governance mechanisms. Focus on what the contract enables users to do, avoiding transaction execution details unless requested.
Users may be interested in how to interact with the contract. Outline common interaction patterns, such as claiming rewards, participating in governance, or transferring assets. Emphasize the contract's capabilities without guiding through transaction processes unless asked.
Provide insights into how the contract is being used. Share information on user engagement, transaction volumes, or integration with other dApps, focusing on the contract's role within the broader ecosystem.
Users may be considering integrating the contract into their applications. Discuss how this contract's functionalities can be leveraged within different types of dApps, highlighting potential use cases and benefits.

The following is the user's message:`;

  return (
    <ConditionalTeamHeaderLayout projectMeta={props.projectMeta}>
      <ContractPageLayout
        chainMetadata={chainMetadata}
        contract={clientContract}
        sidebarLinks={sidebarLinks}
        dashboardContractMetadata={contractMetadata}
        externalLinks={externalLinks}
        teamsAndProjects={teamsAndProjects}
        projectMeta={props.projectMeta}
      >
        <NebulaChatButton
          isLoggedIn={!!accountAddress}
          networks={info.chainMetadata.testnet ? "testnet" : "mainnet"}
          isFloating={true}
          pageType="contract"
          label="Ask AI about this contract"
          client={clientContract.client}
          nebulaParams={{
            messagePrefix: contractPromptPrefix,
            chainIds: [chainId],
            wallet: accountAddress ?? undefined,
          }}
          examplePrompts={examplePrompts}
        />
        {props.children}
      </ContractPageLayout>
    </ConditionalTeamHeaderLayout>
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

export async function generateContractLayoutMetadata(params: {
  contractAddress: string;
  chainIdOrSlug: string;
}): Promise<Metadata> {
  try {
    const info = await getContractPageParamsInfo({
      contractAddress: params.contractAddress,
      chainIdOrSlug: params.chainIdOrSlug,
      teamId: undefined,
    });

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
      title: `${shortenIfAddress(params.contractAddress)} | ${params.chainIdOrSlug}`,
      description: `View tokens, transactions, balances, source code, and analytics for the smart contract  on Chain ID ${params.chainIdOrSlug}`,
    };
  }
}

function ConditionalTeamHeaderLayout({
  children,
  projectMeta,
}: { children: React.ReactNode; projectMeta: ProjectMeta | undefined }) {
  // if inside a project page - do not another team header
  if (projectMeta) {
    return children;
  }

  return (
    <div className="flex grow flex-col">
      <div className="border-border border-b bg-card">
        <TeamHeader />
      </div>
      {children}
    </div>
  );
}
