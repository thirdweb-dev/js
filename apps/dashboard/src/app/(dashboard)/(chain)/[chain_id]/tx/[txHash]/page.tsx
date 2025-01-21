import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { mapV4ChainToV5Chain } from "contexts/map-chains";
import { ZERO_ADDRESS, toTokens } from "thirdweb";
import {
  eth_getBlockByHash,
  eth_getTransactionByHash,
  eth_getTransactionReceipt,
  getRpcClient,
} from "thirdweb/rpc";
import { hexToNumber, shortenAddress, toEther } from "thirdweb/utils";
import { getChain } from "../../../utils";

export default async function Page(props: {
  params: Promise<{ chain_id: string; txHash: `0x${string}` }>;
}) {
  const params = await props.params;
  // consider if we want to pass the JWT here, likely no need to do it but we could?
  const client = getThirdwebClient();
  const chain = await getChain(params.chain_id);

  const rpcRequest = getRpcClient({
    client,
    // Do not include chain overrides for chain pages
    // eslint-disable-next-line no-restricted-syntax
    chain: mapV4ChainToV5Chain(chain),
  });

  const [transaction, receipt] = await Promise.all([
    eth_getTransactionByHash(rpcRequest, {
      hash: params.txHash,
    }),
    eth_getTransactionReceipt(rpcRequest, {
      hash: params.txHash,
    }),
  ]);
  if (!transaction.blockHash) {
    return <div>no tx found</div>;
  }
  const block = await eth_getBlockByHash(rpcRequest, {
    blockHash: transaction.blockHash,
  });

  return (
    <main className="container flex flex-col gap-y-10 py-6">
      <header className="flex flex-col gap-y-2">
        <p className="font-bold text-3xl">Transaction Details</p>
        <div className="flex gap-x-2">
          {shortenAddress(transaction.from)} called on{" "}
          {shortenAddress(transaction.to || ZERO_ADDRESS)}
        </div>
      </header>

      <Separator orientation="horizontal" />

      <section className="flex flex-col gap-y-2">
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-x-2">Transaction hash</div>
          <p>{transaction.hash}</p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex items-center gap-x-2">
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
          <div className="flex items-center gap-x-2">Block</div>
          <p>{Number(transaction.blockNumber)}</p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex items-center gap-x-2">Timestamp</div>
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
          <div className="flex items-center gap-x-2">From</div>
          <p>{transaction.from}</p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex items-center gap-x-2">
            Interacted with contract
          </div>
          <p>{transaction.to}</p>
        </div>
      </section>

      <Separator orientation="horizontal" />

      <section className="flex flex-col gap-y-2">
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-x-2">Value</div>
          <p>{toEther(transaction.value)} ETH</p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex items-center gap-x-2">Transaction fee</div>
          <p>{toEther((transaction.gasPrice || 0n) * receipt.gasUsed)} ETH</p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex items-center gap-x-2">Gas price</div>
          <p>{toEther(transaction.gasPrice || 0n)} ETH</p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex items-center gap-x-2">Gas usage</div>
          <p>{receipt.gasUsed.toString()}</p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex items-center gap-x-2">Gas fees (Gwei)</div>
          <p>
            Base: {toTokens(block.baseFeePerGas || 0n, 9)} | Max:{" "}
            {toTokens(transaction.maxFeePerGas || 0n, 9)} | Max priority:{" "}
            {transaction.maxPriorityFeePerGas?.toString()}
          </p>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex items-center gap-x-2">Burnt fees</div>
          <p>{toEther(block.baseFeePerGas || 0n * receipt.gasUsed)}</p>
        </div>
      </section>

      <Separator orientation="horizontal" />

      <section className="flex flex-col gap-y-2">
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-x-2">Other</div>
          <p>
            Txn type: {hexToNumber(transaction.typeHex || "0x0")} (
            {transaction.type}) | Nonce: {transaction.nonce} | Position:{" "}
            {transaction.transactionIndex}
          </p>
        </div>

        <div className="grid grid-cols-2 items-start">
          <div className="flex items-center gap-x-2">Raw Input:</div>
          <div className="break-words rounded-lg bg-card p-4 text-sm">
            {transaction.input}
          </div>
        </div>
      </section>
    </main>
  );
}
