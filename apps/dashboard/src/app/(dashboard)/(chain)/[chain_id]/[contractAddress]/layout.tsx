import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import { isAddress, isContractDeployed } from "thirdweb/utils";
import type { MinimalTeamsAndProjects } from "../../../../../components/contract-components/contract-deploy-form/add-to-project-card";
import { resolveFunctionSelectors } from "../../../../../lib/selectors";
import { shortenIfAddress } from "../../../../../utils/usedapp-external";
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

  const { contract, chainMetadata } = info;

  if (chainMetadata.status === "deprecated") {
    notFound();
  }

  const client = getThirdwebClient();
  const teamsAndProjects = await getTeamsAndProjectsIfLoggedIn();

  if (contract.chain.id === localhost.id) {
    return (
      <ContractPageLayoutClient
        chainMetadata={chainMetadata}
        contract={contract}
        teamsAndProjects={teamsAndProjects}
        client={client}
      >
        {props.children}
      </ContractPageLayoutClient>
    );
  }

  // check if the contract exists
  const isValidContract = await isContractDeployed(contract).catch(() => false);
  if (!isValidContract) {
    // TODO - replace 404 with a better page to upsell deploy or other thirdweb products
    notFound();
  }
  const contractPageMetadata = await getContractPageMetadata(contract);

  const sidebarLinks = getContractPageSidebarLinks({
    chainSlug: chainMetadata.slug,
    contractAddress: contract.address,
    metadata: contractPageMetadata,
  });

  const { contractMetadata, externalLinks } =
    await getContractMetadataHeaderData(contract);

  return (
    <ContractPageLayout
      chainMetadata={chainMetadata}
      contract={contract}
      sidebarLinks={sidebarLinks}
      dashboardContractMetadata={contractMetadata}
      externalLinks={externalLinks}
      teamsAndProjects={teamsAndProjects}
      client={client}
    >
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
      resolveFunctionSelectors(info.contract),
      getContractMetadata({
        contract: info.contract,
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
