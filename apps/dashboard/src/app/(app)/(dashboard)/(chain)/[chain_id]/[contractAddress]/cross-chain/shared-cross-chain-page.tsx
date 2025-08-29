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
import { fetchPublishedContractsFromDeploy } from "@/api/contract/fetchPublishedContractsFromDeploy";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { redirectToContractLandingPage } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/utils";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { shouldRenderNewPublicPage } from "../_utils/newPublicPage";
import { DataTable } from "./data-table";
import { NoCrossChainPrompt } from "./no-crosschain-prompt";

export async function SharedCrossChainPage(props: {
  contractAddress: string;
  chainIdOrSlug: string;
  projectMeta: ProjectMeta | undefined;
}) {
  const info = await getContractPageParamsInfo({
    chainIdOrSlug: props.chainIdOrSlug,
    contractAddress: props.contractAddress,
    teamId: props.projectMeta?.teamId,
  });

  const ProxyDeployedEvent = prepareEvent({
    filters: {
      proxy: props.contractAddress.toLowerCase(),
    },
    signature:
      "event ProxyDeployedV2(address indexed implementation, address indexed proxy, address indexed deployer, bytes32 inputSalt, bytes data, bytes extraData)",
  });

  if (!info) {
    notFound();
  }

  // new public page can't show /cross-chain page
  if (!props.projectMeta) {
    const shouldHide = await shouldRenderNewPublicPage(info.serverContract);
    if (shouldHide) {
      redirectToContractLandingPage({
        chainIdOrSlug: props.chainIdOrSlug,
        contractAddress: props.contractAddress,
        projectMeta: props.projectMeta,
      });
    }
  }

  const { clientContract, serverContract } = info;

  const isModularCore = (await getContractPageMetadata(serverContract))
    .isModularCore;

  if (!isModularCore) {
    redirectToContractLandingPage({
      chainIdOrSlug: props.chainIdOrSlug,
      contractAddress: props.contractAddress,
      projectMeta: props.projectMeta,
    });
  }

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
      chain: serverContract.chain,
      client: serverContract.client,
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
        chain: serverContract.chain,
        client: serverContract.client,
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
      (e) => e.args.proxy.toLowerCase() === props.contractAddress.toLowerCase(),
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
            chain,
            client: serverContract.client,
          });
          const code = await eth_getCode(rpcRequest, {
            address: props.contractAddress,
          });

          return {
            chainId: chain.id,
            id: chain.id,
            network: chainMetadata.name,
            status:
              code === originalCode
                ? ("DEPLOYED" as const)
                : ("NOT_DEPLOYED" as const),
          };
        } catch {
          return {
            chainId: chain.id,
            id: chain.id,
            network: "",
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
                  address: m,
                  chain: serverContract.chain,
                  client: serverContract.client,
                }),
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
        coreContract={clientContract}
        coreMetadata={coreMetadata}
        data={chainsDeployedOn}
        initCode={initCode}
        initializeData={initializeData}
        inputSalt={inputSalt}
        isDirectDeploy={isDirectDeploy}
        modulesMetadata={modulesMetadata}
        projectMeta={props.projectMeta}
      />
    </>
  );
}
