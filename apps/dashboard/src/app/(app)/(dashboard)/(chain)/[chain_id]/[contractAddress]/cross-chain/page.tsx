import { fetchPublishedContractsFromDeploy } from "components/contract-components/fetchPublishedContractsFromDeploy";
import { notFound } from "next/navigation";
import {
  type ContractOptions,
  eth_getTransactionByHash,
  eth_getTransactionReceipt,
  getContractEvents,
  parseEventLogs,
  prepareEvent,
} from "thirdweb";
import { defineChain, getChainMetadata } from "thirdweb/chains";
import {
  type FetchDeployMetadataResult,
  getContract,
  getDeployedCloneFactoryContract,
  resolveContractAbi,
} from "thirdweb/contract";
import { moduleInstalledEvent } from "thirdweb/modules";
import { eth_getCode, getRpcClient } from "thirdweb/rpc";
import type { TransactionReceipt } from "thirdweb/transaction";
import { type AbiFunction, decodeFunctionData } from "thirdweb/utils";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { DataTable } from "./data-table";
import { NoCrossChainPrompt } from "./no-crosschain-prompt";

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

  const ProxyDeployedEvent = prepareEvent({
    signature:
      "event ProxyDeployedV2(address indexed implementation, address indexed proxy, address indexed deployer, bytes32 inputSalt, bytes data, bytes extraData)",
    filters: {
      proxy: params.contractAddress.toLowerCase(),
    },
  });

  if (!info) {
    notFound();
  }

  const { clientContract, serverContract } = info;

  const isModularCore = (await getContractPageMetadata(serverContract))
    .isModularCore;

  let twCloneFactoryContract: Readonly<
    ContractOptions<[], `0x${string}`>
  > | null = null;
  try {
    twCloneFactoryContract = await getDeployedCloneFactoryContract({
      chain: serverContract.chain,
      client: serverContract.client,
    });
  } catch {}

  const originalCode = await eth_getCode(
    getRpcClient({
      client: serverContract.client,
      chain: serverContract.chain,
    }),
    {
      address: serverContract.address,
    },
  );

  let initCode: `0x${string}` = "0x";
  let creationTxReceipt: TransactionReceipt | undefined;
  let isDirectDeploy = false;
  try {
    const res = await fetch(
      `https://contract.thirdweb-dev.com/creation/${serverContract.chain.id}/${serverContract.address}`,
    );
    const creationData = await res.json();

    if (creationData.status === "1" && creationData.result[0]?.txHash) {
      const rpcClient = getRpcClient({
        client: serverContract.client,
        chain: serverContract.chain,
      });
      creationTxReceipt = await eth_getTransactionReceipt(rpcClient, {
        hash: creationData.result[0]?.txHash,
      });

      const creationTx = await eth_getTransactionByHash(rpcClient, {
        hash: creationData.result[0]?.txHash,
      });

      initCode = creationTx.input;
      isDirectDeploy =
        creationTx.to?.toLowerCase() ===
        "0x4e59b44847b379578588920cA78FbF26c0B4956C".toLowerCase();
    }
  } catch (e) {
    console.debug(e);
  }

  let initializeData: `0x${string}` | undefined;
  let inputSalt: `0x${string}` | undefined;
  let creationBlockNumber: bigint | undefined;

  if (twCloneFactoryContract) {
    const events = await getContractEvents({
      contract: twCloneFactoryContract,
      events: [ProxyDeployedEvent],
    });
    const event = events.find(
      (e) =>
        e.args.proxy.toLowerCase() === params.contractAddress.toLowerCase(),
    );

    initializeData = event?.args.data;
    inputSalt = event?.args.inputSalt;
    creationBlockNumber = event?.blockNumber;
  }

  const defaultChains = [
    1, 137, 8453, 10, 42161, 11155111, 84532, 11155420, 421614,
  ];

  const chainsDeployedOn = (
    await Promise.all(
      defaultChains.map(async (c) => {
        // eslint-disable-next-line no-restricted-syntax
        const chain = defineChain(c);

        try {
          const chainMetadata = await getChainMetadata(chain);

          const rpcRequest = getRpcClient({
            client: serverContract.client,
            chain,
          });
          const code = await eth_getCode(rpcRequest, {
            address: params.contractAddress,
          });

          return {
            id: chain.id,
            network: chainMetadata.name,
            chainId: chain.id,
            status:
              code === originalCode
                ? ("DEPLOYED" as const)
                : ("NOT_DEPLOYED" as const),
          };
        } catch {
          return {
            id: chain.id,
            network: "",
            chainId: chain.id,
            status: "NOT_DEPLOYED" as const,
          };
        }
      }),
    )
  ).filter((c) => c.chainId !== serverContract.chain.id);

  let coreMetadata: FetchDeployMetadataResult | undefined;
  try {
    coreMetadata = (
      await fetchPublishedContractsFromDeploy({
        contract: serverContract,
        client: serverContract.client,
      })
    ).at(-1) as FetchDeployMetadataResult;
  } catch {}

  if (!coreMetadata) {
    return NoCrossChainPrompt();
  }

  let modulesMetadata: FetchDeployMetadataResult[] | undefined;

  if (isModularCore) {
    let modules: string[] | undefined;
    const moduleEvent = moduleInstalledEvent();
    // extract module address in ModuleInstalled events from transaction receipt
    if (creationTxReceipt) {
      const decodedEvent = parseEventLogs({
        events: [moduleEvent],
        logs: creationTxReceipt.logs,
      });

      modules = decodedEvent.map((e) => e.args.installedModule);
    }

    // fetch events from contract
    if (!modules && creationBlockNumber) {
      const events = await getContractEvents({
        contract: serverContract,
        events: [moduleEvent],
      });

      const filteredEvents = events.filter(
        (e) => e.blockNumber === creationBlockNumber,
      );

      modules = filteredEvents.map((e) => e.args.installedModule);
    }

    // if receipt not available, try extracting module address from initialize data
    if (!modules && initializeData) {
      // biome-ignore lint/suspicious/noExplicitAny: FIXME
      const decodedData: any = await decodeFunctionData({
        contract: serverContract,
        data: initializeData,
      });

      const abi = await resolveContractAbi(serverContract).catch(
        () => undefined,
      );

      if (abi) {
        const initializeFunction = abi.find(
          (i: AbiFunction) => i.type === "function" && i.name === "initialize",
        ) as unknown as AbiFunction;

        const moduleIndex = initializeFunction.inputs.findIndex(
          (i) => i.name === "_modules" || i.name === "modules",
        );

        modules = moduleIndex ? decodedData[moduleIndex] : undefined;
      }
    }

    modulesMetadata = modules
      ? ((await Promise.all(
          modules.map(async (m) =>
            (
              await fetchPublishedContractsFromDeploy({
                contract: getContract({
                  chain: serverContract.chain,
                  client: serverContract.client,
                  address: m,
                }),
                client: serverContract.client,
              })
            ).at(-1),
          ),
        )) as FetchDeployMetadataResult[])
      : undefined;
  }

  if (!isDirectDeploy && !initializeData) {
    return NoCrossChainPrompt();
  }

  return (
    <>
      <div>
        <h2 className="mb-1 font-bold text-2xl tracking-tight">
          Cross-chain contracts
        </h2>
        <p className="text-muted-foreground">
          Deterministically deploy and interact with your contracts on multiple
          networks.
        </p>
      </div>
      <div className="h-10" />
      <DataTable
        coreMetadata={coreMetadata}
        modulesMetadata={modulesMetadata}
        initializeData={initializeData}
        inputSalt={inputSalt}
        data={chainsDeployedOn}
        coreContract={clientContract}
        initCode={initCode}
        isDirectDeploy={isDirectDeploy}
      />
    </>
  );
}
