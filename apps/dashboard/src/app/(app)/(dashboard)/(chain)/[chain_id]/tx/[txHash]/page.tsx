import { Button } from "@workspace/ui/components/button";
import { PlainTextCodeBlock } from "@workspace/ui/components/code/plaintext-code";
import { ToolTipLabel } from "@workspace/ui/components/tooltip";
import { formatDate, formatDistanceToNowStrict, fromUnixTime } from "date-fns";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  Clock4Icon,
  InfoIcon,
} from "lucide-react";
import { toTokens } from "thirdweb";
import { status } from "thirdweb/bridge";
import type { ChainMetadata } from "thirdweb/chains";
import {
  eth_getBlockByHash,
  eth_getTransactionByHash,
  eth_getTransactionReceipt,
  getRpcClient,
} from "thirdweb/rpc";
import type { TransactionReceipt } from "thirdweb/transaction";
import { hexToNumber, toEther } from "thirdweb/utils";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { mapV4ChainToV5Chain } from "@/utils/map-chains";
import { getChain } from "../../../utils";
import { BridgeStatusWithPolling } from "./bridge-status";
import { BridgeAndOverviewTabs } from "./tabs";

type Transaction = Awaited<ReturnType<typeof eth_getTransactionByHash>>;

export default async function Page(props: {
  params: Promise<{ chain_id: string; txHash: `0x${string}` }>;
}) {
  const params = await props.params;
  const chain = await getChain(params.chain_id);

  const rpcRequest = getRpcClient({
    // Do not include chain overrides for chain pages
    // eslint-disable-next-line no-restricted-syntax
    chain: mapV4ChainToV5Chain(chain),
    client: serverThirdwebClient,
  });

  const [transaction, receipt, bridgeStatus] = await Promise.all([
    eth_getTransactionByHash(rpcRequest, {
      hash: params.txHash,
    }).catch(() => undefined),
    eth_getTransactionReceipt(rpcRequest, {
      hash: params.txHash,
    }).catch(() => undefined),
    status({
      chainId: chain.chainId,
      transactionHash: params.txHash,
      client: serverThirdwebClient,
    }).catch(() => undefined),
  ]);

  if (!transaction?.blockHash || !receipt) {
    return (
      <div className="flex flex-col items-center justify-center grow">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-2 rounded-full bg-background border">
            <CircleAlertIcon className="size-5 text-muted-foreground" />
          </div>
          Transaction not found
        </div>
      </div>
    );
  }

  const block = await eth_getBlockByHash(rpcRequest, {
    blockHash: transaction.blockHash,
  });

  const overviewContent = (
    <GeneericTxDetails
      transaction={transaction}
      receipt={receipt}
      block={block}
      chain={chain}
    />
  );

  return (
    <main className="pb-20">
      <div className="flex h-14 items-center border-border border-b">
        <Breadcrumb className="container max-w-6xl">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/chainlist">Chainlist</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${chain.slug}`}>
                {chain.name.replace("Mainnet", "")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Transaction Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container max-w-6xl py-10">
        <h1 className="font-semibold text-3xl tracking-tight">
          Transaction Details
        </h1>
      </div>

      <div className="container max-w-6xl">
        {bridgeStatus ? (
          <BridgeAndOverviewTabs
            bridgeStatus={
              <BridgeStatusWithPolling
                bridgeStatus={bridgeStatus}
                client={getClientThirdwebClient()}
                chainId={chain.chainId}
                transactionHash={params.txHash}
              />
            }
            overview={overviewContent}
          />
        ) : (
          overviewContent
        )}
      </div>
    </main>
  );
}

function GeneericTxDetails(props: {
  transaction: Transaction;
  receipt: TransactionReceipt;
  block: {
    timestamp: bigint;
    baseFeePerGas: bigint | null;
  };
  chain: ChainMetadata;
}) {
  const { transaction, receipt, chain, block } = props;

  const timestamp = getDatefromTimestamp(block.timestamp);

  return (
    <div className="border  rounded-xl p-4 lg:p-6 bg-card">
      {/* section 1 */}
      <section className="border-b pb-6 space-y-5 lg:space-y-3">
        <GridItem
          label="Transaction hash"
          tooltip="A TxHash or transaction hash is a unique 66-character identifier that is generated whenever a transaction is executed."
        >
          <CopyTextButton
            textToCopy={transaction.hash}
            textToShow={transaction.hash}
            tooltip="Copy transaction hash"
            variant="ghost"
            copyIconPosition="right"
            className="truncate -translate-x-1.5 max-w-full"
          />
        </GridItem>

        <GridItem label="Status" tooltip="The status of the transaction.">
          <Badge
            className="py-0.5 gap-1.5 px-1.5 capitalize"
            variant={receipt.status === "success" ? "success" : "destructive"}
          >
            {receipt.status === "success" ? (
              <CircleCheckIcon className="size-3" />
            ) : (
              <CircleAlertIcon className="size-3" />
            )}
            {receipt.status}
          </Badge>
        </GridItem>

        {transaction.blockNumber && (
          <GridItem
            label="Block"
            tooltip="Number of the block in which the transaction is recorded. Block confirmations indicate how many blocks have been added since the transaction was produced."
          >
            <p>{Number(transaction.blockNumber)}</p>
          </GridItem>
        )}

        {timestamp && (
          <GridItem
            label="Timestamp"
            tooltip="The date and time at which a transaction is validated."
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              <Clock4Icon className="size-3" />
              <p>
                {formatDistanceToNowStrict(timestamp, {
                  addSuffix: true,
                })}
              </p>
              <p>({formatDate(timestamp, "PP pp z")})</p>
            </div>
          </GridItem>
        )}
      </section>

      {/* section 2 */}
      <section className="border-b py-6 space-y-5 lg:space-y-3">
        <GridItem label="From" tooltip="The sending party of the transaction.">
          <CopyTextButton
            textToCopy={transaction.from}
            textToShow={transaction.from}
            tooltip="Copy from address"
            variant="ghost"
            copyIconPosition="right"
            className="truncate -translate-x-1.5 max-w-full"
          />
        </GridItem>

        {transaction.to && (
          <GridItem
            label="Interacted with (To)"
            tooltip="The receiving party of the transaction (could be a contract address)."
          >
            <CopyTextButton
              textToCopy={transaction.to}
              textToShow={transaction.to}
              tooltip="Copy to address"
              variant="ghost"
              copyIconPosition="right"
              className="truncate -translate-x-1.5 max-w-full"
            />
          </GridItem>
        )}
      </section>

      {/* section 3 */}
      <section className="py-6 space-y-5 lg:space-y-3 border-b">
        <GridItem
          label="Value"
          tooltip="The value being transacted in ETH and fiat value. Note: You can click the fiat value (if available) to see historical value at the time of transaction."
        >
          <p>
            {toEther(transaction.value)} {chain.nativeCurrency?.symbol}
          </p>
        </GridItem>

        <GridItem
          label="Transaction Fee"
          tooltip="Amount paid to the validator for processing the transaction."
        >
          <p>
            {toEther((transaction.gasPrice || 0n) * receipt.gasUsed)}{" "}
            {chain.nativeCurrency?.symbol}
          </p>
        </GridItem>

        <GridItem
          label="Gas Price"
          tooltip="The price per gas unit the sender is willing to pay"
        >
          <p>
            {toEther(transaction.gasPrice || 0n)} {chain.nativeCurrency?.symbol}
          </p>
        </GridItem>

        <GridItem
          label="Gas Usage"
          tooltip="The amount of gas used by the transaction."
        >
          <p>{receipt.gasUsed.toString()}</p>
        </GridItem>

        <GridItem
          label="Gas Fees"
          tooltip="Base Fee refers to the network Base Fee at the time of the block, while Max Fee & Max Priority Fee refer to the max amount a user is willing to pay for their tx & to give to the miner respectively."
        >
          <p className="flex gap-2.5">
            <span>Base: {toTokens(block.baseFeePerGas || 0n, 9)} Gwei</span>

            {transaction.maxFeePerGas && (
              <>
                <span className="text-muted-foreground/50">|</span>
                <span>
                  Max: {toTokens(transaction.maxFeePerGas || 0n, 9)} Gwei
                </span>
              </>
            )}

            {transaction.maxPriorityFeePerGas && (
              <>
                <span className="text-muted-foreground/50">|</span>
                <span>
                  Max priority: {transaction.maxPriorityFeePerGas?.toString()}{" "}
                  Gwei
                </span>
              </>
            )}
          </p>
        </GridItem>

        <GridItem
          label="Burnt fees"
          tooltip="The amount of fees that were burnt by the transaction."
        >
          <p>
            {toEther((block.baseFeePerGas || 0n) * receipt.gasUsed)}{" "}
            {chain.nativeCurrency?.symbol}
          </p>
        </GridItem>
      </section>

      {/* section 4 */}
      <section className="pt-6 space-y-5 lg:space-y-3">
        <GridItem
          label="Other Attributes"
          tooltip="Other data related to this transaction."
        >
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1 py-1">
              <span className="text-muted-foreground">Txn type:</span>
              <span className="capitalize">
                {hexToNumber(transaction.typeHex || "0x0")} ({transaction.type})
              </span>
            </Badge>
            <Badge variant="outline" className="gap-1 py-1">
              <span className="text-muted-foreground">Nonce: </span>
              <span>{transaction.nonce}</span>
            </Badge>
            <Badge variant="outline" className="gap-1 py-1">
              <span className="text-muted-foreground">Position: </span>
              <span>{transaction.transactionIndex}</span>
            </Badge>
          </div>
        </GridItem>

        <GridItem
          label="Input Data"
          tooltip="Additional data included for this transaction. Commonly used as part of contract interaction or as a message sent to the recipient."
        >
          <PlainTextCodeBlock
            code={transaction.input}
            className="[&_code]:!whitespace-pre-wrap break-all [&_code]:text-xs text-muted-foreground w-full"
            scrollableClassName="max-h-[400px] p-2 min-h-[80px]"
          />
        </GridItem>
      </section>
    </div>
  );
}

function GridItem(props: {
  label: string;
  children: React.ReactNode;
  tooltip?: string;
}) {
  return (
    <div className="flex flex-col gap-1 lg:grid grid-cols-[300px_1fr] items-start">
      <div className="flex items-center gap-0.5">
        <ToolTipLabel label={props.tooltip}>
          <Button
            asChild
            variant="ghost"
            className="h-auto w-auto p-1 hidden lg:block"
          >
            <div>
              <InfoIcon className="size-3.5 text-muted-foreground" />
            </div>
          </Button>
        </ToolTipLabel>
        <p className="text-muted-foreground text-sm">{props.label}</p>
      </div>
      <div className="text-sm w-full">{props.children}</div>
    </div>
  );
}

function getDatefromTimestamp(timestamp: bigint) {
  try {
    return fromUnixTime(Number(timestamp));
  } catch {
    return undefined;
  }
}
