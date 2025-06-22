import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContractMetadata } from "thirdweb/extensions/common";
import { isAddress, isContractDeployed } from "thirdweb/utils";
import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import type { MinimalTeamsAndProjects } from "@/components/contract-components/contract-deploy-form/add-to-project-card";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { resolveFunctionSelectors } from "@/lib/selectors";
import { shortenIfAddress } from "@/utils/usedapp-external";
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

  const [info, teamsAndProjects] = await Promise.all([
    getContractPageParamsInfo({
      chainIdOrSlug: props.chainIdOrSlug,
      contractAddress: props.contractAddress,
      teamId: props.projectMeta?.teamId,
    }),
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
          projectMeta={props.projectMeta}
          teamsAndProjects={teamsAndProjects}
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

  return (
    <ConditionalTeamHeaderLayout projectMeta={props.projectMeta}>
      <ContractPageLayout
        chainMetadata={chainMetadata}
        contract={clientContract}
        dashboardContractMetadata={contractMetadata}
        externalLinks={externalLinks}
        projectMeta={props.projectMeta}
        sidebarLinks={sidebarLinks}
        teamsAndProjects={teamsAndProjects}
      >
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
        projects: (await getProjects(team.slug)).map((x) => ({
          id: x.id,
          image: x.image,
          name: x.name,
          slug: x.slug,
        })),
        team: {
          id: team.id,
          image: team.image,
          name: team.name,
          slug: team.slug,
        },
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
      chainIdOrSlug: params.chainIdOrSlug,
      contractAddress: params.contractAddress,
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
      description: description,
      title: title,
    };
  } catch {
    return {
      description: `View tokens, transactions, balances, source code, and analytics for the smart contract  on Chain ID ${params.chainIdOrSlug}`,
      title: `${shortenIfAddress(params.contractAddress)} | ${params.chainIdOrSlug}`,
    };
  }
}

function ConditionalTeamHeaderLayout({
  children,
  projectMeta,
}: {
  children: React.ReactNode;
  projectMeta: ProjectMeta | undefined;
}) {
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
