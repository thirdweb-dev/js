import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import { ContractMetadata } from "components/custom-contract/contract-header/contract-metadata";
import { DeprecatedAlert } from "components/shared/DeprecatedAlert";
import { PrimaryDashboardButton } from "contract-ui/components/primary-dashboard-button";
import type { Metadata } from "next";
import { getContractMetadata } from "thirdweb/extensions/common";
import { resolveFunctionSelectors } from "../../../../../lib/selectors";
import { shortenIfAddress } from "../../../../../utils/usedapp-external";
import { ConfigureCustomChain } from "./ConfigureCustomChain";
import { supportedERCs } from "./_utils/detectedFeatures/supportedERCs";
import { getContractPageParamsInfo } from "./_utils/getContractFromParams";
import { getContractPageMetadata } from "./_utils/getContractPageMetadata";
import { getContractPageSidebarLinks } from "./_utils/getContractPageSidebarLinks";

export default async function Layout(props: {
  params: {
    contractAddress: string;
    chain_id: string;
  };
  children: React.ReactNode;
}) {
  const info = await getContractPageParamsInfo(props.params);

  if (!info) {
    return <ConfigureCustomChain chainSlug={props.params.chain_id} />;
  }

  const { contract, chainMetadata } = info;
  const contractPageMetadata = await getContractPageMetadata(contract);
  const sidebarLinks = getContractPageSidebarLinks({
    chainSlug: chainMetadata.slug,
    contractAddress: contract.address,
    metadata: contractPageMetadata,
  });

  return (
    <ChakraProviderSetup>
      <SidebarLayout sidebarLinks={sidebarLinks}>
        <div className="border-border border-b pb-8">
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <ContractMetadata contract={contract} chain={chainMetadata} />
              <PrimaryDashboardButton
                contractAddress={contract.address}
                chain={contract.chain}
                contractInfo={{
                  chain: chainMetadata,
                  chainSlug: chainMetadata.slug,
                  contractAddress: contract.address,
                }}
              />
            </div>
            <DeprecatedAlert chain={chainMetadata} />
          </div>
        </div>
        <div className="h-8" />
        <div className="pb-10">{props.children}</div>
      </SidebarLayout>
    </ChakraProviderSetup>
  );
}

export async function generateMetadata({
  params,
}: {
  params: {
    contractAddress: string;
    chain_id: string;
  };
}): Promise<Metadata> {
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
