import { fetchPublishedContractsFromDeploy } from "components/contract-components/fetchPublishedContractsFromDeploy";
import { notFound, redirect } from "next/navigation";
import { getContractEvents, prepareEvent } from "thirdweb";
import { defineChain, getChainMetadata, localhost } from "thirdweb/chains";
import {
  type FetchDeployMetadataResult,
  getContract,
  getDeployedCloneFactoryContract,
} from "thirdweb/contract";
import { getInstalledModules } from "thirdweb/modules";
import { eth_getCode, getRpcClient } from "thirdweb/rpc";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { DataTable } from "./data-table";

export function getModuleInstallParams(mod: FetchDeployMetadataResult) {
  return (
    mod.abi
      .filter((a) => a.type === "function")
      .find((f) => f.name === "encodeBytesOnInstall")?.inputs || []
  );
}

export default async function Page(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}) {
  const params = await props.params;
  const info = await getContractPageParamsInfo(params);

  if (!info) {
    notFound();
  }

  const { contract } = info;

  if (contract.chain.id === localhost.id) {
    return <div>asd</div>;
  }

  const { isModularCore } = await getContractPageMetadata(contract);

  if (!isModularCore) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  const originalCode = await eth_getCode(
    getRpcClient({
      client: contract.client,
      chain: contract.chain,
    }),
    {
      address: contract.address,
    },
  );

  const topOPStackTestnetChainIds = [
    84532, // Base
    11155420, // OP testnet
    919, // Mode Network
    111557560, // Cyber
    999999999, // Zora
  ];

  const chainsDeployedOn = await Promise.all(
    topOPStackTestnetChainIds.map(async (chainId) => {
      // eslint-disable-next-line no-restricted-syntax
      const chain = defineChain(chainId);
      const chainMetadata = await getChainMetadata(chain);

      const rpcRequest = getRpcClient({
        client: contract.client,
        chain,
      });
      const code = await eth_getCode(rpcRequest, {
        address: params.contractAddress,
      });

      return {
        id: chainId,
        network: chainMetadata.name,
        chainId: chain.id,
        status:
          code === originalCode
            ? ("DEPLOYED" as const)
            : ("NOT_DEPLOYED" as const),
      };
    }),
  );

  const modules = await getInstalledModules({ contract });

  const coreMetadata = (
    await fetchPublishedContractsFromDeploy({
      contract,
      client: contract.client,
    })
  ).at(-1) as FetchDeployMetadataResult;
  const modulesMetadata = (await Promise.all(
    modules.map(async (m) =>
      (
        await fetchPublishedContractsFromDeploy({
          contract: getContract({
            chain: contract.chain,
            client: contract.client,
            address: m.implementation,
          }),
          client: contract.client,
        })
      ).at(-1),
    ),
  )) as FetchDeployMetadataResult[];

  const ProxyDeployedEvent = prepareEvent({
    signature:
      "event ProxyDeployed(address indexed implementation, address proxy, address indexed deployer, bytes data)",
  });

  const twCloneFactoryContract = await getDeployedCloneFactoryContract({
    chain: contract.chain,
    client: contract.client,
  });

  if (!twCloneFactoryContract) {
    throw new Error("Factory not found");
  }

  const events = await getContractEvents({
    contract: twCloneFactoryContract,
    events: [ProxyDeployedEvent],
    blockRange: 123456n,
  });
  const event = events.find((e) => e.args.proxy === params.contractAddress);

  return (
    <DataTable
      coreMetadata={coreMetadata}
      modulesMetadata={modulesMetadata}
      initializeData={event?.args.data}
      data={chainsDeployedOn}
      coreContract={contract}
    />
  );
}
