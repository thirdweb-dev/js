import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IPFS_GATEWAY_URL } from "@/constants/env";
import { DASHBOARD_THIRDWEB_SECRET_KEY, PROD_OR_DEV_URL } from "constants/rpc";
import {
  ZERO_ADDRESS,
  createThirdwebClient,
  defineChain,
  toTokens,
} from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import {
  eth_getBlockByHash,
  eth_getTransactionByHash,
  eth_getTransactionReceipt,
  getRpcClient,
} from "thirdweb/rpc";
import { hexToNumber, shortenAddress, toEther } from "thirdweb/utils";
import { getChain } from "../../../utils";

function defineDashboardChain(chainId: number, dashboardChain?: ChainMetadata) {
  return defineChain({
    id: chainId,
    rpc:
      dashboardChain?.rpc?.[0] || `https://${chainId}.rpc.${PROD_OR_DEV_URL}`,
    slug: dashboardChain?.slug,
    nativeCurrency: dashboardChain?.nativeCurrency,
  });
}

export default async function Page(props: {
  params: { chain_id: string; txHash: `0x${string}` };
}) {
  const thirdwebClient = createThirdwebClient({
    secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
    config: {
      storage: {
        gatewayUrl: IPFS_GATEWAY_URL,
      },
    },
  });
  const chain = await getChain(props.params.chain_id);

  const rpcRequest = getRpcClient({
    client: thirdwebClient,
    chain: defineDashboardChain(chain.chainId),
  });

  const [transaction, receipt] = await Promise.all([
    eth_getTransactionByHash(rpcRequest, {
      hash: props.params.txHash,
    }),
    eth_getTransactionReceipt(rpcRequest, {
      hash: props.params.txHash,
    }),
  ]);
  if (!transaction.blockHash) {
    return <div>no tx found</div>;
  }
  const block = await eth_getBlockByHash(rpcRequest, {
    blockHash: transaction.blockHash,
  });

  return (
    <main className="flex flex-col gap-y-10 container py-6">
      <header className="flex flex-col gap-y-2">
        <p className="text-3xl font-bold">Transaction Details</p>
        <div className="flex gap-x-2">
          {shortenAddress(transaction.from)} called on{" "}
          {shortenAddress(transaction.to || ZERO_ADDRESS)}
        </div>
      </header>

      <Separator orientation="horizontal" />

      <section className="flex flex-col gap-y-2">
        <div className="grid grid-cols-2">
          <div className="flex gap-x-2 items-center">Transaction hash</div>
          <p>{transaction.hash}</p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex gap-x-2 items-center">
            Status {/* and method */}
          </div>
          <div className="flex gap-x-2">
            <Badge
              className={
                receipt.status === "success" ? "bg-green-500" : "bg-red-500"
              }
            >
              {receipt.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex gap-x-2 items-center">Block</div>
          <p>{Number(transaction.blockNumber)}</p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex gap-x-2 items-center">Timestamp</div>
          <p>
            {new Date(
              Number.parseInt(block.timestamp.toString()) * 1000,
            ).toLocaleString()}
          </p>
        </div>
      </section>

      <Separator orientation="horizontal" />

      <section className="flex flex-col gap-y-2">
        <div className="grid grid-cols-2">
          <div className="flex gap-x-2 items-center">From</div>
          <p>{transaction.from}</p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex gap-x-2 items-center">
            Interacted with contract
          </div>
          <p>{transaction.to}</p>
        </div>
      </section>

      <Separator orientation="horizontal" />

      <section className="flex flex-col gap-y-2">
        <div className="grid grid-cols-2">
          <div className="flex gap-x-2 items-center">Value</div>
          <p>{toEther(transaction.value)} ETH</p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex gap-x-2 items-center">Transaction fee</div>
          <p>{toEther((transaction.gasPrice || 0n) * receipt.gasUsed)} ETH</p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex gap-x-2 items-center">Gas price</div>
          <p>{toEther(transaction.gasPrice || 0n)} ETH</p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex gap-x-2 items-center">Gas usage</div>
          <p>{receipt.gasUsed.toString()}</p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex gap-x-2 items-center">Gas fees (Gwei)</div>
          <p>
            Base: {toTokens(block.baseFeePerGas || 0n, 9)} | Max:{" "}
            {toTokens(transaction.maxFeePerGas || 0n, 9)} | Max priority:{" "}
            {transaction.maxPriorityFeePerGas?.toString()}
          </p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex gap-x-2 items-center">Burnt fees</div>
          <p>{toEther(block.baseFeePerGas || 0n * receipt.gasUsed)}</p>
        </div>
      </section>

      <Separator orientation="horizontal" />

      <section className="flex flex-col gap-y-2">
        <div className="grid grid-cols-2">
          <div className="flex gap-x-2 items-center">Other</div>
          <p>
            Txn type: {hexToNumber(transaction.typeHex || "0x0")} (
            {transaction.type}) | Nonce: {transaction.nonce} | Position:{" "}
            {transaction.transactionIndex}
          </p>
        </div>

        <div className="grid grid-cols-2 items-start">
          <div className="flex gap-x-2 items-center">Raw Input:</div>
          <div className="bg-secondary p-4 rounded-lg break-words text-sm">
            {transaction.input}
          </div>
        </div>
      </section>
    </main>
  );
}
