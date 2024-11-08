import { notFound, redirect } from "next/navigation";
import { defineChain, getChainMetadata, localhost } from "thirdweb/chains";
import { eth_getCode, getRpcClient } from "thirdweb/rpc";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { DataTable } from "./data-table";

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

  const _originalCode = await eth_getCode(
    getRpcClient({
      client: contract.client,
      chain: contract.chain,
    }),
    {
      address: contract.address,
    },
  );

  const topOPStackChainIds = [
    8453, // Base
    10, // OP Mainnet
    34443, // Mode Network
    7560, // Cyber
    7777777, // Zora
  ];

  const chainsDeployedOn = await Promise.all(
    topOPStackChainIds.map(async (chainId) => {
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
        status: code === _originalCode ? "DEPLOYED" : "NOT_DEPLOYED",
      };
    }),
  );

  return <DataTable data={chainsDeployedOn} />;
}
